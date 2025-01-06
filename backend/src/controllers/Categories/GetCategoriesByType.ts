import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetCategoriesByType extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/categories/:type";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { type } = req.params;

            // Fetch categories by type
            const categories = await db.collection("categories").find({ type }).toArray();

            if (!categories || categories.length === 0) {
                return res.status(404).json({ error: `No categories found for type: ${type}` });
            }

            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories by type:", error);
            return res.status(500).json({ error: "Failed to retrieve categories by type." });
        }
    }
}
