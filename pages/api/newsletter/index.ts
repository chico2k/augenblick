import client from "@sendgrid/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { IContactFormValues } from "../../../lib/types";

client.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formValues = req.body as IContactFormValues;

    const data = {
      list_ids: ["2f947422-d4c5-4695-8351-d8a3db48842c"],
      contacts: [
        {
          email: req.body.email,
        },
      ],
    };

    const request = {
      url: `/v3/marketing/contacts`,
      method: "PUT" as const,
      body: data,
    };

    const resp = await client.request(request);
  } catch (error) {
    return res.status(500).json({ error: "Mail Delivery failed" });
  }

  return res.status(200).json({ error: "" });
}

export default sendEmail;
