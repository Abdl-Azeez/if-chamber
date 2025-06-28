import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import About from "@/models/About";

export async function GET() {
  await connectToDatabase();
  const about = await About.findOne();
  return Response.json({ description: about ? about.description : "" });
}

export async function POST(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const { description } = await req.json();
  let about = await About.findOne();
  if (about) {
    about.description = description;
    about.updatedAt = new Date();
    await about.save();
  } else {
    about = new About({ description });
    await about.save();
  }
  return Response.json({ message: "About description updated!", description: about.description });
} 