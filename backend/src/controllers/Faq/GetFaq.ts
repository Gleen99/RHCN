import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetFaq extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/faqs";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            // Fetch FAQs from the database
            const faqs = await db.collection("faq").find().toArray();

            // Check if the FAQ collection is empty
            if (!faqs || faqs.length === 0) {
                return res.status(404).json({ error: "No FAQs found." });
            }

            // Return the list of FAQs
            return res.status(200).json(faqs);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            return res.status(500).json({ error: "Failed to retrieve FAQs." });
        }
    }
}
