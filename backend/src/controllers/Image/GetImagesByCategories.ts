import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetImagesByCategories extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/images/categories";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { categories } = req.query;

            if (!categories || !Array.isArray(categories)) {
                return res.status(400).json({ error: "Categories query parameter is required and must be an array." });
            }

            const images = await db
                .collection("images")
                .find({ categories: { $in: categories } })
                .toArray();

            if (!images || images.length === 0) {
                return res.status(404).json({ error: "No images found for the specified categories." });
            }

            return res.status(200).json(images);
        } catch (error) {
            console.error("Error fetching images by categories:", error);
            return res.status(500).json({ error: "Failed to retrieve images." });
        }
    }
}
