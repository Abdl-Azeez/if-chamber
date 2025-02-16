import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET() {
  await connectToDatabase();

  const count = await Event.countDocuments();

  return Response.json({ count }, { status: 200 });
}
