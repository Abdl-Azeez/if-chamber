import { connectToDB } from "@/lib/mongodb";
import Event from "@/models/Event";

export async function PATCH(req) {
  await connectToDB();
  const { id } = await req.json();
  const event = await Event.findById(id);
  event.visible = !event.visible;
  await event.save();
  return Response.json({ message: "Visibility updated" });
}
