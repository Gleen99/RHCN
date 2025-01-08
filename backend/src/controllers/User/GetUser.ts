import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class GetUser extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/user/:email";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.params;

            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                return res.status(400).json({ message: "Email utilisateur invalide" });
            }

            console.log(`Recherche utilisateur pour l'email: ${email}`);
            const user = await db.collection('user').findOne(
                { email: email },
                { projection: { password: 0, refreshToken: 0 } }
            );

            console.log("find user:", user)
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            return res.status(200).json(user);

        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
