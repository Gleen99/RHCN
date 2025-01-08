import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class UpdateMember extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/member/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { firstname,
                lastname,
                titre,
                picture } = req.body;
    
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID member invalide" });
            }
            if (!firstname ||
                !lastname ||
                !titre ||
                !picture) {
                return res.status(400).json({ error: "All content are required." });
            }
            
            const memberId = new ObjectId(id);
        

            const existingmember = await db.collection('member').findOne({ _id: memberId });
            if (!existingmember) {
                return res.status(404).json({ message: "member non trouvé" });
            }

          

            const updateData: Record<string, any> = {
                firstname,
                lastname,
                titre,
                picture
            };
            const updateMember = await db.collection('member').findOneAndUpdate(
                { _id: memberId },
                { $set: updateData },
                { returnDocument: 'after' } 
            );
            return res.status(200).json(updateMember?.value);
        } catch (error) {
            return res.status(500).json({ error: "Failed to update member." });
        }
    }
}