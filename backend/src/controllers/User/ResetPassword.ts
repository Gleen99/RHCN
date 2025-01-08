import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../helpers/IDatabase";

export default class ResetPassword extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/resetPassword";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ message: "Token et nouveau mot de passe requis." });
            }

            // Vérifier le token
            const user = await db.collection('user').findOne({ resetToken: token });

            if (!user) {
                return res.status(400).json({ message: "Token invalide ou expiré." });
            }

            if (user.resetTokenExpire < new Date()) {
                return res.status(400).json({ message: "Token expiré." });
            }

            // Hacher le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Mettre à jour le mot de passe et réinitialiser les champs token
            await db.collection('user').updateOne(
                { _id: user._id },
                { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpire: "" } }
            );

            return res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
        } catch (error) {
            console.error("Erreur lors de la réinitialisation du mot de passe:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
