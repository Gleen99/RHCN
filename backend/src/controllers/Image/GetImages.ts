import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetImages extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/images";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const images = await db.collection("images").find().toArray();

            if (!images || images.length === 0) {
                return res.status(404).json({ error: "No images found." });
            }

            return res.status(200).json(images);
        } catch (error) {
            console.error("Error fetching images:", error);
            return res.status(500).json({ error: "Failed to retrieve images." });
        }
    }
}
