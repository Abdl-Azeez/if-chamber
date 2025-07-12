import { connectToDatabase } from "@/lib/mongodb";
import Hero from "@/models/Hero";

export async function GET() {
  await connectToDatabase();
  const count = await Hero.countDocuments();
  return Response.json({ count }, { status: 200 });
} 