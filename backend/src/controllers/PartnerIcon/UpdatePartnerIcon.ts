import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class UpdatePartnerIcon extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/partnerIcon/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { mainPicture } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid ID format." });
            }

            if (!mainPicture) {
                return res.status(400).json({ error: "All content are required." });
            }

            const updatedIcon = await db.collection('PartnerIcon').findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { mainPicture, updatedAt: new Date() } },
                { returnDocument: "after" }
            );
            return res.status(200).json(updatedIcon?.value);
        } catch (error) {
            return res.status(500).json({ error: "Failed to update Partner Icon." });
        }
    }
}
