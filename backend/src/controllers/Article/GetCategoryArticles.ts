import { Request, Response } from "express";
import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class GetCategoryArticles extends Controller {
    public method = HttpMethod.get;
    public route = "/categoriesArticles";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const articles = await db
                .collection("articles")
                .find({}, { projection: { "fr.categories": 1, "en.categories": 1 } })
                .toArray();

            const frSet = new Set<string>();
            const enSet = new Set<string>();

            articles.forEach((article) => {
                const frCats = article?.fr?.categories || [];
                const enCats = article?.en?.categories || [];

                frCats.forEach((cat: string) => frSet.add(cat));
                enCats.forEach((cat: string) => enSet.add(cat));
            });

            return res.status(200).json({
                categories: [
                    {
                        fr: Array.from(frSet),
                        en: Array.from(enSet),
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching article categories:", error);
            return res.status(500).json({ error: "Failed to retrieve article categories." });
        }
    }
}