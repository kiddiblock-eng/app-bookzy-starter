import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },      
  message: { type: String, required: true },   
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Admin analytics : comptages d'activité par plage de dates
activitySchema.index({ createdAt: 1 });

export default mongoose.models.Activity || mongoose.model("Activity", activitySchema);