import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../../src/helpers/IDatabase";

export default class DeleteImage extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/image/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid image ID." });
            }

            const imageId = new ObjectId(id);

            const deleteResult = await db.collection("images").deleteOne({ _id: imageId });

            if (deleteResult.deletedCount === 0) {
                return res.status(404).json({ error: "Image not found." });
            }

            return res.status(200).json({ message: "Image deleted successfully." });
        } catch (error) {
            console.error("Error deleting image:", error);
            return res.status(500).json({ error: "Failed to delete image." });
        }
    }
}
