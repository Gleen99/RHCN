import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetEventsByDate extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/event/date/:date";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { date } = req.params;
            const parsedDate = new Date(date);
            const events = await db.collection("events").find({ date: parsedDate }).toArray();
            return res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching events by date:", error);
            return res.status(500).json({ error: "Failed to fetch events by date." });
        }
    }
}