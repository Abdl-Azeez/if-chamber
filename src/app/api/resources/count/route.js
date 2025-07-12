import { connectToDatabase } from "@/lib/mongodb";
import Resources from "@/models/Resources";

export async function GET() {
  await connectToDatabase();
  const count = await Resources.countDocuments();
  return Response.json({ count }, { status: 200 });
} 