import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

// 🔹 Fetch events with pagination
export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (id) {
    const eventItem = await Event.findById(id);
    return Response.json({ event: eventItem }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
  
  const events = await Event.find().sort({ createdAt: -1 });
  return Response.json({ events }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}

// 🔹 Create a new event
export async function POST(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const body = await req.json();
  const event = new Event(body);
  await event.save();
  return Response.json({ message: "Event added successfully!", event });
}

// 🔹 Update an event by ID
export async function PUT(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const body = await req.json();
  const { id, ...updateData } = body;
  await Event.findByIdAndUpdate(id, updateData);
  return Response.json({ message: "Event updated successfully!" });
}

// 🔹 Delete an event by ID
export async function DELETE(req) {
  await connectToDatabase();
  
  const auth = authenticateToken(req);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: 401 });
  }
  
  const body = await req.json();
  await Event.findByIdAndDelete(body.id);
  return Response.json({ message: "Event deleted successfully!" });
}
