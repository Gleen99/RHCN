import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateArticle extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/article";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {
                title,
                slug,
                date,
                mainPicture,
                author,
                categories,
                published,
                content
            } = req.body;

            // Validation des données requises
            if (!title || !slug || !date || !categories ) {
                return res.status(400).json({
                    error: "Title, slug, date, and categories are required fields.",
                });
            }

            if (!content || !Array.isArray(content)) {
                return res.status(400).json({
                    error: "Content must be an array of ArticleContent objects.",
                });
            }

            const newArticle = {
                title,
                slug,
                date: new Date(date), // Conversion en objet Date
                mainPicture,
                author,
                categories,
                published: !!published, // Conversion en boolean
                content,
            };

            // Insertion dans la base de données
            const createdArticle = await db.collection("articles").insertOne(newArticle);

            // Retourne l'article créé
            return res.status(201).json(createdArticle);
        } catch (error) {
            console.error("Error creating article:", error);
            return res.status(500).json({ error: "Failed to create article." });
        }
    }
}
