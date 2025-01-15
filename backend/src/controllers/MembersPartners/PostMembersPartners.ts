import { Request, Response } from "express";
import { defaultSender, sendNotificationEmail } from "../../services/mailjet";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class PostMembersPartners extends Controller {
    public method = HttpMethod.post;
    public route = "/member-partners";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {
                firstName,
                lastName,
                address,
                email,
                phone,
                birthday,
                age,
                message,
                confirmationPaiements
            } = req.body;

            // Vérification des champs obligatoires
            if (!firstName || !lastName || !email || !phone || !birthday || !age) {
                return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis." });
            }

            // Vérification si l'email existe déjà
            const existingMember = await db.collection("members_partners").findOne({ email: email.trim() });
            if (existingMember) {
                return res.status(400).json({ success: false, message: "Cet email est déjà enregistré." });
            }

            // Création de l'objet membre
            const newMember = {
                _id: new ObjectId(),
                firstName,
                lastName,
                address,
                email: email.trim(),
                phone,
                birthday,
                age,
                message,
                confirmationPaiements,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Enregistrement dans la base de données
            const result = await db.collection("members_partners").insertOne(newMember);

            if (!result.acknowledged) {
                return res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement du membre." });
            }

            // Contenu de l'email pour l'utilisateur
            const userEmailSubject = "Inscription réussie !";
            const userEmailContent = `
                Bonjour ${firstName},<br><br>
                Merci pour votre inscription en tant que partenaire membre. Nous sommes ravis de vous accueillir !<br><br>
                Cordialement,<br>
                L'équipe
            `;

            // Contenu de l'email pour l'administrateur
            const adminEmailSubject = "Nouvelle inscription de membre partenaire";
            const adminEmailContent = `
                Bonjour,<br><br>
                Un nouveau membre partenaire s'est inscrit :<br>
                <strong>Nom :</strong> ${firstName} ${lastName}<br>
                <strong>Email :</strong> ${email}<br>
                <strong>Téléphone :</strong> ${phone}<br>
                <strong>Message :</strong> ${message || "Aucun"}<br><br>
                Cordialement,<br>
            `;

            // Envoi de l'email à l'administrateur
            try {
                await sendNotificationEmail({
                    recipientEmail: defaultSender, // Email de l'admin
                    subject: adminEmailSubject,
                    htmlContent: adminEmailContent
                });

                console.log(`📩 Email de notification envoyé à l'administrateur : ${defaultSender}`);
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email à l'administrateur :", error);
            }

            // Envoi de l'email de confirmation à l'utilisateur
            try {
                await sendNotificationEmail({
                    recipientEmail: email.trim(),
                    subject: userEmailSubject,
                    htmlContent: userEmailContent
                });

                console.log(`📩 Email de confirmation envoyé à l'utilisateur : ${email}`);
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email à l'utilisateur :", error);
            }

            // Réponse au client
            return res.status(201).json({
                success: true,
                message: "Membre enregistré avec succès.",
                data: newMember
            });

        } catch (error) {
            console.error("❌ Erreur lors de l'inscription d'un membre partenaire :", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}