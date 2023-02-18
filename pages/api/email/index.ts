import sendgrid from "@sendgrid/mail";
import type { NextApiResponse } from "next";
import z from "zod";
import { withAxiom, AxiomAPIRequest } from "next-axiom";
import Logger from "lib/Logger";
import { validationSchema } from "components/Buchung/Form";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail(req: AxiomAPIRequest, res: NextApiResponse) {
  try {
    const formValues = req.body as z.infer<typeof validationSchema>;

    const response = await sendgrid.send({
      to: formValues.email,
      from: "info@augenblick-chiemgau.com",
      bcc: "info@augenblick-chiemgau.com",
      templateId: "d-5e97ddc20d174032ba9cc30f56014b96",
      dynamicTemplateData: {
        ...formValues,
      },
    });

    process.env.NODE_ENV !== "production" &&
      Logger.log({
        level: "info",
        message: JSON.stringify(response),
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

export default withAxiom(sendEmail);
