import * as Mailjet from 'node-mailjet';
import config from 'config';

const mailjet = new Mailjet.Client({
  apiKey: config.get<string>('email.server.auth.MJ_APIKEY_PUBLIC'),
  apiSecret: config.get<string>('email.server.auth.MJ_APIKEY_PRIVATE'),
});

interface EmailOptions {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  htmlContent: string;
}
export const defaultSender = config.get<string>('email.defaultSender');
export const defaultName = config.get<string>('email.defaultName');

export const sendNotificationEmail = async (options: EmailOptions): Promise<void> => {
  const { recipientEmail, recipientName, subject, htmlContent } = options;

  try {
   

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: defaultSender,
            Name: defaultName,
          },
          To: [
            {
              Email: recipientEmail,
              Name: recipientName || recipientEmail,
            },
          ],
          Subject: subject,
          HTMLPart: htmlContent,
        },
      ],
    });
    console.log('E-mail envoyé avec succès à', recipientEmail);
  } catch (err: any) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', err.message);
    throw new Error('Échec de l\'envoi de l\'e-mail');
  }
};