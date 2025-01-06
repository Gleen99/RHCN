import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class GetEventById extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/event/:id";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const eventId = new ObjectId(id);
            const event = await db.collection("events").findOne({ eventId: id });

            if (!event) {
                return res.status(404).json({ error: "Event not found." });
            }

            return res.status(200).json(event);
        } catch (error) {
            console.error("Error fetching event by ID:", error);
            return res.status(500).json({ error: "Failed to fetch event by ID." });
        }
    }
}