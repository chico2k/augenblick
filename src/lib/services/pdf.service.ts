/**
 * PDF service for generating GDPR consent documents.
 * All methods return ResultAsync for type-safe error handling.
 * German content for user-facing documents.
 */

import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { eq } from "drizzle-orm";
import PDFDocument from "pdfkit";
import { Lexer, type Token, type Tokens } from "marked";
import { db } from "@/lib/db/client";
import {
  customers,
  signatures,
  gdprVersions,
  type Customer,
  type Signature,
  type GdprVersion,
} from "@/lib/db/schema";
import { AppError } from "@/lib/errors";

/**
 * Data required to generate a GDPR PDF document.
 */
type GdprPdfData = {
  customer: Customer;
  signature: Signature;
  gdprVersion: GdprVersion;
};

/**
 * Retrieves all data required for PDF generation.
 * Validates that the customer exists and is not deleted,
 * and that the signature exists and belongs to the customer.
 *
 * @param customerId - The ID of the customer
 * @param signatureId - The ID of the signature
 * @returns ResultAsync containing the PDF data or an error
 */
function getPdfData(
  customerId: string,
  signatureId: string
): ResultAsync<GdprPdfData, AppError> {
  console.log("PDF Service: getPdfData called with", { customerId, signatureId });

  // First, get the customer
  return ResultAsync.fromPromise(
    db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1),
    (e) => {
      console.error("PDF Service: Error loading customer", e);
      return AppError.database("Kunde konnte nicht geladen werden", e);
    }
  ).andThen(([customer]) => {
    console.log("PDF Service: Customer loaded", { found: !!customer });
    if (!customer) {
      return errAsync(AppError.notFound("Kunde", customerId));
    }

    // TODO: Add soft delete check when deletedAt field is added to schema
    // if (customer.deletedAt !== null) {
    //   return errAsync(AppError.customerDeleted(customerId));
    // }

    // Get the signature with GDPR version
    console.log("PDF Service: Loading signature", { signatureId });
    return ResultAsync.fromPromise(
      db
        .select({
          signature: signatures,
          gdprVersion: gdprVersions,
        })
        .from(signatures)
        .innerJoin(gdprVersions, eq(signatures.gdprVersionId, gdprVersions.id))
        .where(eq(signatures.id, signatureId))
        .limit(1),
      (e) => {
        console.error("PDF Service: Error loading signature", e);
        return AppError.database("Signatur konnte nicht geladen werden", e);
      }
    ).andThen(([result]) => {
      console.log("PDF Service: Signature loaded", { found: !!result });
      if (!result) {
        return errAsync(AppError.notFound("Signatur", signatureId));
      }

      // Verify the signature belongs to this customer
      if (result.signature.customerId !== customerId) {
        return errAsync(
          AppError.validation(
            `Signatur ${signatureId} gehört nicht zu Kunde ${customerId}`
          )
        );
      }

      return okAsync({
        customer,
        signature: result.signature,
        gdprVersion: result.gdprVersion,
      });
    });
  });
}

/**
 * Formats a date to German locale string.
 *
 * @param date - The date to format
 * @returns Formatted date string in German format (e.g., "25. Dezember 2024")
 */
