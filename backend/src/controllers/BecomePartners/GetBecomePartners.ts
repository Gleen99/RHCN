import { Request, Response } from "express";
import { Controller, HttpMethod, AuthMode } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetPartners extends Controller {
    public method = HttpMethod.get;
    public route = "/partners";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { search = "" } = req.query;

            const filter: any = {};
            if (search) {
                const regex = new RegExp(search as string, "i");
                filter.$or = [
                    { name: regex },
                    { reference: regex },
                    { typeOfPartnership: regex },
                    { apport: regex },
                    { expentation: regex }
                ];
            }

            const partners = await db
                .collection("partners")
                .find(filter)
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json({ success: true, data: partners });
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des partenaires :", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}