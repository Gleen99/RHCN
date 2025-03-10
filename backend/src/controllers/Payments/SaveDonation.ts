import { Request, Response } from "express";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../../src/helpers/IDatabase";

export default class SaveDonation extends Controller {
    public method = HttpMethod.post;
    public route = "/api/save-donation";

    public async handler(req: Request, res: Response): Promise<void> {
        try {
            const { amount, contact, donorEmail } = req.body;

            if (!amount || isNaN(amount) || amount <= 0 || !contact || !donorEmail) {
                res.status(400).send({ error: "Données incomplètes ou invalides." });
                return;
            }

            // ✅ Enregistrement en BDD
            const newDonation = await db.collection("donateUser").insertOne({
                amount,
                contact,
                donorEmail,
            });

            res.status(200).send({
                message: "Donation enregistrée avec succès.",
                donationId: newDonation.insertedId
            });

        } catch (error) {
            console.error("🚨 Erreur lors de l'enregistrement du don :", error);
            res.status(500).send({ error: "Erreur interne du serveur." });
        }
    }
}