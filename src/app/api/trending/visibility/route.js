import { connectToDB } from "@/lib/mongodb";
import Trending from "@/models/Trending";

export async function PATCH(req) {
  await connectToDB();
  const { id } = await req.json();
  const trending = await Trending.findById(id);
  trending.visible = !trending.visible;
  await trending.save();
  return Response.json({ message: "Visibility updated" });
}
