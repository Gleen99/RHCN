import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class PutUser extends Controller {
    public method = HttpMethod.put;
    public route = "/bo/user/:id";
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID utilisateur invalide" });
            }

            const userId = new ObjectId(id);
            const { firstname, lastname, email, password, role } = req.body;

            const existingUser = await db.collection('user').findOne({ _id: userId });
            if (!existingUser) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const updateData: Record<string, any> = {
                firstname: firstname ?? existingUser.firstname,
                lastname: lastname ?? existingUser.lastname,
                email: email ?? existingUser.email,
                role: role ?? existingUser.role,
                updatedAt: new Date(), // Suivi de la mise à jour
            };

            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }

            const updatedUser = await db.collection('user').findOneAndUpdate(
                { _id: userId },
                { $set: updateData },
                { returnDocument: 'after' } // Retourne l'utilisateur après mise à jour
            );

            console.log(updateData)

            if (!updatedUser) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

          
            return res.status(200).json({
                success: true,
                message: "Utilisateur mis à jour avec succès",
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,

            });
            
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
