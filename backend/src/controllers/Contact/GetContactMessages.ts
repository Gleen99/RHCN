import { Request, Response } from "express";
import { Controller, HttpMethod, AuthMode } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetContactMessages extends Controller {
    public method = HttpMethod.get;
    public route = "/contact";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { search = "" } = req.query;
            // Construction du filtre de recherche
            const filter: any = {};
            if (search) {
                const searchRegex = new RegExp(search as string, "i")
                filter.$or = [
                    { email: searchRegex },
                    { name: searchRegex },
                    { message: searchRegex },
                    { number: searchRegex }
                ]
            }
            const contacts = await db
                .collection("contact")
                .find(filter)
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json({ success: true, data: contacts });
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des messages de contact :", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}
