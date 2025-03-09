import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetCategoryArticles extends Controller {
    public method = HttpMethod.get;
    public route = "/categoriesArticles";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const articles = await db.collection("articles").find({}, { projection: { categories: 1 } }).toArray();

            if (!articles || articles.length === 0) {
                return res.status(404).json({ error: "No articles found." });
            }

            // Extraire toutes les catégories et les rendre uniques
            const categoriesSet = new Set<string>();
            articles.forEach(article => {
                if (article.categories && Array.isArray(article.categories)) {
                    article.categories.forEach(category => categoriesSet.add(category));
                }
            });

            const categories = Array.from(categoriesSet);
            return res.status(200).json({ categories });
        } catch (error) {
            console.error("Error fetching article categories:", error);
            return res.status(500).json({ error: "Failed to retrieve article categories." });
        }
    }
}