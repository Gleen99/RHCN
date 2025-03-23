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
            const eventId = new ObjectId(id);
            const { fr, en, date, time, address, price, mainPicture } = req.body;

            if (
                !fr?.title || !en?.title ||
                !fr?.categories || !en?.categories ||
                !date || !time
            ) {
                return res.status(400).json({
                    error: "Missing required fields: fr.title, en.title, categories, date or time.",
                });
            }

            const updatedEvent = {
                fr: {
                    title: fr.title,
                    description: fr.description || "",
                    categories: Array.isArray(fr.categories) ? fr.categories : [],
                },
                en: {
                    title: en.title,
                    description: en.description || "",
                    categories: Array.isArray(en.categories) ? en.categories : [],
                },
                date: new Date(date).getTime(),
                time: new Date(time).getTime(),
                address: address || "",
                price: price || "",
                mainPicture: mainPicture || { path: "" },
            };

            const result = await db.collection("events").findOneAndUpdate(
                { _id: eventId },
                { $set: updatedEvent },
                { returnDocument: "after" }
            );


            return res.status(200).json(result?.value);
        } catch (error) {
            console.error("Error updating event:", error);
            return res.status(500).json({ error: "Failed to update event." });
        }
    }
}