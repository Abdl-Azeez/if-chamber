import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Hero from "@/models/Hero";

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (id) {
    const heroItem = await Hero.findById(id);
    return Response.json({ hero: heroItem }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
  
  const heroes = await Hero.find().sort({ createdAt: -1 });
  return Response.json({ heroes }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

export async function POST(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  const hero = new Hero(body);
  await hero.save();
  return Response.json({ message: "Hero section added successfully!", hero });
}

// export async function PUT(req) {
//   await connectToDatabase();
//   await authenticateToken(req);
//   const body = await req.json();
//   const { id, ...updateData } = body;
//   await Hero.findByIdAndUpdate(id, updateData);
//   return Response.json({ message: "Hero section updated successfully!" });
// }

export async function PUT(req) {
  await connectToDatabase();
  await authenticateToken(req);

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedHero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedHero) {
      return Response.json({ error: "Hero not found" }, { status: 404 });
    }

    return Response.json({
      message: "Hero section updated successfully!",
      hero: updatedHero,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  await connectToDatabase();
  await authenticateToken(req);
  const body = await req.json();
  await Hero.findByIdAndDelete(body.id);
  return Response.json({ message: "Hero section deleted successfully!" });
}
