import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateImage extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/image";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {
                fr,
                en,
                date,
                mainPicture,
                published
            } = req.body;

            // Vérification des champs requis
            if (
                !fr?.categories ||
                !en?.categories ||
                !date ||
                !mainPicture?.path ||
                typeof published !== "boolean"
            ) {
                return res.status(400).json({
                    error: "Champs requis manquants : fr.categories, en.categories, date, image, published"
                });
            }

            const imageData = {
                fr,
                en,
                date: new Date(date),
                mainPicture,
                published,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const created = await db.collection("images").insertOne(imageData);

            return res.status(201).json({ _id: created.insertedId, ...imageData });
        } catch (error) {
            console.error("Erreur lors de la création d'une image :", error);
            return res.status(500).json({ error: "Échec de la création de l'image." });
        }
    }
}