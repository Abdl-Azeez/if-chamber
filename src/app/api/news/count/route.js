import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";

export async function GET() {
  await connectToDatabase();
  const count = await News.countDocuments();
  return Response.json({ count }, { status: 200 });
} 