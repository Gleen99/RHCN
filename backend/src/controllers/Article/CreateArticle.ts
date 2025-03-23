import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateArticle extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/article";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { fr, en, author, mainPicture } = req.body;

            if (!fr?.title || !en?.title || !fr?.categories?.length || !en?.categories?.length) {
                return res.status(400).json({
                    error: "Les champs 'title' et 'categories' doivent être renseignés en FR et EN.",
                });
            }

            const slug = fr.slug || en.slug || fr.title.trim().toLowerCase().replace(/\s+/g, "-");

            const existingArticle = await db.collection("articles").findOne({ "fr.slug": slug });
            if (existingArticle) {
                return res.status(409).json({ error: "Un article avec ce slug existe déjà." });
            }

            const newArticle = {
                fr: {
                    title: fr.title,
                    categories: Array.isArray(fr.categories) ? fr.categories : [],
                    content: Array.isArray(fr.content) ? fr.content : [],
                    slug,
                },
                en: {
                    title: en.title,
                    categories: Array.isArray(en.categories) ? en.categories : [],
                    content: Array.isArray(en.content) ? en.content : [],
                    slug,
                },
                author: author || "RHCN",
                mainPicture: mainPicture || null,
                date: new Date(),
            };

            const result = await db.collection("articles").insertOne(newArticle);

            if (!result.acknowledged) {
                throw new Error("Échec de l'insertion en base de données");
            }

            const createdArticle = await db.collection("articles").findOne({ _id: result.insertedId });
            return res.status(201).json(createdArticle);

        } catch (error) {
            console.error("Erreur lors de la création de l'article :", error);
            return res.status(500).json({ error: "Erreur serveur lors de la création de l'article." });
        }
    }
}