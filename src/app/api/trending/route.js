import { connectToDatabase } from "@/lib/mongodb";
import { authenticateToken } from "@/middleware/auth";
import Trending from "@/models/Trending";

export async function POST(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();

  const { title, description, image, position } = await req.json();

  const newTrending = new Trending({ title, description, image, position });
  await newTrending.save();

  return Response.json(
    { message: "Trending content added successfully" },
    { status: 201 }
  );
}
