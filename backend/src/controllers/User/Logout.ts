import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class Logout extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/logout";
    private auth = AuthMode.authenticated;
    
    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email est requis" });
            }

            // Supprimer le refresh token de l'utilisateur
            const result = await db.collection('user').updateOne(
                { email },
                { $unset: { refreshToken: "" } } // Supprime le champ `refreshToken`
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            return res.status(200).json({
                success: true,
                message: "Déconnexion réussie",
            });
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
