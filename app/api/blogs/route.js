import Blog from "../../../models/Blog";
import { dbConnect } from "../../../lib/db";

export async function GET() {
  await dbConnect();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return Response.json({ success: true, blogs });
}