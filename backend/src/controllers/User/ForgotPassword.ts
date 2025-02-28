import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";
import { generateEmailTemplate, sendNotificationEmail } from "../../services/mailjet";
import crypto from "crypto";
import config from "config";

export default class ForgotPassword extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/forgotPassword";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "L'adresse e-mail est requise." });
            }

            const user = await db.collection('user').findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé." });
            }

            // Génération du token sécurisé
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000); // Expiration 1 heure

            await db.collection('user').updateOne(
                { email },
                { $set: { resetToken, resetTokenExpire } }
            );

            const url = config.get("services.front");
            const resetLink = `${url}/app/resetPassword?token=${resetToken}`;

            const subject = "🔒 Réinitialisation de votre mot de passe";

            // Génération du template d'email avec header/footer stylés
            const message = generateEmailTemplate(
                user.firstname,
                `
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
                <a href="${resetLink}" target="_blank">Réinitialiser mon mot de passe</a>
                <p>Ce lien expirera dans une heure.</p>
            `);

            await sendNotificationEmail({
                recipientEmail: email,
                subject,
                htmlContent: message,
            });

            return res.status(200).json({ message: "✅ E-mail de réinitialisation envoyé avec succès." });
        } catch (error) {
            console.error("❌ Erreur lors de la demande de réinitialisation du mot de passe:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}