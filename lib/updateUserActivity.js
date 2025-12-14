import User from "../models/User";
import { dbConnect } from "./db";

export async function updateUserActivity(userId) {
  try {
    await dbConnect();

    await User.findByIdAndUpdate(userId, {
      lastActiveAt: new Date()
    });
  } catch (error) {
    console.error("❌ Erreur updateUserActivity:", error);
  }
}