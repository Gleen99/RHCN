import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import {ObjectId} from "mongodb";

export default class DeleteArticleCategory extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/categories/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid article ID." });
            }
            const articleCategoriesId = new ObjectId(id);

            const deletedResult = await db.collection("categories").deleteOne({ _id: articleCategoriesId });


            if (deletedResult.deletedCount === 0) {
                return res.status(404).json({ error: "Category not found in any article." });
            }

            return res.status(200).json({ message: "Category deleted successfully." });
        } catch (error) {
            console.error("Error deleting category:", error);
            return res.status(500).json({ error: "Failed to delete category." });
        }
    }
}