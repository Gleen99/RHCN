import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetAllEvents extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/events";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const events = await db.collection("events").find().toArray();
            return res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching events:", error);
            return res.status(500).json({ error: "Failed to fetch events." });
        }
    }
}