import { Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../helpers/IDatabase";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import config from "config";

const authConfiguration = {
    register: true,
    secret: config.get<string>("server.auth.secret"),
    fillUserMiddleware: true,
    authExpire: 31536000,
    usernameField: "email",
    loginAfterRegister: true,
    saltRounds: 10,
    logAsToken: config.get<string>("server.auth.logAsToken"),
};

export default class CreateUser extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/register";

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
            const { firstname, lastname, email, password, role } = req.body;

            if (!firstname || !lastname || !email || !password || !role) {
                return res.status(400).json({ message: "Tous les champs sont requis" });
            }

            // Vérification si l'email existe déjà
            const existingUser = await db.collection('user').findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, authConfiguration.saltRounds);

            // Créer un utilisateur
            const user = {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role,
            };

            const result = await db.collection('user').insertOne(user);

            // Générer les tokens
            const { token, refreshToken } = this.generateTokens(result.insertedId.toString(), user.email, user.role);

            // Stocker le refresh token dans la base de données
            await db.collection('user').updateOne(
                { _id: result.insertedId },
                { $set: { refreshToken } }
            );

            if (authConfiguration.loginAfterRegister) {
                return res.status(200).json({
                    success: true,
                    message: "Utilisateur créé et connecté avec succès",
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        role: user.role,
                    
                    token,
                    refreshToken
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Utilisateur créé avec succès",
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,

                });
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}