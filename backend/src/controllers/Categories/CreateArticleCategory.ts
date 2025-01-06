import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class CreateArticleCategory extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/categories";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            console.log(req.body)
            const { en, fr, type } = req.body;

            if (!en || !fr || !type)  {
                return res.status(400).json({ error: "Both English and French content are required." });
            }
            // Insert the new category into articles (in a placeholder article for reference)
            await db.collection("categories").insertOne({
                en,
                fr,
                type
            });

            return res.status(201).json({ message: "Category created successfully." });
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({ error: "Failed to create category." });
        }
    }
}
