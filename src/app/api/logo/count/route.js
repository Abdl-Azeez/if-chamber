import { connectToDatabase } from "@/lib/mongodb";
import Logo from "@/models/Logo";

export async function GET() {
  await connectToDatabase();
  const count = await Logo.countDocuments();
  return Response.json({ count }, { status: 200 });
} 