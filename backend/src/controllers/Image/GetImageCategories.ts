import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetImageCategories extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/images/categories";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            // Fetch all images
            const images = await db.collection("images").find().toArray();

            if (!images || images.length === 0) {
                return res.status(404).json({ error: "No images found." });
            }

            // Extract and deduplicate categories
            const categories = [
                ...new Set(images.flatMap((image) => image.categories)),
            ];

            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching image categories:", error);
            return res.status(500).json({ error: "Failed to retrieve image categories." });
        }
    }
}
