import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class CreateImage extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/image";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { title, date, mainPicture, author, categories, published } = req.body;

            if (!title || !date || !categories || typeof published !== "boolean") {
                return res.status(400).json({ error: "Title, date, categories, and published status are required." });
            }

            const newImage = await db.collection("images").insertOne({
                title,
                date: new Date(date),
                mainPicture,
                author,
                categories,
                published,
            });

            return res.status(201).json(newImage);
        } catch (error) {
            console.error("Error creating image:", error);
            return res.status(500).json({ error: "Failed to create image." });
        }
    }
}
