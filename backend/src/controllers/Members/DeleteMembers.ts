import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";


export default class DeleteMembers extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/member/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!id || !ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID d'member invalide." });
            }

            const memberId = new ObjectId(id);

            const member = await db.collection("member").findOne({ _id: memberId });
            if (!member) {
                return res.status(404).json({ message: "member introuvable." });
            }

            if (member) {
                await db.collection("member").deleteOne({ _id: member._id });
            }
    

            return res.status(200).json();
        } catch (error) {
            return res.status(500).json({ error: "Failed to delete member." });
        }
    }
}