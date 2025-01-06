import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateEvent extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/event";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { title, date, time, address, description, price, categories, mainPicture } = req.body;

            if (!title || !date || !time || !categories) {
                return res.status(400).json({
                    error: "Title, date, time, and categories are required fields.",
                });
            }

            const newEvent = {
                title,
                date: new Date(date),
                time,
                address,
                description,
                price,
                categories,
                mainPicture,
            };

            const createdEvent = await db.collection("events").insertOne(newEvent);
            return res.status(201).json(createdEvent);
        } catch (error) {
            console.error("Error creating event:", error);
            return res.status(500).json({ error: "Failed to create event." });
        }
    }
}