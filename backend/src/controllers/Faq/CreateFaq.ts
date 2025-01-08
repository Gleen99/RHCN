import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";



export default class CreateFaq extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/faq";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { en, fr } = req.body;

            if (!en || !fr) {
                return res.status(400).json({ error: "Both English and French content are required." });
            }
            const newFaq = await db.collection('faq').insertOne({
                en,
                fr,
            });


            return res.status(201).json(newFaq);
        } catch (error) {
            return res.status(500).json({ error: "Failed to create FAQ." });
        }
    }
}
