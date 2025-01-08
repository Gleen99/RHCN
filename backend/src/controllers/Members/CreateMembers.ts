import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateMembers extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/member";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { firstname,
                lastname,
                titre,
                picture } = req.body;

            if (!firstname ||
                !lastname ||
                !titre ||
                !picture) {
                return res.status(400).json({ error: "All content are required." });
            }
            const newFaq = await db.collection('member').insertOne({
                firstname,
                lastname,
                titre,
                picture
            });


            return res.status(201).json(newFaq);
        } catch (error) {
            return res.status(500).json({ error: "Failed to create FAQ." });
        }
    }
}
