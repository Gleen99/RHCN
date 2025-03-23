import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class GetAllUsers extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/users";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const users = await db.collection("user")
                .find(
                    { status: "accepted" },
                    { projection: { password: 0, refreshToken: 0 } }
                )
                .toArray();

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Aucun utilisateur accepté trouvé",
                });
            }

            return res.status(200).json(users);

        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}