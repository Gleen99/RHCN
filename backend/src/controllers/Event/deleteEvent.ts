import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";
import {ObjectId} from "mongodb";

export default class DeleteEvent extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/event/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid events ID." });
            }
            const eventId = new ObjectId(id);
            const deletedEvent = await db.collection("events").deleteOne({ _id: eventId });
         console.log(deletedEvent)
            if (deletedEvent.deletedCount === 0) {
                return res.status(404).json({ error: "Event not found in any Event." });
            }
            return res.status(200).json({ message: "Event deleted successfully." });
        } catch (error) {
            console.error("Error deleting event:", error);
            return res.status(500).json({ error: "Failed to delete event." });
        }
    }
}
