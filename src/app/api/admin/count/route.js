import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET() {
  await connectToDatabase();
  const count = await Admin.countDocuments();
  return Response.json({ count }, { status: 200 });
} 