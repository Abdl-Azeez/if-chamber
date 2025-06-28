import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Resources from "@/models/Resources";

// 🔹 Get resources with pagination
export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (id) {
    const resourceItem = await Resources.findById(id);
    return Response.json({ resource: resourceItem }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
  
  const resources = await Resources.find().sort({ createdAt: -1 });
  return Response.json({ resources }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

// 🔹 Create a new resource
export async function POST(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const body = await req.json();
  const resource = new Resources(body);
  await resource.save();
  return Response.json({ message: "Resource added successfully!", resource });
}

// 🔹 Update a resource
export async function PUT(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const body = await req.json();
  const { id, ...updateData } = body;
  await Resources.findByIdAndUpdate(id, updateData);
  return Response.json({ message: "Resource updated successfully!" });
}

// 🔹 Delete a resource
export async function DELETE(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const body = await req.json();
  await Resources.findByIdAndDelete(body.id);
  return Response.json({ message: "Resource deleted successfully!" });
}
