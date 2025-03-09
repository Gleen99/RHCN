import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetArticle extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/article/:slug";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            await super.handler(req, res);

            const { slug } = req.params;

            if (!slug) {
                return res.status(400).json({ error: "Slug is required." });
            }

            const article = await db.collection("articles").findOne({ slug });

            if (!article) {
                return res.status(404).json({ error: "Article not found." });
            }

            return res.status(200).json(article);
        } catch (error) {
            console.error("Error fetching article:", error);
            return res.status(500).json({ error: "Failed to retrieve article." });
        }
    }
}