import client from "@sendgrid/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { IContactFormValues } from "../../../lib/types";

client.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formValues = req.body as IContactFormValues;

    const data = {
      list_ids: ["be1bdc02-c8d0-4bf6-b3a4-b53055256db9"],
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
