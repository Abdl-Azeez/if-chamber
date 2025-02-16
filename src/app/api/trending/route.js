import { connectToDatabase } from "@/lib/mongodb";
import { authenticateToken } from "@/middleware/auth";
import Trending from "@/models/Trending";

export async function GET() {
  await connectToDatabase();
  const trendingItems = await Trending.find({});
  return Response.json(trendingItems, { status: 200 });
}

export async function POST(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();

  const existingCount = await Trending.countDocuments();
  if (existingCount >= 3) {
    return Response.json(
      { message: "Maximum of 3 trending items allowed." },
      { status: 400 }
    );
  }

  const { title, description, image, position } = await req.json();

  const newTrending = new Trending({ title, description, image, position });
  await newTrending.save();

  return Response.json(
    { message: "Trending content added successfully" },
    { status: 201 }
  );
}

export async function PUT(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const { id, ...updateData } = await req.json();

  if (!id) {
    return Response.json({ message: "Event ID is required" }, { status: 400 });
  }
  
  const updatedTrending = await Trending.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedTrending) {
    return Response.json(
      { message: "Trending item not found" },
      { status: 404 }
    );
  }

  return Response.json(
    { message: "Trending content updated successfully" },
    { status: 200 }
  );
}

export async function DELETE(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const { id } = await req.json();

  const deletedTrending = await Trending.findByIdAndDelete(id);
  if (!deletedTrending) {
    return Response.json(
      { message: "Trending item not found" },
      { status: 404 }
    );
  }

  return Response.json(
    { message: "Trending content deleted successfully" },
    { status: 200 }
  );
}
