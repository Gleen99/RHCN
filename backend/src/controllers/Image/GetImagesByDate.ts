import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetImagesByDate extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/images/date";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({ error: "Start date and end date are required." });
            }

            const images = await db
                .collection("images")
                .find({
                    date: {
                        $gte: new Date(startDate as string),
                        $lte: new Date(endDate as string),
                    },
                })
                .toArray();

            if (!images || images.length === 0) {
                return res.status(404).json({ error: "No images found for the specified date range." });
            }

            return res.status(200).json(images);
        } catch (error) {
            console.error("Error fetching images by date:", error);
            return res.status(500).json({ error: "Failed to retrieve images." });
        }
    }
}
