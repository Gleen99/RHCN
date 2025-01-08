import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../../src/helpers/IDatabase";

export default class UpdateArticle extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/article/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const {
                title,
                slug,
                date,
                mainPicture,
                author,
                categories,
                published,
                content,
            } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid article ID." });
            }

            const articleId = new ObjectId(id);

            // Validation des données nécessaires
            if (!title || !slug || !categories || !Array.isArray(content)) {
                return res.status(400).json({
                    error: "Title, slug, categories, and content are required.",
                });
            }

            const updateData = {
                title,
                slug,
                date: new Date(date),
                mainPicture,
                author,
                categories,
                published: !!published,
                content,
            };

            const updatedArticle = await db.collection("articles").findOneAndUpdate(
                { _id: articleId },
                { $set: updateData },
                { returnDocument: "after" }
            );

            if (!updatedArticle?.value) {
                return res.status(404).json({ error: "Article not found." });
            }

            return res.status(200).json(updatedArticle.value);
        } catch (error) {
            console.error("Error updating article:", error);
            return res.status(500).json({ error: "Failed to update article." });
        }
    }
}
