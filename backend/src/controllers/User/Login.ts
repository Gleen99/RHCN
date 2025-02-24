import { Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../helpers/IDatabase";
import config from "config";
import { v4 as uuid } from "uuid";
import { InvitationStatus } from "../../../../shared/enums";

const authConfiguration = {
    secret: config.get<string>("server.auth.secret"),
    authExpire: 31536000, // 1 year in seconds
};

export default class Login extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/login";

    private generateTokens(userId: string, email: string, role: string): { token: string, refreshToken: string } {
        const token = jwt.sign(
            { userId, email, role },
            authConfiguration.secret,
            { expiresIn: authConfiguration.authExpire }
        );
        const refreshToken = uuid();
        return { token, refreshToken };
    }

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email et mot de passe sont requis" });
            }
            console.log(email, password)

            // Rechercher l'utilisateur par email
            const user = await db.collection('user').findOne({ email, status: { $ne: InvitationStatus.CANCELLED }});

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Comparer les mots de passe
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }

            // Générer les tokens
            const { token, refreshToken } = this.generateTokens(user._id.toString(), user.email, user.role);

            // Mettre à jour le refresh token dans la base de données
            await db.collection('user').updateOne(
                { _id: user._id },
                { $set: { refreshToken } }
            );

            return res.status(200).json({
                success: true,
                message: "Connexion réussie",
                token,
                refreshToken,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            });
        } catch (error) {
            console.error("Erreur lors de la connexion de l'utilisateur:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
