import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetAllArticles extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/articles";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const articles = await db.collection("articles").find().toArray();

            if (!articles || articles.length === 0) {
                return res.status(404).json({ error: "No articles found." });
            }

            return res.status(200).json(articles);
        } catch (error) {
            console.error("Error fetching articles:", error);
            return res.status(500).json({ error: "Failed to retrieve articles." });
        }
    }
}
