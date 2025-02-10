import { connectToDatabase } from "@/lib/mongodb";
import { authenticateToken } from "@/middleware/auth";
import Trending from "@/models/Trending";
import Event from "@/models/Event";

export async function GET(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();

  const trendingCount = await Trending.countDocuments();
  const eventsCount = await Event.countDocuments();

  return Response.json({ trendingCount, eventsCount });
}
