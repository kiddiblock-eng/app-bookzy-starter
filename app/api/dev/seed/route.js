export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

import User from "@/models/User";
import Ebook from "@/models/Ebook";
import Transaction from "@/models/Transaction";
import UserActivity from "@/models/UserActivity";

const SEED_FLAG = { seed: true }; // pour nettoyer facilement

export async function GET(req) {
  try {
    // ░░ SECURITÉ ░░
    const headerSecret = req.headers.get("x-admin-secret");
    if (!headerSecret || headerSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Seed désactivé en production" },
        { status: 403 }
      );
    }

    await dbConnect();

    // ░░ SUPPRESSION DES ANCIENS SEED ░░
    await Promise.all([
      User.deleteMany(SEED_FLAG),
      Ebook.deleteMany(SEED_FLAG),
      Transaction.deleteMany(SEED_FLAG),
      UserActivity.deleteMany(SEED_FLAG),
    ]);

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const countries = ["Bénin", "Côte d'Ivoire", "Sénégal", "Cameroun", "Ghana"];

    const seededUsers = [];
    const seededEbooks = [];
    const seededTransactions = [];

    // ░░ 1) CREATION DES UTILISATEURS (40 users) ░░
    for (let i = 0; i < 40; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now.getTime() - daysAgo * oneDay);

      const firstName = `User${i + 1}`;
      const lastName = "Test";

      const user = await User.create({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`, // FIX 🔥 modèle User
        email: `user${i + 1}@bookzy.dev`,
        password: "seed-password-fake",
        country: countries[i % countries.length],
        lang: "fr",
        createdAt,
        updatedAt: createdAt,
        ebooksCreated: 0, // sera mis à jour
        ...SEED_FLAG,
      });

      seededUsers.push(user);
    }

    // ░░ 2) CREATION DES EBOOKS ░░
    for (const user of seededUsers) {
      const ebookCount = Math.floor(Math.random() * 4); // 0 à 3 eBooks

      for (let i = 0; i < ebookCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now.getTime() - daysAgo * oneDay);

        const ebook = await Ebook.create({
          userId: user._id,
          title: `Ebook ${i + 1} - ${user.firstName}`,
          pages: 20 + Math.floor(Math.random() * 180),
          createdAt,
          updatedAt: createdAt,
          ...SEED_FLAG,
        });

        seededEbooks.push(ebook);
      }

      // 🔥 FIX : mettre à jour ebooksCreated dans User
      await User.findByIdAndUpdate(user._id, {
        ebooksCreated: ebookCount,
      });
    }

    // ░░ 3) CREATION DES TRANSACTIONS ░░
    const txCount = 25;
    for (let i = 0; i < txCount; i++) {
      const user = seededUsers[Math.floor(Math.random() * seededUsers.length)];

      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now.getTime() - daysAgo * oneDay);

      const amount = 2000 + Math.floor(Math.random() * 9000);

      const tx = await Transaction.create({
        userId: user._id,
        transactionId: `TX-${Date.now()}-${i}`,
        amount,
        currency: "XOF",
        status: "success",
        country: user.country,
        createdAt,
        updatedAt: createdAt,
        ...SEED_FLAG,
      });

      seededTransactions.push(tx);
    }

    // ░░ 4) USERS ACTIFS (simulateur "actifs maintenant") ░░
    const activeUsers = seededUsers.slice(0, 12);

    for (const user of activeUsers) {
      const minutesAgo = Math.floor(Math.random() * 60);
      const lastSeen = new Date(Date.now() - minutesAgo * 60 * 1000);

      await UserActivity.create({
        userId: user._id,
        lastSeen,
        ip: "127.0.0.1",
        userAgent: "Seed-Agent",
        path: "/",
        ...SEED_FLAG,
      });

      // 🔥 FIX : mettre à jour lastLogin pour analytics
      await User.findByIdAndUpdate(user._id, {
        lastLogin: lastSeen,
      });
    }

    return NextResponse.json({
      success: true,
      message: "SEED OK ✔️",
      details: {
        users: seededUsers.length,
        ebooks: seededEbooks.length,
        transactions: seededTransactions.length,
        activeUsers: activeUsers.length,
      },
    });
  } catch (err) {
    console.error("❌ Erreur seed :", err);
    return NextResponse.json(
      { success: false, message: "Erreur seed", error: String(err) },
      { status: 500 }
    );
  }
}