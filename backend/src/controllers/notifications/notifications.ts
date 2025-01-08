import express, { Request, Response } from 'express';
import { sendNotificationEmail } from '../../services/mailjet';
import { Controller, HttpMethod } from '../../../src/helpers/controller';

export default class Notification extends Controller {
    public method = HttpMethod.post; 
    public route = "/send-email"; 

    public async handler(req: Request, res: Response): Promise<void> {
        const { email, subject, message } = req.body;

        // Validation de base
        if (!email || !subject || !message) {
             res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        // Vérification du format de l'adresse e-mail
        const isValidEmail = (email: string) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };

        if (!isValidEmail(email)) {
             res.status(400).json({ error: 'Adresse e-mail invalide.' });
        }

        try {
            await sendNotificationEmail({
                recipientEmail: email,
                subject,
                htmlContent: message,
            });
            res.status(200).json({ message: 'Email envoyé avec succès!' });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail:', error.message);
            res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
        }
    }
}