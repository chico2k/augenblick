import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import type z from "zod";
import type { validationSchemaBuchung } from "../../../components/Buchung";
import { renderBookingEmail } from "../../../lib/email/template-renderer";
import Logger from "../../../lib/logger";

// Create SMTP2GO transporter
const transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 587, // TLS port (recommended)
  secure: false, // false for TLS
  auth: {
    user: process.env.SMTP2GO_USERNAME as string,
    pass: process.env.SMTP2GO_PASSWORD as string,
  },
});

export async function POST(request: Request) {
  try {
    const formValues = (await request.json()) as z.infer<typeof validationSchemaBuchung>;

    // Render the email template with Handlebars
    const htmlContent = renderBookingEmail({
      name: formValues.name,
      email: formValues.email,
      message: formValues.message,
      phone: formValues.phone,
    });

    // Send email to customer
    const response = await transporter.sendMail({
      from: '"Augenblick Chiemgau" <info@augenblick-chiemgau.com>',
      to: formValues.email,
      bcc: "info@augenblick-chiemgau.com",
      subject: "Danke für deine Anfrage bei Augenblick Chiemgau",
      html: htmlContent,
    });

    process.env.NODE_ENV !== "production" &&
      Logger.log({
        level: "info",
        message: JSON.stringify(response),
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
