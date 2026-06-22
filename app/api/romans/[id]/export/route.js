export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Roman from "@/models/Roman";
import { verifyAuth } from "@/lib/auth";
import { generateRomanHTML } from "@/lib/romanTemplates";
import { getBrowser } from "@/lib/puppeteer";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "pdf";

    const roman = await Roman.findOne({ _id: params.id, userId: user.id });
    if (!roman) return NextResponse.json({ success: false, message: "Roman introuvable." }, { status: 404 });

    if (format === "pdf") {
      // ── Générer le PDF avec Puppeteer ─────────────────────────────────────
      const html = generateRomanHTML(roman.toObject());

      const browser = await getBrowser();

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A5",
        printBackground: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      });

      await browser.close();

      const filename = `${roman.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase()}.pdf`;

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": pdfBuffer.length.toString(),
        },
      });
    }

    if (format === "docx") {
      // ── Générer le DOCX avec docx library ────────────────────────────────
      const { Document, Paragraph, TextRun, HeadingLevel, PageBreak, AlignmentType } = await import("docx");
      const { Packer } = await import("docx");

      const children = [];

      // Titre
      children.push(
        new Paragraph({
          text: roman.title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // Genre
      children.push(
        new Paragraph({
          children: [new TextRun({ text: roman.genre.toUpperCase(), color: "888888", size: 20 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );

      // Synopsis
      children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Synopsis", bold: true, size: 24 })],
          spacing: { after: 200 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: roman.synopsis, italics: true, size: 22 })],
          spacing: { after: 600 },
        })
      );

      // Chapitres
      for (const ch of roman.chapters) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Chapitre ${ch.number}`, color: "888888", size: 20 })],
            spacing: { after: 100 },
          })
        );
        children.push(
          new Paragraph({
            text: ch.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          })
        );

        // Contenu paragraphe par paragraphe
        const paragraphs = ch.content.split("\n\n").filter(p => p.trim());
        for (const para of paragraphs) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: para.trim(), size: 22 })],
              indent: { firstLine: 720 },
              spacing: { after: 120 },
            })
          );
        }
      }

      const doc = new Document({ sections: [{ children }] });
      const buffer = await Packer.toBuffer(doc);

      const filename = `${roman.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase()}.docx`;

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({ success: false, message: "Format invalide." }, { status: 400 });

  } catch (e) {
    console.error("❌ Export roman:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}