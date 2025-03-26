import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";
import { ObjectId } from "mongodb";
import {
    sendNotificationEmail,
    generateEmailTemplate
} from "../../services/mailjet";

export default class CreateEvent extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/event";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { fr, en, date, time, address, price, mainPicture } = req.body;

            if (!fr?.title || !en?.title || !fr?.categories || !en?.categories || !date || !time) {
                return res.status(400).json({
                    error: "Champs obligatoires manquants.",
                });
            }

            const newEvent = {
                fr: {
                    title: fr.title,
                    description: fr.description || "",
                    categories: Array.isArray(fr.categories) ? fr.categories : [],
                },
                en: {
                    title: en.title,
                    description: en.description || "",
                    categories: Array.isArray(en.categories) ? en.categories : [],
                },
                date: new Date(date).getTime(),
                time: new Date(time).getTime(),
                address: address || "",
                price: price || "",
                mainPicture: mainPicture || { path: "" },
                createdAt: new Date(),
            };

            const result = await db.collection("events").insertOne(newEvent);

            if (!result.insertedId) {
                throw new Error("Échec de la création de l'événement.");
            }

            const insertedEvent = { ...newEvent, _id: result.insertedId };

            await notifyNewsletterSubscribers(
                `📢 Nouvel événement : ${insertedEvent.fr.title}`,
                insertedEvent.fr.description,
                `https://rhcn.ca/evenement/${insertedEvent._id.toString()}`,
                insertedEvent // <-- tu avais oublié celui-là
            );
            ``

            return res.status(201).json(insertedEvent);
        } catch (error) {
            console.error("❌ Erreur lors de la création d’un événement :", error);
            return res.status(500).json({ error: "Erreur lors de la création." });
        }
    }
}
export async function notifyNewsletterSubscribers(
    subject: string,
    content: string,
    link: string,
    event: any // l'événement complet
) {
    try {
        const subscribers = await db
            .collection("newsletter")
            .find({ unsubscribed: { $ne: true } })
            .toArray();

        for (const subscriber of subscribers) {
            const email = subscriber.email;
            if (!email) continue;

            const html = generateEmailTemplate(
                subscriber.firstname || "Cher(e) abonné(e)",
                `
    <h2 style="color: #2c3e50;">🎉 Nouveau événement à venir !</h2>

    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      <tr><td style="padding: 6px 0;"><strong>Titre (FR) :</strong></td><td>${event.fr.title}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Titre (EN) :</strong></td><td>${event.en.title}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Date :</strong></td><td>${new Date(event.date).toLocaleDateString("fr-FR")}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Heure :</strong></td><td>${new Date(event.time).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Adresse :</strong></td><td>${event.address}</td></tr>
      <tr><td style="padding: 6px 0;"><strong>Prix :</strong></td><td>${event.price || "Gratuit"}</td></tr>
    </table>

    ${event.mainPicture?.path ? `
      <div style="margin: 20px 0; text-align: center;">
        <img src="${event.mainPicture.path}" alt="Image de l'événement" style="max-width: 100%; border-radius: 8px;" />
      </div>
    ` : ""}

    <p><strong>Description (FR)</strong></p>
    <p>${event.fr.description}</p>

    <p><strong>Description (EN)</strong></p>
    <p>${event.en.description}</p>

    <div style="margin: 20px 0;">
      <a href="${link}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #2c3e50; color: white; text-decoration: none; border-radius: 6px;">
        Voir l’événement complet
      </a>
    </div>

    <p style="font-size: 13px; color: #888;">
      Pour vous désinscrire de notre newsletter, cliquez 
      <a href="https://rhcn.ca/unsubscribe?email=${encodeURIComponent(email)}" target="_blank">ici</a>.
    </p>
  `
            );

            await sendNotificationEmail({
                recipientEmail: email,
                subject,
                htmlContent: html,
            });
        }

        console.log(`✅ ${subscribers.length} abonnés notifiés.`);
    } catch (err) {
        console.error("❌ Erreur lors de la notification des abonnés :", err);
    }
}