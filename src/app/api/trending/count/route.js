import { connectToDatabase } from "@/lib/mongodb";
import Trending from "@/models/Trending";

export async function GET() {
  await connectToDatabase();

  const count = await Trending.countDocuments();

  return Response.json({ count }, { status: 200 });
}
