import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";
import { v4 as uuid } from "uuid";
import { sendNotificationEmail } from "../../services/mailjet";
import config from "config";
import { InvitationStatus } from "../../../../shared/enums";


export default class CreateInvitation extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/invitation";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { firstname, lastname, email, role } = req.body;

            if (!email || !role) {
                return res.status(400).json({ message: "Email et rôle sont requis." });
            }

            // Vérifier si l'utilisateur ou l'invitation existe déjà
            const existingUser = await db.collection('user').findOne({ email,  status: { $ne: "cancelled" } });
            const existingInvitation = await db.collection('invitation').findOne({ email });

            if (existingUser || existingInvitation) {
                return res.status(400).json({ message: "L'utilisateur ou une invitation existe déjà pour cet email." });
            }

            const invitationToken = uuid();
            const invitationExpire = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

            // Créer l'invitation
            const invitationResult = await db.collection('invitation').insertOne({
                email,
                invitationToken,
                invitationExpire,
            });

            if (!invitationResult.acknowledged) {
                return res.status(500).json({ message: "Erreur lors de la création de l'invitation." });
            }

            const invitationId = invitationResult.insertedId;

            // Créer l'utilisateur avec l'ID d'invitation
            await db.collection('user').insertOne({
                firstname,
                lastname,
                email,
                role,
                status: InvitationStatus.PENDING,
                invitationId, 
            });

            // Envoyer un email d'invitation
            const url = config.get("services.front");
            const invitationLink = `${url}/app/acceptInvitation?token=${invitationToken}`;
            await sendNotificationEmail({
                recipientEmail: email,
                subject: "Invitation à créer un compte",
                htmlContent: `<p>Vous avez été invité à rejoindre notre plateforme.</p>
                              <p>Veuillez cliquer sur le lien suivant pour créer votre compte :</p>
                              <a href="${invitationLink}">${invitationLink}</a>`,
            });

            return res.status(201).json({ message: "Invitation créée et email envoyé avec succès." });
        } catch (error) {
            console.error("Erreur lors de la création de l'invitation:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
