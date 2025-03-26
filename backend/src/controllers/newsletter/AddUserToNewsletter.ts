import config from "config";
import { Request, Response } from "express";
import { Client } from "node-mailjet";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";
import {
    sendNotificationEmail,
    generateEmailTemplate,
    defaultSender,
} from "../../services/mailjet";

export default class AddUserToNewsletter extends Controller {
    public method = HttpMethod.post;
    public route = "/newsletter";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const email = req.body.email?.trim().toLowerCase();
            const firstname = req.body.firstname?.trim() || "";

            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required." });
            }

            const existing = await db.collection("newsletter").findOne({ email });
            if (!existing) {
                await db.collection("newsletter").insertOne({ email, createdAt: new Date() });
            }

            await addEmailToMailjetContactList(email, config.get("email.newsletterListId"));

            const frontUrl = config.get("services.front");
            const unsubscribeLink = `${frontUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

            // 📧 Email à l'utilisateur
            const userSubject = "Restez informé(e) avec RHCN";
            const userContent = generateEmailTemplate(firstname, `
  <p>Merci de vous être inscrit(e) à l’infolettre du <strong>Regroupement des Haïtiens de la Capitale-Nationale (RHCN)</strong> !</p>

  <p>Nous sommes ravis de pouvoir vous tenir informé(e) de nos dernières actualités, offres spéciales et contenus exclusifs, directement dans votre boîte de réception.</p>

  <p>En vous inscrivant, vous recevrez chaque mois :</p>
  <ul>
    <li>Des détails en avant-première sur nos prochaines activités</li>
    <li>Des informations sur les initiatives sociales et communautaires à Québec</li>
    <li>Des opportunités à ne pas manquer et bien plus encore</li>
  </ul>

  <p><strong>Comment rester connecté(e) :</strong></p>
  <ul>
    <li>Gardez un œil sur votre boîte mail pour nos prochains envois</li>
    <li>Ajoutez-nous à votre liste de contacts sûrs pour ne rien manquer</li>
  </ul>

  <p><a href="https://rhcn.ca" target="_blank">Visitez notre site web</a></p>

  <p>Suivez-nous aussi sur les réseaux sociaux :</p>
  <p>
    <a href="https://www.instagram.com/rhcn1804?igsh=aXhjeGJxYnAzYmV1" target="_blank">Instagram</a> |
    <a href="https://www.facebook.com/share/183hZZAKTZ/?mibextid=wwXIfr" target="_blank">Facebook</a> |
    <a href="https://www.linkedin.com/company/regroupement-des-ha%C3%AFtiens-de-la-capitale-nationale-rhcn/" target="_blank">LinkedIn</a>
  </p>

  <p style="font-size: 13px; color: #888;">
    Vous pouvez à tout moment <a href="${unsubscribeLink}" target="_blank">vous désabonner</a> ou modifier vos préférences.
  </p>

  <p>Nous respectons votre vie privée et nous nous engageons à protéger vos informations personnelles.</p>

  <p>Merci de faire partie de notre communauté. Nous avons hâte de vous tenir informé(e) !</p>
`);

            await sendNotificationEmail({
                recipientEmail: email,
                subject: userSubject,
                htmlContent: userContent,
            });

            // 📬 Email à l'admin
            const adminSubject = "Nouvelle inscription à l'infolettre";
            const adminContent = generateEmailTemplate("Admin", `
        <p><strong>Email :</strong> ${email}</p>
        ${firstname && `<p><strong>Prénom :</strong> ${firstname}</p>`}
        <p>vient de s'inscrire à la newsletter.</p>
      `);

            await sendNotificationEmail({
                recipientEmail: defaultSender,
                subject: adminSubject,
                htmlContent: adminContent,
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("❌ Newsletter subscription error:", error);
            return res.status(500).json({ error: "Subscription failed." });
        }
    }
}

async function addEmailToMailjetContactList(email: string, contactListId: string) {
    try {
        const mailjet = new Client({

            apiKey: config.get("email.server.auth.MJ_APIKEY_PUBLIC") ,
            apiSecret: config.get("email.server.auth.MJ_APIKEY_PRIVATE")
        });

        let contactId: number;

        // Check if contact already exists
        try {
            const getrequest = await mailjet
                .get("contact", { version: "v3" })
                .id(email)
                .request();
            contactId = (getrequest.body as any).Data[0].ID;
            console.log("Mailjet: Retrieved contact ID: ", contactId);
        } catch (geterr: any) {
            const request = await mailjet
                .post("contact", { version: "v3" })
                .request({
                    IsExcludedFromCampaigns: "false",
                    Email: email
                });
            contactId = (request.body as any).Data[0].ID;
            console.log("Mailjet: Created contact ID: ", contactId);
        }

        await mailjet
            .post("contact", { version: "v3" })
            .id(contactId)
            .action("managecontactslists")
            .request({
                ContactsLists: [
                    {
                        Action: "addnoforce",
                        ListID: contactListId
                    }
                ]
            });
        console.log("Mailjet: Added contact " + contactId + " to newsletter contact list " + contactListId);
    } catch (err: any) {
        console.error("Unable to add contact to newsletter list: ", err);
    }
}
