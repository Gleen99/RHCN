import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateMembers extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/member";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { firstname, lastname, fr, en, picture } = req.body;

            if (!firstname ||
                !lastname ||
                !fr?.titre ||
                !en?.titre ||
                !picture) {
                return res.status(400).json({ error: "All content are required." });
            }
            const newMember = await db.collection('member').insertOne({
                firstname,
                lastname,
                fr,
                en,
                picture,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            return res.status(201).json(newMember);
        } catch (error) {
            return res.status(500).json({ error: "Failed to create member." });
        }
    }
}
