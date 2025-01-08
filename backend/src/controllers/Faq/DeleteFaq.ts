import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../../src/helpers/IDatabase";

export default class DeleteFaq extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/faq/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { en, fr } = req.body;

            if (!id || !ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID d'faq invalide." });
            }

            const faqId = new ObjectId(id);

            const faq = await db.collection("faq").findOne({ _id: faqId });
            if (!faq) {
                return res.status(404).json({ message: "faq introuvable." });
            }



            if (faq) {
                await db.collection("faq").deleteOne({ _id: faq._id });
            }
    

            return res.status(200).json();
        } catch (error) {
            return res.status(500).json({ error: "Failed to delete FAQ." });
        }
    }
}