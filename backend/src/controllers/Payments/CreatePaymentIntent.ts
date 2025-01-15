import config from "config";
import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import Stripe from "stripe";

// ✅ Initialisation de Stripe avec la clé API secrète
const stripe = new Stripe(config.get<string>("stripe.secretKey"));

export default class AddUserToNewsletter extends Controller {
    public method = HttpMethod.post;
    public route = "/create-payment-intent";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            // ✅ 1. Récupération des données du front-end
            const { amount, donorEmail, message } = req.body;

            // ✅ 2. Vérification du montant (Minimum 1 CAD)
            if (!amount || isNaN(amount) || amount < 100) {
                return res.status(400).json({ error: "Le don doit être d'au moins 1 CAD (100 centimes)." });
            }

            // ✅ 3. Création du Payment Intent avec Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // Montant en centimes CAD (ex: 1000 = 10 CAD)
                currency: "cad", // 💰 Devise = Dollar Canadien
                payment_method_types: ["card"], // Paiement par carte
                metadata: {
                    donorEmail: donorEmail || "Anonyme",
                    message: message || "Merci pour votre soutien !",
                },
            });

            // ✅ 4. Retourne le `client_secret` au frontend
            return res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            console.error("Erreur lors de la création du Payment Intent :", error);
            return res.status(500).json({ error: "Erreur interne du serveur." });
        }
    }
}