import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreatePartnerIcon extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/partnerIcon";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { mainPicture } = req.body;

            if ( !mainPicture) {
                return res.status(400).json({ error: "All content are required." });
            }

            const newIcon = await db.collection('PartnerIcon').insertOne({ mainPicture });
            return res.status(201).json(newIcon);
        } catch (error) {
            return res.status(500).json({ error: "Failed to create Partner Icon." });
        }
    }
}
