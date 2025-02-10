import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

// 🔹 Fetch all events
export async function GET() {
  await connectToDatabase();
  const events = await Event.find({}).sort({ date: 1 });
  return Response.json(events);
}

// 🔹 Create a new event
export async function POST(req) {
  await connectToDatabase();

  const { title, description, date, location, image } = await req.json();

  if (!title || !description || !date || !location) {
    return Response.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const newEvent = new Event({ title, description, date, location, image });
  await newEvent.save();

  return Response.json(
    { message: "Event created successfully" },
    { status: 201 }
  );
}

// 🔹 Delete an event by ID
export async function DELETE(req) {
  await connectToDatabase();

  const { id } = await req.json();
  if (!id)
    return Response.json({ message: "Event ID is required" }, { status: 400 });

  await Event.findByIdAndDelete(id);
  return Response.json(
    { message: "Event deleted successfully" },
    { status: 200 }
  );
}
