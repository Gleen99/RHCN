import { Request, Response } from "express";
import { defaultSender, sendNotificationEmail } from "../../services/mailjet";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class sendContactMessage extends Controller {
    public method = HttpMethod.post;
    public route = "/contact";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { type, email, message, number, firstname, lastname } = req.body;

            if (!email || !message) {
                return res.status(400).json({ message: "Email et message sont requis." });
            }

            const trimmedEmail = email.trim().toLowerCase();
            const trimmedMessage = message.trim();
            const trimmednumber = number ? number.trim() : null;
            const trimmedFirstname = firstname ? firstname.trim() : "";
            const trimmedLastname = lastname ? lastname.trim() : "";

            const name = `${trimmedFirstname} ${trimmedLastname}`.trim();

            // Insérer les données de contact dans la base de données
            const contactId = await db.collection("contact").insertOne({
                type,
                email: trimmedEmail,
                number: trimmednumber,
                message: trimmedMessage,
                firstname: trimmedFirstname,
                lastname: trimmedLastname,
                name,
                createdAt: new Date(),
            });

            const contact = await db.collection("contact").findOne({ _id: new ObjectId(contactId.insertedId) });

            if (!contact) {
                return res.status(500).json({ message: "Erreur lors de l'enregistrement du contact." });
            }

            // Préparer les emails
            const adminEmailSubject = `Nouveau message de contact de ${name || trimmedEmail}`;
            const adminEmailContent = `
                <p><strong>Nom :</strong> ${name || "Non fourni"}</p>
                <p><strong>Email :</strong> ${trimmedEmail}</p>
                ${trimmednumber ? `<p><strong>Télénumber :</strong> ${trimmednumber}</p>` : ""}
                <p><strong>Message :</strong></p>
                <p>${trimmedMessage}</p>
            `;

            const userEmailSubject = `Confirmation de votre message de contact`;
            const userEmailContent = `
                <p>Bonjour ${name || "Cher utilisateur"},</p>
                <p>Merci de nous avoir contactés. Nous avons bien reçu votre message :</p>
                <blockquote>${trimmedMessage}</blockquote>
                <p>Notre équipe vous répondra dans les plus brefs délais.</p>
                <p>Cordialement,</p>
                <p>L'équipe de support</p>
            `;

            // Envoyer un email à l'administrateur
            await sendNotificationEmail({
                recipientEmail: defaultSender,
                subject: adminEmailSubject,
                htmlContent: adminEmailContent,
            });

            // Envoyer un email de confirmation à l'utilisateur
            await sendNotificationEmail({
                recipientEmail: trimmedEmail,
                subject: userEmailSubject,
                htmlContent: userEmailContent,
            });

            return res.status(200).json({ message: "Message envoyé avec succès." });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message de contact:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
