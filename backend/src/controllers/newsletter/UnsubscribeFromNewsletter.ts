import config from "config";
import { Request, Response } from "express";
import { Client } from "node-mailjet";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import {
    sendNotificationEmail,
    generateEmailTemplate,
    defaultSender
} from "../../services/mailjet";

export default class UnsubscribeFromNewsletter extends Controller {
    public method = HttpMethod.get;
    public route = "/newsletter/unsubscribe";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const email = req.query.email?.toString().trim().toLowerCase();
            if (!email) {
                return res.status(400).send("Adresse email manquante.");
            }

            // 1. Mise à jour en base
            await db.collection("newsletter").updateOne(
                { email },
                { $set: { unsubscribed: true, unsubscribedAt: new Date() } }
            );

            // 2. Suppression de Mailjet
            const mailjet = new Client({
                apiKey: config.get("email.server.auth.MJ_APIKEY_PUBLIC"),
                apiSecret: config.get("email.server.auth.MJ_APIKEY_PRIVATE"),
            });

            await mailjet
                .post("contact", { version: "v3" })
                .id(email)
                .action("managecontactslists")
                .request({
                    ContactsLists: [
                        {
                            Action: "unsub",
                            ListID: config.get("email.newsletterListId"),
                        },
                    ],
                });

            // 3. Email de confirmation de désabonnement à l'utilisateur
            const subject = "Désinscription de la newsletter RHCN";
            const htmlContent = generateEmailTemplate("Cher abonné", `
        <p>Vous avez bien été désinscrit(e) de l’infolettre du <strong>Regroupement des Haïtiens de la Capitale-Nationale</strong>.</p>
        <p>Vous ne recevrez plus nos prochaines communications par email.</p>
        <p>Si cette désinscription était une erreur, vous pouvez vous réabonner à tout moment sur notre site :</p>
        <p><a href="https://rhcn.ca" target="_blank">Site officiel RHCN</a></p>
        <br>
        <p>Merci d’avoir été parmi nos abonnés.</p>
      `);

            await sendNotificationEmail({
                recipientEmail: email,
                subject,
                htmlContent,
            });

            // 4. Réponse HTTP simple (HTML)
            return res.status(200).send(`
        <h2>Vous avez été désinscrit(e) de la newsletter du RHCN.</h2>
        <p>Un email de confirmation vous a été envoyé.</p>
        <p>Vous pouvez vous réabonner à tout moment sur <a href="https://rhcn.ca">notre site</a>.</p>
      `);
        } catch (error) {
            console.error("❌ Erreur de désinscription :", error);
            return res.status(500).send("Une erreur est survenue pendant la désinscription.");
        }
    }
}