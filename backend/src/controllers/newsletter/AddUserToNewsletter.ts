import config from "config";
import { Request, Response } from "express";
import { Client } from "node-mailjet";
import { Controller, HttpMethod } from "../../helpers/controller";
import { db } from "../../helpers/IDatabase";

export default class AddUserToNewsletter extends Controller {
    public method = HttpMethod.post;
    public route = "/newsletter";

    public async handler(req: Request, res: Response): Promise<any> {
        try {
            const email = req.body.email.trim().toLowerCase();

            const existing = await db.collection("newsletter").findOne({ email });
            if (!existing) {
                await db.collection("newsletter").insertOne({ email });
            }

            // Add email to Mailjet list
            await addEmailToMailjetContactList(email, config.get("email.newsletterListId"));

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error adding user to newsletter:", error);
            return res.status(500).json({ error: "Failed to add user to newsletter." });
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
