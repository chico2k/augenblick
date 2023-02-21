import client from "@sendgrid/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type z from "zod";
import type { schemaNewsLetter } from "../../../components/Newsletter";
import Logger from "../../../lib/Logger";

client.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formValues = req.body as z.infer<typeof schemaNewsLetter>;

    const data = {
      list_ids: ["be1bdc02-c8d0-4bf6-b3a4-b53055256db9"],
      contacts: [
        {
          email: formValues.email,
        },
      ],
    };

    const request = {
      url: `/v3/marketing/contacts`,
      method: "PUT" as const,
      body: data,
    };

    const resp = await client.request(request);

    process.env.NODE_ENV !== "production" &&
      Logger.log({
        level: "info",
        message: JSON.stringify(resp),
      });

    return res.status(200).json({ error: "" });
  } catch (error) {
    Logger.log({
      level: "error",
      message: JSON.stringify(error),
    });
    return res.status(500).json({ error: "Mail Delivery failed" });
  }
}

export default sendEmail;
