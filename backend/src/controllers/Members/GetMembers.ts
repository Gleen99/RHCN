import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class GetMember extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/members";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            // Fetch members from the database
            const members = await db.collection("member").find().toArray();

            // Check if the member collection is empty
            if (!members || members.length === 0) {
                return res.status(404).json({ error: "No members found." });
            }

            // Return the list of members
            return res.status(200).json(members);
        } catch (error) {
            console.error("Error fetching members:", error);
            return res.status(500).json({ error: "Failed to retrieve members." });
        }
    }
}
