import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Hero from "@/models/Hero";

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const heroItem = await Hero.findById(id);
    return Response.json({ hero: heroItem });
  }
  const heroes = await Hero.find().sort({ createdAt: -1 });
  return Response.json({ heroes });
}

export async function POST(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  const hero = new Hero(body);
  await hero.save();
  return Response.json({ message: "Hero section added successfully!", hero });
}

export async function PUT(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  const { id, ...updateData } = body;
  await Hero.findByIdAndUpdate(id, updateData);
  return Response.json({ message: "Hero section updated successfully!" });
}

export async function DELETE(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  await Hero.findByIdAndDelete(body.id);
  return Response.json({ message: "Hero section deleted successfully!" });
}
