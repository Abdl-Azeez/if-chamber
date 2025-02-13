import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Trending from "@/models/Trending";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const trending = await Trending.find({});
    return res.json(trending);
  }

  // Protect these routes
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const trending = await Trending.create(JSON.parse(req.body));
    return res.json(trending);
  }

  if (req.method === "DELETE") {
    const { id } = JSON.parse(req.body);
    await Trending.findByIdAndDelete(id);
    return res.json({ message: "Deleted" });
  }

  res.status(405).end();
}
