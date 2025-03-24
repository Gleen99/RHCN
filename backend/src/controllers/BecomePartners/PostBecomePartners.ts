import { Request, Response } from "express";
import { defaultSender, sendNotificationEmail } from "../../services/mailjet";
import {AuthMode, Controller, HttpMethod} from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";


export default class PostBecomePartners extends Controller {
    public method = HttpMethod.post;
    public route = "/partners";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {
                name,
                reference,
                typeOfPartnership,
                apport,
                expentation,
                documentUploader
            } = req.body;

            // Vérification des champs obligatoires
            if (!name || !reference || !typeOfPartnership || !apport || !expentation) {
                return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis." });
            }

            // Vérification si le partenaire existe déjà
            const existingPartner = await db.collection("partners").findOne({ name: name.trim() });
            if (existingPartner) {
                return res.status(400).json({ success: false, message: "Ce partenaire existe déjà." });
            }

            // Création de l'objet partenaire
            const newPartner = {
                name,
                reference,
                typeOfPartnership,
                apport,
                expentation,
                documentUploader,
            };

            // Enregistrement dans la base de données
            const result = await db.collection("partners").insertOne(newPartner);

            if (!result.acknowledged) {
                return res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement du partenaire." });
            }

            // Contenu de l'email de notification
            const adminEmailSubject = "Nouvelle demande de partenariat";
            const adminEmailContent = `
                Bonjour,<br><br>
                Une nouvelle demande de partenariat a été soumise :<br>
                <strong>Nom :</strong> ${name}<br>
                <strong>Type :</strong> ${typeOfPartnership}<br>
                <strong>Apport :</strong> ${apport}<br>
                <strong>Expentation :</strong> ${expentation}<br><br>
                Cordialement,<br>
            `;

            // Envoi de l'email de notification à l'administrateur
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

            // Réponse au client
            return res.status(201).json({
                success: true,
                message: "Demande de partenariat soumise avec succès.",
                data: newPartner
            });
        } catch (error) {
            console.error("❌ Erreur lors de l'enregistrement d'un partenaire :", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}
