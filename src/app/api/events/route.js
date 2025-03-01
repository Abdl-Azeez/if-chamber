import { authenticateToken } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

// 🔹 Fetch events with pagination
export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    // Fetch a single event by ID
    try {
      const event = await Event.findById(id);
      if (!event) {
        return Response.json({ message: "Event not found" }, { status: 404 });
      }
      return Response.json({ event }, { status: 200 });
    } catch (error) {
      return Response.json({ message: "Invalid event ID" }, { status: 400 });
    }
  } else {
    // Fetch multiple events with pagination
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    const events = await Event.find({})
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);
    const total = await Event.countDocuments();

    return Response.json({ events, total, page, limit }, { status: 200 });
  }
}

// 🔹 Create a new event
export async function POST(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const {
    title,
    description,
    date,
    image,
    theme,
    season,
    visible = true,
  } = await req.json();

  if (!title || !description || !date || !image) {
    return Response.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const newEvent = new Event({
    title,
    description,
    date,
    image,
    theme: theme || null,
    season: season || null,
    visible,
  });
  await newEvent.save();

  return Response.json(
    { message: "Event created successfully", newEvent },
    { status: 201 }
  );
}

// 🔹 Update an event by ID
export async function PUT(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const { id, ...updateData } = await req.json();

  if (!id) {
    return Response.json({ message: "Event ID is required" }, { status: 400 });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...updateData,
        theme: updateData.theme || null, // Ensure optional fields are handled properly
        season: updateData.season || null, // Ensure optional fields are handled properly
      },
      { new: true }
    );

    if (!updatedEvent) {
      return Response.json({ message: "Event not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Event updated successfully", updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: "Invalid event ID" }, { status: 400 });
  }
}

// 🔹 Delete an event by ID
export async function DELETE(req) {
  const auth = authenticateToken(req);
  if (auth.error)
    return Response.json({ message: auth.error }, { status: 401 });

  await connectToDatabase();
  const { id } = await req.json();
  if (!id) {
    return Response.json({ message: "Event ID is required" }, { status: 400 });
  }

  await Event.findByIdAndDelete(id);
  return Response.json(
    { message: "Event deleted successfully" },
    { status: 200 }
  );
}
