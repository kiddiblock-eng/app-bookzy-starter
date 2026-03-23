// lib/pdf/docxGenerator.js
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, Spacing, BorderStyle, TableRow,
  TableCell, Table, WidthType, ShadingType
} from "docx";

export async function generateDocx(data) {
  const { title, author, subtitle, intro, conclusion, chaptersData } = data;

  const children = [];

  // ─── TITRE ───────────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 56, color: "1e293b" })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    })
  );

  if (subtitle) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: subtitle, size: 28, color: "64748b", italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
      })
    );
  }

  if (author) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Par ${author}`, size: 24, color: "94a3b8" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 600 },
      })
    );
  }

  // Saut de page après couverture
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── TABLE DES MATIÈRES (simple) ─────────────────────────
  children.push(
    new Paragraph({
      text: "Table des matières",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 },
    })
  );

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Introduction", size: 24, color: "334155" })],
      spacing: { before: 100, after: 100 },
    })
  );

  chaptersData.forEach((ch, i) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Chapitre ${i + 1} — ${ch.title}`, size: 24, color: "334155" })],
        spacing: { before: 100, after: 100 },
      })
    );
  });

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Conclusion", size: 24, color: "334155" })],
      spacing: { before: 100, after: 400 },
    })
  );

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── INTRODUCTION ────────────────────────────────────────
  children.push(
    new Paragraph({
      text: "Introduction",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  parseHTMLToDocx(intro || "").forEach(p => children.push(p));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ─── CHAPITRES ───────────────────────────────────────────
  chaptersData.forEach((ch, i) => {
    children.push(
      new Paragraph({
        text: `Chapitre ${i + 1}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 100 },
      })
    );
    children.push(
      new Paragraph({
        text: ch.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 100, after: 300 },
      })
    );

    parseHTMLToDocx(ch.content || "").forEach(p => children.push(p));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  });

  // ─── CONCLUSION ──────────────────────────────────────────
  children.push(
    new Paragraph({
      text: "Conclusion",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  parseHTMLToDocx(conclusion || "").forEach(p => children.push(p));

  // ─── BUILD DOCUMENT ──────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 24, color: "334155" },
          paragraph: { spacing: { line: 360 } },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 40, bold: true, color: "0f172a" },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { size: 30, bold: true, color: "3b82f6" },
          paragraph: { spacing: { before: 300, after: 100 } },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// ─── PARSER HTML → DOCX paragraphes ──────────────────────────
function parseHTMLToDocx(html) {
  if (!html) return [];

  const paragraphs = [];

  // Nettoyer le HTML basique
  const cleaned = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const lines = cleaned.split("\n").map(l => l.trim()).filter(Boolean);

  lines.forEach(line => {
    const isBullet = line.startsWith("• ");
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: isBullet ? line : line,
            size: 24,
            color: "334155",
          }),
        ],
        bullet: isBullet ? { level: 0 } : undefined,
        spacing: { before: 120, after: 120, line: 360 },
      })
    );
  });

  return paragraphs.length > 0 ? paragraphs : [
    new Paragraph({ children: [new TextRun({ text: "" })] })
  ];
}