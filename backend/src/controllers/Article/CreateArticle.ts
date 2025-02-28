import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateArticle extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/article";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { title, slug, mainPicture, author, categories, published, content } = req.body;

            if (!title || !slug || !categories) {
                return res.status(400).json({
                    error: "Title, slug, and at least one category are required fields.",
                });
            }

            // if (!content || !Array.isArray(content) || content.length === 0 || !content.every(block => block.blockName && block.text)) {
            //     return res.status(400).json({
            //         error: "Content must be a non-empty array of ArticleContent objects with blockName and text.",
            //     });
            // }

            // Vérifier si un article avec le même slug existe déjà
            const existingArticle = await db.collection("articles").findOne({ slug });
            if (existingArticle) {
                return res.status(409).json({ error: "An article with this slug already exists." });
            }

            // Création de l'objet article
            const newArticle = {
                title,
                slug,
                mainPicture,
                author: author || "Unknown", // Valeur par défaut
                categories,
                published: !!published, // Conversion en boolean
                content,
            };

            // Insertion dans la base de données
            const result = await db.collection("articles").insertOne(newArticle);

            if (!result.acknowledged) {
                throw new Error("Database insertion failed");
            }

            // Récupérer l'article inséré pour renvoyer une réponse complète
            const createdArticle = await db.collection("articles").findOne({ _id: result.insertedId });

            // Retourner l'article créé
            return res.status(201).json(createdArticle);
        } catch (error) {
            console.error("Error creating article:", error);
            return res.status(500).json({ error: "Failed to create article." });
        }
    }
}