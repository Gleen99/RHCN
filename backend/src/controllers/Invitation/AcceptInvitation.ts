import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import {InvitationStatus} from "../../../shared/enums";


export default class AcceptInvitation extends Controller {
    public method = HttpMethod.post;
    public route = "/bo/accept-invitation";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { token, email, password } = req.body;

            if (!token || !email || !password) {
                return res.status(400).json({ message: "Tous les champs sont requis." });
            }

            const invitation = await db.collection('invitation').findOne({ invitationToken: token });

            if (!invitation) {
                return res.status(400).json({ message: "Invitation invalide." });
            }

            if (invitation.invitationExpire < new Date()) {
                return res.status(400).json({ message: "Invitation expirée." });
            }

            if (invitation.email !== email) {
                return res.status(400).json({ message: "L'email ne correspond pas à l'invitation." });
            }

            // Vérifier si l'utilisateur existe avec cet email et n'est pas annulé
            const existingUser = await db.collection('user').findOne({
                email,
                status: { $ne: InvitationStatus.CANCELLED }
            });

            if (!existingUser) {
                return res.status(400).json({ message: "Aucun compte pour cet email." });
            }

            // Générer un refreshToken
            const refreshToken = uuid();

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Mettre à jour l'utilisateur avec les détails fournis
            const updateResult = await db.collection('user').updateOne(
                { email, status: InvitationStatus.PENDING },
                {
                    $set: {
                        password: hashedPassword,
                        status: InvitationStatus.ACCEPTED,
                        refreshToken
                    }
                }
            );

            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ message: "Aucun utilisateur correspondant trouvé." });
            }

            // Répondre avec succès
            return res.status(201).json({
                message: "Compte créé avec succès.",
                refreshToken
            });
        } catch (error) {
            console.error("Erreur lors de l'acceptation de l'invitation:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
