import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";

export default class ListInvitations extends Controller {
    public method = HttpMethod.get;
    public route = "/bo/invitations";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const cancelledUsers = await db.collection('user').find({}).toArray();
            const invitations = await db.collection('invitation').find({}).toArray();

            const invitationEmails = invitations.map(invitation => invitation.email);


            const users = await db.collection('user')
                .find({ email: { $in: invitationEmails },    })
                .project({ password: 0, refreshToken: 0 })
                .toArray();

                console.log(users)
            return res.status(200).json({
               ...users,
               ...cancelledUsers,
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des invitations:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
