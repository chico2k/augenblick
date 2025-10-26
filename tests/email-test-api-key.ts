/**
 * Alternative test using API key authentication (if supported by your SMTP2GO account)
 * Run with: npx tsx tests/email-test-api-key.ts
 */

import nodemailer from "nodemailer";
import { renderBookingEmail } from "../src/lib/email/template-renderer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function testBookingEmail() {
  console.log("🧪 Testing booking confirmation email with API key auth...\n");

  const testData = {
    name: "Mario Galla",
    email: "mariogalla86@gmail.com",
    message:
      "Hallo, ich interessiere mich für eine Wimpernverlängerung. Hätten Sie nächste Woche einen Termin frei? Vielen Dank!",
    phone: "+49 123 456789",
  };

  console.log("📧 Test Email Data:");
  console.log(JSON.stringify(testData, null, 2));
  console.log("\n");

  try {
    // Try using API key as username with empty password
    const transporter = nodemailer.createTransport({
      host: "mail.smtp2go.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP2GO_API_KEY as string,
        pass: "", // Some providers accept API key with empty password
      },
    });

    console.log("🔌 Verifying SMTP connection with API key...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!\n");

    console.log("🎨 Rendering email template with Handlebars...");
    const htmlContent = renderBookingEmail(testData);
    console.log("✅ Template rendered successfully!\n");

    console.log("📮 Sending test email...");
    const info = await transporter.sendMail({
      from: '"Augenblick Chiemgau" <info@augenblick-chiemgau.com>',
      to: testData.email,
      bcc: "info@augenblick-chiemgau.com",
      subject: "Danke für deine Anfrage bei Augenblick Chiemgau - TEST (API)",
      html: htmlContent,
    });

    console.log("✅ Email sent successfully!");
    console.log("\n📊 Email Info:");
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Response: ${info.response}`);
    console.log(`\n✉️  Check your inbox at: ${testData.email}`);
  } catch (error) {
    console.error("❌ API key auth failed. You need SMTP user credentials.");
    console.error("Error:", error);
    console.log("\n💡 Please create SMTP user credentials in your SMTP2GO dashboard:");
    console.log("   1. Go to https://app.smtp2go.com/");
    console.log("   2. Navigate to Settings → Sending → SMTP Users");
    console.log("   3. Create a new SMTP user");
    console.log("   4. Add the username and password to your .env file\n");
    process.exit(1);
  }
}

testBookingEmail()
  .then(() => {
    console.log("\n✨ Test completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Test failed:");
    console.error(error);
    process.exit(1);
  });
