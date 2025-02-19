import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class DeletePartnerIcon extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/partnerIcon/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!id || !ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID d'partner Icons invalide." });
            }

            const deletedIcon = await db.collection('PartnerIcon').deleteOne({ _id: new ObjectId(id) });

            if (deletedIcon.deletedCount === 0) {
                return res.status(404).json({ error: "Partner Icon not found." });
            }

            return res.status(200).json(deletedIcon);
        } catch (error) {
            return res.status(500).json({ error: "Failed to delete Partner Icon." });
        }
    }
}
