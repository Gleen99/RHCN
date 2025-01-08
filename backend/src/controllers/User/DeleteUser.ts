import { AuthMode, Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";
import { ObjectId } from "mongodb";

export default class DeleteUser extends Controller {
    public method = HttpMethod.delete;
    public route = "/bo/user/:id"; 
    private auth = AuthMode.authenticated;

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            // Vérifier si l'ID fourni est valide
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID utilisateur invalide" });
            }

            const userId = new ObjectId(id);

            const existingUser = await db.collection('user').findOne({ _id: userId });
            if (!existingUser) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Supprimer l'utilisateur
            const result = await db.collection('user').deleteOne({ _id: userId });

            if (result.deletedCount === 0) {
                return res.status(500).json({ message: "Échec de la suppression de l'utilisateur" });
            }

            return res.status(200).json({
                success: true,
                message: "Utilisateur supprimé avec succès",
            });
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    }
}
