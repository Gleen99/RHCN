import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import {ObjectId} from "mongodb";

export default class UpdateArticleCategory extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/categories/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { en, fr } = req.body;


            if (!en || !fr) {
                return res.status(400).json({ error: "Both English and French content are required." });
            }
            const updateData = {
               en,
                fr
            };
            const categoryId = new ObjectId(id);


            // Update the category in all articles
            const result = await db.collection("categories").updateMany(
                { _id: categoryId },
                { $set: updateData},
            );
            console.log(result)

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Category not found." });
            }

            return res.status(200).json({ message: "Category updated successfully." });
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({ error: "Failed to update category." });
        }
    }
}