function formatDateGerman(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Renders markdown content to a PDFKit document using the marked lexer.
 * Properly handles headers, paragraphs, lists, and inline formatting.
 *
 * @param doc - The PDFKit document
 * @param content - Markdown content to render
 */
function renderMarkdownToPdf(doc: PDFKit.PDFDocument, content: string): void {
  const tokens = Lexer.lex(content);

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const headingToken = token as Tokens.Heading;
        const fontSize = headingToken.depth === 1 ? 14 : headingToken.depth === 2 ? 12 : 11;
        doc.moveDown(0.5);
        doc.fontSize(fontSize).font("Helvetica-Bold").text(extractText(headingToken.tokens));
        doc.moveDown(0.3);
        doc.fontSize(10).font("Helvetica");
        break;
      }

      case "paragraph": {
        const paragraphToken = token as Tokens.Paragraph;
        const text = extractText(paragraphToken.tokens);
        doc.text(text, { align: "justify", lineGap: 2 });
        doc.moveDown(0.5);
        break;
      }

      case "list": {
        const listToken = token as Tokens.List;
        for (let i = 0; i < listToken.items.length; i++) {
          const item = listToken.items[i];
          if (!item) continue;
          const text = extractText(item.tokens);
          const prefix = listToken.ordered ? `  ${i + 1}.  ` : "  •  ";
          doc.text(`${prefix}${text}`, { lineGap: 2 });
        }
        doc.moveDown(0.3);
        break;
      }

      case "blockquote": {
        doc.fontSize(10).font("Helvetica-Oblique");
        const text = extractBlockquoteText(token.tokens ?? []);
        doc.text(`"${text}"`, { indent: 20, lineGap: 2 });
        doc.font("Helvetica");
        doc.moveDown(0.5);
        break;
      }

      case "hr": {
        doc.moveDown(0.5);
        break;
      }

      case "space": {
        doc.moveDown(0.3);
        break;
      }

      default:
        // Handle any other token types as plain text
        if ("text" in token && typeof token.text === "string") {
          doc.text(token.text, { lineGap: 2 });
          doc.moveDown(0.3);
        }
        break;
    }
  }
}

/**
 * Extracts plain text from marked tokens, stripping all formatting.
 *
 * @param tokens - Array of marked tokens
 * @returns Plain text string
 */
function extractText(tokens: Token[] | undefined): string {
  if (!tokens) return "";

  return tokens
    .map((token): string => {
      if (token.type === "text") return (token as Tokens.Text).text;
      if (token.type === "strong") return extractText((token as Tokens.Strong).tokens);
      if (token.type === "em") return extractText((token as Tokens.Em).tokens);
      if (token.type === "codespan") return (token as Tokens.Codespan).text;
      if (token.type === "link") return extractText((token as Tokens.Link).tokens);
      if (token.type === "br") return " ";
      if ("text" in token && typeof token.text === "string") return token.text;
      return "";
    })
    .join("");
}

/**
 * Extracts text from blockquote tokens.
 *
 * @param tokens - Array of tokens inside blockquote
 * @returns Plain text string
 */
function extractBlockquoteText(tokens: Token[]): string {
  return tokens
    .map((token): string => {
      if (token.type === "paragraph") {
        return extractText((token as Tokens.Paragraph).tokens);
      }
      if ("text" in token && typeof token.text === "string") {
        return token.text;
      }
      return "";
    })
    .join(" ");
}

/**
 * Generates a PDF document from the collected data.
 * Returns a Buffer containing the PDF bytes.
 *
 * @param data - The data to include in the PDF
 * @returns ResultAsync containing the PDF buffer or an error
 */
