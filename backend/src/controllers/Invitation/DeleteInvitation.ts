import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";
import { InvitationStatus } from "../../../../shared/enums";

export default class DeleteInvitation extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/invitation/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!id || !ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID d'user invalide." });
            }

            const userId = new ObjectId(id);

            const user = await db.collection("user").findOne({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: "user introuvable." });
            }

            const userEmail = user.email;

            const invitation = await db.collection("invitation").findOne({ email: userEmail });

            if (invitation) {
                await db.collection("invitation").deleteOne({ _id: invitation._id });
            }

            if (user.status === InvitationStatus.PENDING) {
                await db.collection("user").updateOne(
                    { _id: userId },
                    { $set: { status: InvitationStatus.CANCELLED } }
                );
            } else {
                await db.collection("invitation").deleteOne({ _id: userId });
            }

            return res.status(200).json({ message: "Invitation et données associées supprimées avec succès." });
        } catch (error) {
            console.error("Erreur lors de la suppression de l'invitation:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
