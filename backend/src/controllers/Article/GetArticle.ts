import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../../src/helpers/IDatabase";

export default class GetArticle extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/article/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid article ID." });
            }

            const articleId = new ObjectId(id);

            const article = await db.collection("articles").findOne({ _id: articleId });

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
