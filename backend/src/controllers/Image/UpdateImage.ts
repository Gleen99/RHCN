import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class UpdateImage extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/image/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const {
                fr,
                en,
                date,
                mainPicture,
                published
            } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "ID invalide." });
            }

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
            const ListImageId = new ObjectId(id);
            const updateData = {
                fr,
                en,
                mainPicture,
                published,
                updatedAt: new Date(),
            };

            const updatedIcon = await db.collection('images').findOneAndUpdate(
                { _id: ListImageId },
                { $set: updateData },
                { returnDocument: "after" }
            );

            if (!updatedIcon?.value) {
                return res.status(404).json({ error: "Image not found." });
            }

            return res.status(200).json(updatedIcon.value);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'image :", error);
            return res.status(500).json({ error: "Échec de la mise à jour de l'image." });
        }
    }
}