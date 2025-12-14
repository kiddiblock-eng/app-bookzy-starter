import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" }, // HTML
    cover: { type: String, default: "" },

    // SEO
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);