import {AuthMode, Controller, HttpMethod} from "../../helpers/controller";
import {Request, Response} from "express";
import {db} from "../../helpers/IDatabase";
import {v4 as uuid} from "uuid";
import {generateEmailTemplate, sendNotificationEmail} from "../../services/mailjet";
import config from "config";
import {InvitationStatus} from "../../../../shared/enums";

export default class CreateInvitation extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/invitation";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const {firstname, lastname, email, role} = req.body;

            if (!email || !role) {
                return res.status(400).json({message: "Email et rôle sont requis."});
            }

            // Vérifier si l'utilisateur ou une invitation existent déjà
            const existingUser = await db.collection("user").findOne({email, status: {$ne: "cancelled"}});
            const existingInvitation = await db.collection("invitation").findOne({email});

            if (existingUser || existingInvitation) {
                return res.status(400).json({message: "L'utilisateur ou une invitation existe déjà pour cet email."});
            }

            const invitationToken = uuid();
            const invitationExpire = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

            // Créer l'invitation
            const invitationResult = await db.collection("invitation").insertOne({
                email,
                invitationToken,
                invitationExpire,
                firstname,
                lastname,
                role,
                createdAt: new Date(),
            });

            if (!invitationResult.acknowledged) {
                return res.status(500).json({message: "Erreur lors de la création de l'invitation."});
            }

            const invitationId = invitationResult.insertedId;

            // Créer un utilisateur temporaire avec le lien à l'invitation
            await db.collection("user").insertOne({
                firstname,
                lastname,
                email,
                role,
                status: InvitationStatus.PENDING,
                invitationId,
                createdAt: new Date(),
            });

            // Générer le lien d'invitation
            const frontUrl = config.get("services.front");
            const invitationLink = `${frontUrl}/app/acceptInvitation?token=${invitationToken}`;

            // Email
            const subject = "Invitation à rejoindre la plateforme";
            const message = generateEmailTemplate(
                firstname,
                `
    <p>Vous avez été invité(e) à rejoindre notre plateforme en tant que <strong>${role}</strong>.</p>
    <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
    <p><a href="${invitationLink}">Créer mon compte</a></p>
    <p><em>Ce lien est valable pendant 24 heures.</em></p>
  `
            );
            await sendNotificationEmail({
                recipientEmail: email,
                subject,
                htmlContent: message,
            });

            return res.status(201).json({message: "Invitation créée et email envoyé avec succès."});
        } catch (error) {
            console.error("Erreur lors de la création de l'invitation:", error);
            return res.status(500).json({message: "Erreur interne du serveur."});
        }
    }
}