import client from "@sendgrid/client";
import { NextResponse } from "next/server";
import Logger from "../../../lib/logger";

client.setApiKey(process.env.SENDGRID_API_KEY as string);

interface NewsletterFormValues {
  email: string;
}

export async function POST(request: Request) {
  try {
    const formValues = (await request.json()) as NewsletterFormValues;

    const data = {
      list_ids: ["be1bdc02-c8d0-4bf6-b3a4-b53055256db9"],
      contacts: [
        {
          email: formValues.email,
        },
      ],
    };

    const sendGridRequest = {
      url: `/v3/marketing/contacts`,
      method: "PUT" as const,
      body: data,
    };

    const resp = await client.request(sendGridRequest);

    process.env.NODE_ENV !== "production" &&
      Logger.log({
        level: "info",
        message: JSON.stringify(resp),
      });

    return NextResponse.json({ error: "" }, { status: 200 });
  } catch (error) {
    Logger.log({
      level: "error",
      message: JSON.stringify(error),
    });
    return NextResponse.json({ error: "Mail Delivery failed" }, { status: 500 });
  }
}
