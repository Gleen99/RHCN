import * as Mailjet from 'node-mailjet';
import config from 'config';

// Initialisation du client Mailjet
const mailjet = new Mailjet.Client({
  apiKey: config.get<string>('email.server.auth.MJ_APIKEY_PUBLIC'),
  apiSecret: config.get<string>('email.server.auth.MJ_APIKEY_PRIVATE'),
});

// Récupération de l'URL de l'API depuis la configuration
const _frontUrl = config.get<string>('email.extraData._frontUrl');

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
    console.error("Erreur lors de l'envoi de l'e-mail:", err.message);
    throw new Error("Échec de l'envoi de l'e-mail");
  }
};

// Fonction pour générer un email avec un header et un footer design
export const generateEmailTemplate = (name: string, message: string, lang: 'fr' | 'en' = 'fr'): string => {
  const translations = {
    fr: {
      greeting: "Bonjour",
      questions: "Si vous avez des questions, n'hésitez pas à nous contacter.",
      team: "L'équipe RHCN",
      rights: "© 2024 Mon Entreprise. Tous droits réservés.",
      unsubscribe: "Se désinscrire",
      privacy: "Politique de confidentialité",
    },
    en: {
      greeting: "Hello",
      questions: "If you have any questions, feel free to contact us.",
      team: "The RHCN Team",
      rights: "© 2024 My Company. All rights reserved.",
      unsubscribe: "Unsubscribe",
      privacy: "Privacy Policy",
    }
  };

  const t = translations[lang];

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #334155;
        color: white;
        text-align: center;
        padding: 15px;
        font-size: 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .header img {
        width: 100px;
        margin-bottom: 10px;
      }
      .footer {
        background-color: #D7DFE7;
        color: black;
        text-align: center;
        padding: 15px;
        font-size: 14px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
      .footer a {
        color: #334155; /* Liens du footer en #334155 */
        text-decoration: none;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 20px 0;
      }
      .important {
        color: #FFB400;
        font-weight: bold;
      }
      a {
        color: #334155; /* Tous les liens dans le message sont maintenant en #334155 */
        text-decoration: none;
        font-weight: bold;
      }
      .social-icons {
        margin-top: 10px;
      }
      .social-icons a {
        margin: 0 10px;
        display: inline-block;
      }
      .social-icons img {
        width: 24px;
        height: 24px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
         <img class="logo" src="${_frontUrl}/Logo.jpeg" alt="rhcn"/>
      </div>

      <div class="content">
        <p>${t.greeting} <span class="important">${name}</span>,</p>
        <p>${message}</p>
        <p>${t.questions}<br/><span class="important">${t.team}</span></p>
      </div>

      <div class="footer">
        <p>${t.rights}</p>
        <div class="social-icons">
          <a href="https://facebook.com"><img src="https://img.icons8.com/ios-filled/50/ffffff/facebook.png" alt="Facebook"></a>
          <a href="https://twitter.com"><img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" alt="Twitter"></a>
          <a href="https://linkedin.com"><img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn"></a>
        </div>
        <p><a href="#">${t.unsubscribe}</a> | <a href="#">${t.privacy}</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
};