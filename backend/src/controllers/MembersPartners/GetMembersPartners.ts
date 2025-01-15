import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetMembersPartners extends Controller {
    public method = HttpMethod.get;
    public route = "/member-partners";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            // Récupération des paramètres de requête
            const { page = "1", limit = "10", search = "" } = req.query;

            // Conversion en valeurs numériques
            const pageNumber = parseInt(page as string, 10) || 1;
            const limitNumber = parseInt(limit as string, 10) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            // Construction du filtre de recherche
            const filter: any = {};
            if (search) {
                const searchRegex = new RegExp(search as string, "i"); // Recherche insensible à la casse
                filter.$or = [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex }
                ];
            }

            // Récupération des membres avec pagination et tri
            const members = await db.collection("members_partners")
                .find(filter)
                .sort({ createdAt: -1 }) // Trier du plus récent au plus ancien
                .skip(skip)
                .limit(limitNumber)
                .toArray();

            // Compte total des membres (pour la pagination)
            const totalMembers = await db.collection("members_partners").countDocuments(filter);

            // Réponse avec les résultats et les infos de pagination
            return res.status(200).json({
                success: true,
                data: members,
                pagination: {
                    total: totalMembers,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(totalMembers / limitNumber),
                },
            });

        } catch (error) {
            console.error("❌ Erreur lors de la récupération des membres partenaires :", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}