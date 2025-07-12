import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import About from "@/models/About";

export async function GET() {
  await connectToDatabase();
  const about = await About.findOne();
  if (!about) {
    return Response.json({});
  }
  return Response.json({
    hero: about.hero || {},
    mission: about.mission || "",
    vision: about.vision || "",
    story: about.story || {},
    team: about.team || [],
    description: about.description || "",
    updatedAt: about.updatedAt,
  });
}

export async function POST(req) {
  await connectToDatabase();
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  const { hero, mission, vision, story, team, description } = await req.json();
  let about = await About.findOne();
  if (about) {
    if (hero) about.hero = hero;
    if (mission !== undefined) about.mission = mission;
    if (vision !== undefined) about.vision = vision;
    if (story) about.story = story;
    if (team) about.team = team;
    if (description !== undefined) about.description = description;
    about.updatedAt = new Date();
    await about.save();
  } else {
    about = new About({ hero, mission, vision, story, team, description });
    await about.save();
  }
  return Response.json({ message: "About page updated!", about });
} 