import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import EmailJob from "../models/EmailJob.js";

await mongoose.connect(process.env.MONGODB_URI);

await EmailJob.create({
  userId: new mongoose.Types.ObjectId(),
  email: "roddyricardo6@gmail.com",
  firstName: "Roddy",
  type: "analyseur_relance",
  payload: {
    sujet: "Shopify : Le terrain de chasse des nouveaux riches africains",
    scoreGlobal: 78,
    verdict: "fonce",
  },
  sendAt: new Date(Date.now() - 1000),
  status: "pending",
});

console.log("✅ Job créé");
await mongoose.disconnect();