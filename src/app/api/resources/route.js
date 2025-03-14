import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Resource from "@/models/Resources";

// 🔹 Get resources with pagination
export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit")) || 10;
  const page = parseInt(searchParams.get("page")) || 1;
  const skip = (page - 1) * limit;

  const resources = await Resource.find({})
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Resource.countDocuments();

  return Response.json({ resources, total, page, limit });
}

// 🔹 Create a new resource
export async function POST(req) {
  const auth = authenticateToken(req);
  if (auth.error) return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();

  const body = await req.json();
  const {
    title,
    description,
    author,
    fileUrl,
    fileSize,
    fileType,
    category,
    source,
    thumbnail,
    thumbnailUrl,
    thumbnailType,
    hasThumbnail,
    visible
  } = body;

  // Validate required fields
  if (!title || !description || !fileUrl || !fileSize || !fileType) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
  }

  const newResource = new Resource({
    title,
    description,
    author,
    fileUrl,
    fileSize,
    fileType,
    category,
    source,
    thumbnail,
    thumbnailType: thumbnail ? thumbnailType : null,
    hasThumbnail: !!thumbnail,
    visible: visible ?? true, 
  });

  await newResource.save();

  return Response.json({ message: "Resource added successfully", newResource }, { status: 201 });
}


// 🔹 Update a resource
export async function PUT(req) {
  const auth = authenticateToken(req);
  if (auth.error) return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const { id, ...updateData } = await req.json();

  if (!id) return Response.json({ message: "Resource ID is required" }, { status: 400 });

  const updatedResource = await Resource.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );

  if (!updatedResource) return Response.json({ message: "Resource not found" }, { status: 404 });

  return Response.json({ message: "Resource updated successfully", updatedResource }, { status: 200 });
}

// 🔹 Delete a resource
export async function DELETE(req) {
  const auth = authenticateToken(req);
  if (auth.error) return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const { id } = await req.json();

  if (!id) return Response.json({ message: "Resource ID is required" }, { status: 400 });

  await Resource.findByIdAndDelete(id);

  return Response.json({ message: "Resource deleted successfully" }, { status: 200 });
}
