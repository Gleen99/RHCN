import { Request, Response } from "express";
import { defaultSender, sendNotificationEmail, generateEmailTemplate } from "../../services/mailjet";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class sendContactMessage extends Controller {
    public method = HttpMethod.post;
    public route = "/contact";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { type, email, message, number, firstname, lastname, lang } = req.body;

            if (!email || !message) {
                return res.status(400).json({ success: false, message: "Email et message sont requis." });
            }

            const trimmedEmail = email.trim().toLowerCase();
            const trimmedMessage = message.trim();
            const trimmedNumber = number ? number.trim() : null;
            const trimmedFirstname = firstname ? firstname.trim() : "";
            const trimmedLastname = lastname ? lastname.trim() : "";

            const name = `${trimmedFirstname} ${trimmedLastname}`.trim();
            const selectedLang = ['fr', 'en'].includes(lang) ? lang : 'fr';

            const translations = {
                fr: {
                    subject: "E-mail de confirmation de contact",
                    content: `
                        <p>Merci de nous avoir contactés.</p>
                        <p>Nous ferons un suivi avec vous dans les prochaines 48 à 72 heures.</p>
                        <p>Cordialement,</p>
                        <p><strong>Le Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong></p>
                    `
                },
                en: {
                    subject: "Contact confirmation email",
                    content: `
                        <p>Thank you for contacting us.</p>
                        <p>We will follow up with you within the next 48 to 72 hours.</p>
                        <p>Sincerely,</p>
                        <p><strong>Le Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong></p>
                    `
                }
            };

            // Enregistrement en base de données
            const insertResult = await db.collection("contact").insertOne({
                type,
                email: trimmedEmail,
                number: trimmedNumber,
                message: trimmedMessage,
                firstname: trimmedFirstname,
                lastname: trimmedLastname,
                name,
                createdAt: new Date(),
            });

            if (!insertResult.acknowledged) {
                return res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement du message." });
            }

            const contactId = insertResult.insertedId;
            const contact = await db.collection("contact").findOne({ _id: new ObjectId(contactId) });

            // Email de confirmation à l'utilisateur
            const userEmailSubject = translations[selectedLang].subject;
            const userEmailContent = generateEmailTemplate(
                name || (selectedLang === "fr" ? "Cher utilisateur" : "Dear user"),
                translations[selectedLang].content
            );

            // Email de notification à l’administrateur
            const adminEmailSubject = `Nouveau message de contact de ${name || trimmedEmail}`;
            const adminEmailContent = `
                <p><strong>Nom :</strong> ${name || "Non fourni"}</p>
                <p><strong>Email :</strong> ${trimmedEmail}</p>
                ${trimmedNumber ? `<p><strong>Téléphone :</strong> ${trimmedNumber}</p>` : ""}
                <p><strong>Message :</strong></p>
                <p>${trimmedMessage}</p>
            `;

            // Envoi des emails
            try {
                await sendNotificationEmail({
                    recipientEmail: defaultSender,
                    subject: adminEmailSubject,
                    htmlContent: adminEmailContent
                });
                console.log(`📩 Email de notification envoyé à l'administrateur : ${defaultSender}`);
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email à l'administrateur :", error);
            }

            try {
                await sendNotificationEmail({
                    recipientEmail: trimmedEmail,
                    subject: userEmailSubject,
                    htmlContent: userEmailContent
                });
                console.log(`📩 Email de confirmation envoyé à l'utilisateur : ${trimmedEmail}`);
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email à l'utilisateur :", error);
            }

            return res.status(200).json({
                success: true,
                message: "Message envoyé avec succès.",
                data: contact
            });

        } catch (error) {
            console.error("❌ Erreur lors de l'envoi du message de contact:", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}