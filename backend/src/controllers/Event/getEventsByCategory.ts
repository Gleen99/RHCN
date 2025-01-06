import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetEventsByCategory extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/event/category/:category";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { category } = req.params;
            const events = await db.collection("events").find({ categories: category }).toArray();
            return res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching events by category:", error);
            return res.status(500).json({ error: "Failed to fetch events by category." });
        }
    }
}
