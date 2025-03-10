import config from "config";
import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";

export default class GetStripePublicKey extends Controller {
    public method = HttpMethod.get;
    public route = "/stripe-public-key";

    public async handler(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer la clé publique Stripe depuis la configuration
            const publicKey = config.get<string>("stripe.publishableKey");

            if (!publicKey) {
                console.error("❌ Clé publique Stripe non configurée.");
                res.status(500).send({ error: "Clé publique Stripe non disponible." });
                return;
            }

            console.log("✅ Clé publique Stripe envoyée au frontend.");
            res.status(200).send({ publicKey });

        } catch (error) {
            console.error("🚨 Erreur lors de la récupération de la clé publique Stripe :", error);
            res.status(500).send({ error: "Erreur interne du serveur." });
        }
    }
}