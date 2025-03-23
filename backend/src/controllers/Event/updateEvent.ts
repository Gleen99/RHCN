import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class UpdateEvent extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/event/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid event ID." });
            }

            const updates = req.body;
            const eventId = new ObjectId(id);

            const result = await db.collection("events").findOneAndUpdate(
                { _id: eventId },
                { $set: updates },
                { returnDocument: "after" }
            );

            if (!result?.value) {
                return res.status(404).json({ error: "Event not found." });
            }

            return res.status(200).json(result.value);
        } catch (error) {
            console.error("Error updating event:", error);
            return res.status(500).json({ error: "Failed to update event." });
        }
    }
}