import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const events = await Event.find({});
    return res.json(events);
  }

  // Protect these routes
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const event = await Event.create(JSON.parse(req.body));
    return res.json(event);
  }

  if (req.method === "DELETE") {
    const { id } = JSON.parse(req.body);
    await Event.findByIdAndDelete(id);
    return res.json({ message: "Deleted" });
  }

  res.status(405).end();
}
