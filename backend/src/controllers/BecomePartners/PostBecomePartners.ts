import { Request, Response } from "express";
import { defaultSender, sendNotificationEmail, generateEmailTemplate } from "../../services/mailjet";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class PostBecomePartners extends Controller {
    public method = HttpMethod.post;
    public route = "/partners";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {
                email,
                name,
                reference,
                typeOfPartnership,
                apport,
                expentation,
                documentUploader,
                lang
            } = req.body;

            // Vérification des champs obligatoires
            if (!email || !name || !reference || !typeOfPartnership || !apport || !expentation) {
                return res.status(400).json({ success: false, message: "Tous les champs obligatoires doivent être remplis." });
            }

            // Vérification si le partenaire existe déjà
            const existingPartner = await db.collection("partners").findOne({ name: name.trim() });
            if (existingPartner) {
                return res.status(400).json({ success: false, message: "Ce partenaire existe déjà." });
            }

            // Création de l'objet partenaire
            const newPartner = {
                email,
                name,
                reference,
                typeOfPartnership,
                apport,
                expentation,
                documentUploader,
                createdAt: new Date()
            };

            const selectedLang = ['fr', 'en'].includes(lang) ? lang : 'fr';

            const translations = {
                fr: {
                    userSubject: "E-mail de confirmation du formulaire d’adhésion",
                    userContent: `
                        <p>Nous avons bien reçu votre formulaire d'adhésion accompagné du paiement de cotisation annuelle 
                        au nom du <strong>Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong>.</p>

                        <p>Nous vous remercions pour votre confiance et votre soutien.</p>

                        <p><strong>Votre adhésion est désormais activée.</strong></p>

                        <p>Nous vous remercions encore et vous souhaitons officiellement la bienvenue au sein de la grande communauté du RHCN !</p>
                    `
                },
                en: {
                    userSubject: "Membership application confirmation email",
                    userContent: `
                        <p>We have received your membership application form along with your annual membership fee
                        on behalf of the <strong>Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong>.</p>

                        <p>We thank you for your trust and support.</p>

                        <p><strong>Your membership is now active.</strong></p>

                        <p>Thank you again, and welcome to the RHCN community!</p>
                    `
                }
            };

            // Enregistrement dans la base de données
            const result = await db.collection("partners").insertOne(newPartner);
            if (!result.acknowledged) {
                return res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement du partenaire." });
            }

            // --- Email confirmation utilisateur ---
            const userEmailSubject = translations[selectedLang].userSubject;
            const userEmailContent = generateEmailTemplate(
                name,
                translations[selectedLang].userContent,
                selectedLang);
            // --- Email notification admin ---
            const adminEmailSubject = "Nouvelle demande de partenariat";
            const adminEmailContent = `
        Bonjour,<br><br>
        Une nouvelle demande de partenariat a été soumise :<br><br>
        <strong>Nom :</strong> ${name}<br>
        <strong>Email :</strong> ${email}<br>
        <strong>Type :</strong> ${typeOfPartnership}<br>
        <strong>Apport :</strong> ${apport}<br>
        <strong>Expentation :</strong> ${expentation}<br><br>
        Cordialement,<br>
        RHCN
      `;

            // Envoi des emails
            try {
                await sendNotificationEmail({
                    recipientEmail: defaultSender,
                    subject: adminEmailSubject,
                    htmlContent: adminEmailContent
                });
                console.log(`📩 Email admin envoyé : ${defaultSender}`);
            } catch (err) {
                console.error("❌ Erreur email admin :", err);
            }

            try {
                await sendNotificationEmail({
                    recipientEmail: email,
                    subject: userEmailSubject,
                    htmlContent: userEmailContent
                });
                console.log(`📩 Email confirmation envoyé à : ${email}`);
            } catch (err) {
                console.error("❌ Erreur email utilisateur :", err);
            }

            return res.status(201).json({
                success: true,
                message: "Demande de partenariat soumise avec succès.",
                data: newPartner
            });

        } catch (error) {
            console.error("❌ Erreur lors de l'enregistrement d'un partenaire :", error);
            return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
        }
    }
}