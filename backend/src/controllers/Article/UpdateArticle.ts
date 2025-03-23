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
            const { fr, en, author, mainPicture } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID d'article invalide." });
            }

            if (
                !fr?.title || !en?.title ||
                !Array.isArray(fr.categories) || fr.categories.length === 0 ||
                !Array.isArray(en.categories) || en.categories.length === 0
            ) {
                return res.status(400).json({
                    error: "Les champs 'title' et 'categories' sont requis pour FR et EN.",
                });
            }

            const articleId = new ObjectId(id);

            const slug = fr.slug || en.slug || fr.title.trim().toLowerCase().replace(/\s+/g, "-");

            const updateData = {
                fr: {
                    title: fr.title,
                    categories: fr.categories,
                    content: Array.isArray(fr.content) ? fr.content : [],
                    slug,
                },
                en: {
                    title: en.title,
                    categories: en.categories,
                    content: Array.isArray(en.content) ? en.content : [],
                    slug,
                },
                author: author || "RHCN",
                mainPicture: mainPicture || null,
                updatedAt: new Date(), // champ de mise à jour optionnel
            };

            const result = await db.collection("articles").findOneAndUpdate(
                { _id: articleId },
                { $set: updateData },
                { returnDocument: "after" }
            );

            return res.status(200).json(result?.value);

        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'article :", error);
            return res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'article." });
        }
    }
}