function generatePdfDocument(data: GdprPdfData): ResultAsync<Buffer, AppError> {
  console.log("PDF Service: Generating PDF document for", {
    customerId: data.customer.id,
    signatureId: data.signature.id,
    gdprVersionId: data.gdprVersion.id,
  });

  return ResultAsync.fromPromise(
    new Promise<Buffer>((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
          info: {
            Title: "DSGVO-Einwilligungserklärung",
            Author: "Augenblick Kosmetikstudio",
            Subject: `DSGVO-Einwilligung für ${data.customer.firstName} ${data.customer.lastName}`,
          },
        });

        // Collect PDF chunks
        doc.on("data", (chunk: Buffer) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // --- PDF Content ---

        // Header
        doc
          .fontSize(20)
          .font("Helvetica-Bold")
          .text("DSGVO-Einwilligungserklärung", { align: "center" });

        doc.moveDown(2);

        // GDPR Content Section
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(data.gdprVersion.title);

        doc.moveDown(0.5);

        // Render markdown content with proper formatting
        doc.fontSize(10).font("Helvetica");
        renderMarkdownToPdf(doc, data.gdprVersion.content);

        doc.moveDown(1);

        // Consent Section
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("Erteilte Einwilligungen");

        doc.moveDown(0.5);

        doc.fontSize(10).font("Helvetica");

        // Data Processing Consent
        const dataProcessingCheck = data.signature.dataProcessingConsent ? "[X]" : "[ ]";
        doc.text(`${dataProcessingCheck}  Datenverarbeitung: Einwilligung in die Verarbeitung personenbezogener Daten`);
        doc.moveDown(0.3);

        // Health Data Consent
        const healthDataCheck = data.signature.healthDataConsent ? "[X]" : "[ ]";
        doc.text(`${healthDataCheck}  Gesundheitsdaten: Einwilligung in die Verarbeitung von Gesundheitsdaten`);
        doc.moveDown(0.3);

        // Photo Consent
        const photoConsentCheck = data.signature.photoConsent === true ? "[X]" : data.signature.photoConsent === false ? "[ ]" : "[ ]";
        doc.text(`${photoConsentCheck}  Fotonutzung: Einwilligung zur Nutzung von Fotos zu Dokumentations- und Marketingzwecken`);

        doc.moveDown(2);

        // Signature Section
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("Unterschrift");

        doc.moveDown(0.5);

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Ort: Traunreut`);

        doc.text(`Unterschrieben am: ${formatDateGerman(data.signature.signedAt)}`);

        doc.moveDown(1);

        // Add signature image if it's a valid base64 data URL
        const signatureImageData = data.signature.signatureData;
        if (signatureImageData.startsWith("data:image/")) {
          try {
            // Extract base64 data from data URL
            const base64Data = signatureImageData.split(",")[1];
            if (base64Data) {
              const imageBuffer = Buffer.from(base64Data, "base64");
              doc.image(imageBuffer, {
                fit: [200, 100],
              });
            }
          } catch {
            // If signature image fails, just add placeholder text
            doc
              .fontSize(10)
              .font("Helvetica-Oblique")
              .text("[Digitale Unterschrift hinterlegt]");
          }
        } else {
          // Signature is not a data URL, treat as reference text
          doc
            .fontSize(10)
            .font("Helvetica-Oblique")
            .text("[Digitale Unterschrift hinterlegt]");
        }

        doc.moveDown(0.5);

        // Customer name under signature
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`${data.customer.firstName} ${data.customer.lastName}`);

        doc.moveDown(2);

        // Footer with document metadata
        doc
          .fontSize(8)
          .font("Helvetica")
          .fillColor("gray")
          .text("---", { align: "center" });

        doc.moveDown(0.5);

        doc
          .text(
            `Dokument erstellt am: ${formatDateGerman(new Date())}`,
            { align: "center" }
          );

        doc
          .text(
            `Kunden-ID: ${data.customer.id}`,
            { align: "center" }
          );

        doc
          .text(
            `Signatur-ID: ${data.signature.id}`,
            { align: "center" }
          );

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    }),
    (e) => AppError.pdfGeneration("PDF konnte nicht generiert werden", e)
  );
}

/**
 * Generates a GDPR consent PDF document for a customer.
 * The PDF includes customer information, GDPR consent text,
 * and the customer's signature.
 *
 * @param customerId - The ID of the customer
 * @param signatureId - The ID of the signature record
 * @returns ResultAsync containing the PDF as a Buffer or an error
 */
export function generateGdprPdf(
  customerId: string,
  signatureId: string
): ResultAsync<Buffer, AppError> {
  return getPdfData(customerId, signatureId).andThen((data) =>
    generatePdfDocument(data)
  );
}

/**
 * PDF service object for convenient imports.
 * Provides PDF generation operations.
 */
export const pdfService = {
  generateGdprPdf,
};
