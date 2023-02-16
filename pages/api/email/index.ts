import sendgrid from "@sendgrid/mail";
import type { NextApiResponse } from "next";
import { IContactFormValues } from "../../../lib/types";
import { withAxiom, AxiomAPIRequest } from "next-axiom";
import Logger from "lib/Logger";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendEmail(req: AxiomAPIRequest, res: NextApiResponse) {
  try {
    const formValues = req.body as IContactFormValues;

    const respone = await sendgrid.send({
      to: formValues.email,
      from: "info@mutably.io",
      templateId: "d-5e97ddc20d174032ba9cc30f56014b96",
      dynamicTemplateData: {
        ...formValues,
      },
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
