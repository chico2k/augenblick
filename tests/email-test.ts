/**
 * Test script for booking confirmation email
 * Run with: npx tsx tests/email-test.ts
 */

import nodemailer from "nodemailer";
import { renderBookingEmail } from "../src/lib/email/template-renderer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function testBookingEmail() {
  console.log("🧪 Testing booking confirmation email...\n");

  // Debug: Check environment variables
  console.log("🔍 Environment check:");
  console.log(`  SMTP2GO_USERNAME: ${process.env.SMTP2GO_USERNAME ? "✓ Set" : "✗ Missing"}`);
  console.log(`  SMTP2GO_PASSWORD: ${process.env.SMTP2GO_PASSWORD ? "✓ Set" : "✗ Missing"}`);
  console.log();

  if (!process.env.SMTP2GO_USERNAME || !process.env.SMTP2GO_PASSWORD) {
    console.error("❌ Missing SMTP2GO credentials in .env file!");
    console.log("Please add these to your .env file:");
    console.log("  SMTP2GO_USERNAME=your_username");
    console.log("  SMTP2GO_PASSWORD=your_password");
    process.exit(1);
  }

  // Test data
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

    console.log("🔌 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!\n");

    // Render the email template
    console.log("🎨 Rendering email template with Handlebars...");
    const htmlContent = renderBookingEmail(testData);
    console.log("✅ Template rendered successfully!\n");

    // Send test email
    console.log("📮 Sending test email...");
    const info = await transporter.sendMail({
      from: '"Augenblick Chiemgau" <info@augenblick-chiemgau.com>',
      to: testData.email,
      bcc: "info@augenblick-chiemgau.com",
      subject: "Danke für deine Anfrage bei Augenblick Chiemgau - TEST",
      html: htmlContent,
    });

    console.log("✅ Email sent successfully!");
    console.log("\n📊 Email Info:");
    console.log(`  Message ID: ${info.messageId}`);
    console.log(`  Response: ${info.response}`);
    console.log(`\n✉️  Check your inbox at: ${testData.email}`);
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error(error);
    process.exit(1);
  }
}

// Run the test
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
