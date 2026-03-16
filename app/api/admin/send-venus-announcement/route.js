import { NextResponse } from "next/server";
import { Resend } from "resend";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { venusAnnouncementTemplate } from "@/lib/emailTemplates/venusAnnouncementTemplate";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Fichier local pour tracker les emails déjà envoyés
const SENT_FILE = path.join(process.cwd(), "venus-sent.json");

function getSentEmails() {
  try {
    if (fs.existsSync(SENT_FILE)) {
      return new Set(JSON.parse(fs.readFileSync(SENT_FILE, "utf-8")));
    }
  } catch {}
  return new Set();
}

function saveSentEmails(sentSet) {
  fs.writeFileSync(SENT_FILE, JSON.stringify([...sentSet]), "utf-8");
}

export async function POST(req) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dryRun = false, limit = null, testEmail = null } = await req.json().catch(() => ({}));

    // Envoi test sur un email précis
    if (testEmail) {
      await dbConnect();
      const testUser = await User.findOne({ email: testEmail }).select("firstName name").lean();
      const testName = testUser?.firstName || testUser?.name?.split(" ")[0] || "là";
      await resend.emails.send({
        from: FROM,
        to: testEmail,
        subject: "Quelque chose arrive sur Bookzy.",
        html: venusAnnouncementTemplate(testName),
      });
      return NextResponse.json({ success: true, message: `Email test envoyé à ${testEmail} (prénom: ${testName})` });
    }

    await dbConnect();

    let query = User.find({ email: { $exists: true, $ne: "" } })
      .select("email firstName lastName name")
      .lean();

    if (limit) query = query.limit(limit);
    const users = await query;

    if (dryRun) {
      const alreadySent = getSentEmails();
      const remaining = users.filter(u => !alreadySent.has(u.email));
      return NextResponse.json({
        success: true,
        dryRun: true,
        totalUsers: users.length,
        alreadySent: alreadySent.size,
        remaining: remaining.length,
        sample: remaining.slice(0, 3).map((u) => ({ email: u.email, name: u.firstName || u.name })),
      });
    }

    const alreadySent = getSentEmails();
    const toSend = users.filter(u => !alreadySent.has(u.email));

    let sent = 0;
    let errors = 0;

    for (const user of toSend) {
      try {
        const firstName = user.firstName || user.name?.split(" ")[0] || "là";
        await resend.emails.send({
          from: FROM,
          to: user.email,
          subject: "Quelque chose arrive sur Bookzy.",
          html: venusAnnouncementTemplate(firstName),
        });
        alreadySent.add(user.email);
        sent++;
        // Sauvegarde tous les 50 envois
        if (sent % 50 === 0) saveSentEmails(alreadySent);
        await new Promise((r) => setTimeout(r, 100));
      } catch (err) {
        console.error("Email error for", user.email, err.message);
        errors++;
      }
    }

    // Sauvegarde finale
    saveSentEmails(alreadySent);

    return NextResponse.json({
      success: true,
      sent,
      errors,
      skipped: users.length - toSend.length,
      total: users.length,
    });

  } catch (err) {
    console.error("send-venus-announcement error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}