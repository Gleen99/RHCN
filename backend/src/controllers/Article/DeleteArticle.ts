import { ObjectId } from "mongodb";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../../src/helpers/IDatabase";

export default class DeleteArticle extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/article/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid article ID." });
            }

            const articleId = new ObjectId(id);

            const deletedResult = await db.collection("articles").deleteOne({ _id: articleId });

            if (deletedResult.deletedCount === 0) {
                return res.status(404).json({ error: "Article not found." });
            }

            return res.status(200).json({ message: "Article deleted successfully." });
        } catch (error) {
            console.error("Error deleting article:", error);
            return res.status(500).json({ error: "Failed to delete article." });
        }
    }
}
