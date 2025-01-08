import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../../src/helpers/IDatabase";

export default class UpdateFaq extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/faq/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { en, fr } = req.body;

            // Validate ID format
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid FAQ ID." });
            }

            // Validate request body
            if (!en || !fr) {
                return res.status(400).json({ message: "Both English and French content are required." });
            }

            const faqId = new ObjectId(id);

            // Check if FAQ exists
            const existingFaq = await db.collection("faq").findOne({ _id: faqId });
            if (!existingFaq) {
                return res.status(404).json({ message: "FAQ not found." });
            }

            // Update FAQ
            const updateData = { en, fr };
            const updatedFaq = await db.collection("faq").findOneAndUpdate(
                { _id: faqId },
                { $set: updateData },
                { returnDocument: "after" } // Return the updated document
            );

            // Return updated FAQ
            return res.status(200).json(updatedFaq?.value);
        } catch (error) {
            console.error("Error updating FAQ:", error);
            return res.status(500).json({ error: "Failed to update FAQ." });
        }
    }
}
