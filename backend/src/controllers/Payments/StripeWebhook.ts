import config from "config";
import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import Stripe from "stripe";

// ✅ Initialisation de Stripe avec la clé API secrète
const stripe = new Stripe(config.get<string>("stripe.secretKey"));

export default class StripeWebhook extends Controller {
    public method = HttpMethod.post;
    public route = "/webhook";

    public async handler(req: Request, res: Response): Promise<any> {
        const sig = req.headers["stripe-signature"];
        const webhookSecret = config.get<string>("stripe.webhookSecret"); // 📌 Stocké en config

        let event: Stripe.Event;

        try {
            // ✅ Vérification de la signature Stripe (Sécurité)
            if (!sig || !webhookSecret) {
                return res.status(400).send("Signature manquante");
            }

            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            console.error("Erreur de validation du webhook :", err);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // 📌 Gestion des événements Stripe
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`✅ Paiement réussi pour ${paymentIntent.amount / 100} CAD`);

                // ✅ Traitement du don (ex: enregistrer en base de données)
                this.handleSuccessfulPayment(paymentIntent);
                break;

            case "payment_intent.payment_failed":
                console.log("❌ Échec du paiement !");
                break;

            case "charge.refunded":
                console.log("🔄 Paiement remboursé !");
                break;

            default:
                console.log(`ℹ️ Événement Stripe reçu : ${event.type}`);
        }

        // ✅ Réponse OK à Stripe (important)
        res.json({ received: true });
    }

    private handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
        // ✅ Simulation d'un enregistrement du donateur en base de données
        console.log(`💾 Don enregistré : ${paymentIntent.amount / 100} CAD`);
        console.log(`✉️ Email du donateur : ${paymentIntent.metadata?.donorEmail || "Inconnu"}`);
        console.log(`📝 Message du donateur : ${paymentIntent.metadata?.message || "Aucun message"}`);
    }
}