import config from "config";
import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import Stripe from "stripe";

const stripe = new Stripe(config.get<string>("stripe.secretKey"));
const publicKey = config.get<string>("stripe.publishableKey");

export default class CreatePaymentIntent extends Controller {
    public method = HttpMethod.post;
    public route = "/create-payment-intent";

    public async handler(req: Request, res: Response): Promise<void> {
        try {
            const { amount, donorEmail, contact } = req.body;
            console.log("🔹 Requête reçue avec :", { amount, donorEmail, contact });

            if (!amount || isNaN(amount) || amount < 100) {
                console.warn("⚠️ Montant invalide :", amount);
                res.status(400).send({ error: "Le montant doit être d'au moins 1 CAD (100 centimes)." });
                return;
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "cad",
                automatic_payment_methods: { enabled: true },
                metadata: { donorEmail: donorEmail || "Anonyme" },
            });

            console.log("✅ PaymentIntent créé :", paymentIntent);
            res.status(200).send({
                clientSecret: paymentIntent.client_secret,
                publishableKey: publicKey
            });

        } catch (error) {
            console.error("❌ Erreur lors de la création du PaymentIntent :", error);
            res.status(500).send({ error: "Erreur interne du serveur." });
        }
    }
}