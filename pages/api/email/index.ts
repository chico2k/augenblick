import sendgrid from "@sendgrid/mail";
import type { NextApiRequest, NextApiResponse } from 'next'
import { IContactFormValues } from "../../../lib/types";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
    try {
        const formValues = req.body as IContactFormValues


        await sendgrid.send({
            to: formValues.email,
            from: "info@mutably.io",
            bcc: ["info@mutably.io", "galla@mutably.io"],
            templateId: "d-3cd29e8234b54725a11e347acc535bb6",
            dynamicTemplateData: {
                ...formValues,
            }

        });

    } catch (error) {
        return res.status(500).json({ error: "Mail Delivery failed" });
    }

    return res.status(200).json({ error: "" });
}

export default sendEmail;