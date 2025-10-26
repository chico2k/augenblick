import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

export interface BookingEmailData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

/**
 * Renders the booking confirmation email template with the provided data
 */
export const renderBookingEmail = (data: BookingEmailData): string => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "booking-confirmation.hbs"
  );

  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);

  return template(data);
};
