import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetArticleCategories extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/categories";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            // Fetch all articles
            const categories = await db.collection("categories").find().toArray();

            if (!categories || categories.length === 0) {
                return res.status(400).json({ error: "No categories found." });
            }
            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching article categories:", error);
            return res.status(500).json({ error: "Failed to retrieve article categories." });
        }
    }
}
