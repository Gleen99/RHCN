import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetMembersPartners extends Controller {
    public method = HttpMethod.get;
    public route = "/member-partners";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { search = "" } = req.query;

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

            // Récupération de tous les membres (filtrés si nécessaire)
            const members = await db.collection("members_partners")
                .find(filter)
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json({
                success: true,
                data: members,
            });

        } catch (error) {
            console.error("❌ Erreur lors de la récupération des membres partenaires :", error);
            return res.status(500).json({
                success: false,
                message: "Erreur interne du serveur."
            });
        }
    }
}