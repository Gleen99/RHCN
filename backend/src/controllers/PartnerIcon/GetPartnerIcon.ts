import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";


export default class GetIPartnerIcon extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/partnerIcon";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const icons = await db.collection('PartnerIcon').find().toArray();
            return res.status(200).json(icons);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch Partner Icons." });
        }
    }
}
