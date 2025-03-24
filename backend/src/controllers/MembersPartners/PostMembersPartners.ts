import {Request, Response} from "express";
import {defaultSender, generateEmailTemplate, sendNotificationEmail} from "../../services/mailjet";
import {Controller, HttpMethod} from "../../helpers/controller";
import {db} from "../../helpers/IDatabase";
import {ObjectId} from "mongodb";

export default class PostMembersPartners extends Controller {
    public method = HttpMethod.post;
    public route = "/member-partners";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {
                firstName,
                lastName,
                address,
                email,
                phone,
                birthday,
                age,
                message,
                confirmationPaiements
            } = req.body;

            // Vérification des champs obligatoires
            if (!firstName || !lastName || !email || !phone || !birthday || !age) {
                return res.status(400).json({
                    success: false,
                    message: "Tous les champs obligatoires doivent être remplis."
                });
            }

            // Vérification si l'email existe déjà
            const existingMember = await db.collection("members_partners").findOne({email: email.trim()});
            if (existingMember) {
                return res.status(400).json({success: false, message: "Cet email est déjà enregistré."});
            }

            // Création de l'objet membre
            const newMember = {
                firstName,
                lastName,
                address,
                email: email.trim(),
                phone,
                birthday,
                age,
                message,
                confirmationPaiements,
            };

            // Enregistrement dans la base de données
            const result = await db.collection("members_partners").insertOne(newMember);

            if (!result.acknowledged) {
                return res.status(500).json({success: false, message: "Erreur lors de l'enregistrement du membre."});
            }

            // Contenu de l'email pour l'utilisateur
            // Email utilisateur
            const userEmailSubject = "Confirmation formulaire membre";
            const userEmailContent = generateEmailTemplate(
                firstName,
                `
  <p>Nous avons bien reçu votre formulaire d'adhésion accompagné du paiement de cotisation annuelle de 20 dollars au nom du <strong>Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong>.</p>

  <p>Nous vous remercions pour votre confiance et votre soutien. Votre adhésion est désormais activée et vous recevrez très bientôt de nos nouvelles.</p>

  <p>Entre-temps, si vous souhaitez vous joindre à l'une de nos commissions en préparation de nos nombreux projets à venir (logistique et suivi, communication, finances ou relations publiques), n'hésitez pas à nous le faire savoir.</p>

  <p>Encore une fois, merci de votre confiance et bienvenue dans la grande communauté du <strong>RHCN</strong> !</p>

  <br/>
  <p>Cordialement,</p>
  <p><strong>Le Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong></p>
  `
            );
            await sendNotificationEmail({
                recipientEmail: email,
                subject: userEmailSubject,
                htmlContent: userEmailContent,
            });
            // Contenu de l'email pour l'administrateur
            const adminEmailSubject = "Nouvelle inscription de membre partenaire";
            const adminEmailContent = `
  Bonjour,<br><br>

  Un nouveau membre partenaire a complété le formulaire d'inscription :<br><br>

  <strong>Nom :</strong> ${firstName} ${lastName}<br>
  <strong>Email :</strong> ${email}<br>
  <strong>Téléphone :</strong> ${phone}<br>
  <strong>Message :</strong> ${message || "Aucun message transmis"}<br><br>

  Nous vous invitons à consulter les informations dans l’espace d’administration pour effectuer le suivi nécessaire.<br><br>

  Cordialement,<br>
  L’équipe du Regroupement des Haïtiens de la Capitale-Nationale (RHCN)
`;

            // Envoi de l'email à l'administrateur
            try {
                await sendNotificationEmail({
                    recipientEmail: defaultSender, // Email de l'admin
                    subject: adminEmailSubject,
                    htmlContent: adminEmailContent
                });

                console.log(`📩 Email de notification envoyé à l'administrateur : ${defaultSender}`);
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email à l'administrateur :", error);
            }

            // Envoi de l'email de confirmation à l'utilisateur
            try {
                await sendNotificationEmail({
                    recipientEmail: email.trim(),
                    subject: userEmailSubject,
                    htmlContent: userEmailContent
                });

                console.log(`📩 Email de confirmation envoyé à l'utilisateur : ${email}`);
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email à l'utilisateur :", error);
            }

            // Réponse au client
            return res.status(201).json({
                success: true,
                message: "Membre enregistré avec succès.",
                data: newMember
            });

        } catch (error) {
            console.error("❌ Erreur lors de l'inscription d'un membre partenaire :", error);
            return res.status(500).json({success: false, message: "Erreur interne du serveur."});
        }
    }
}