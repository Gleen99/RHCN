import { Controller, HttpMethod } from "../../helpers/controller";
import { Request, Response } from "express";
import { db } from "../../helpers/IDatabase";
import {v4 as uuid} from "uuid";
import { comparePassword } from "../../../src/helpers/authMiddleware";

export default class Login extends Controller {
    public method = HttpMethod.post; 
    public route = "/bo/authenticate"; 

    public async handler(req: Request, res: Response): Promise<any> {
    
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
            }
            // const users = await mongoose.connection.collection('bouser').find().toArray();
            const user = await db.collection('bouser').findOne({ username: req.body.username });
            console.log("Résultat de la recherche:", user);
            //  console.log("Résultat de la recherche:", users);
            if (!user) {
                return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
            }

            // Comparaison du mot de passe fourni avec le hash stocké
            const isMatch = await comparePassword(req.body.password, user, 'password');
            if (!isMatch) {
                return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
            }

            const token = uuid();
            await db.collection('bouser').updateOne(
                { _id: user._id },
                { $set: { token: token, tokenDate: new Date().getTime() } }
            );
            
          // Envoyer une notification
        //   await sendNotification(user._id.toString(), "Nouvelle connexion à votre compte");
            
          return res.status(200).json({
                success: true,
                token: token,
                message: "Connexion réussie"
            });

        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            return res.status(500).json({ message: "Erreur lors de la connexion" });
        }
    }
};

