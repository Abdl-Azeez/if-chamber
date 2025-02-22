import { connectToDatabase } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import { NextResponse } from "next/server";

// Fetch logos
export async function GET() {
  await connectToDatabase();
  const logos = await Logo.find();
  return NextResponse.json(logos);
}

// Upload or update a logo
export async function POST(req) {
  await connectToDatabase();
  const { image, type } = await req.json();

  if (!["dashboard", "site"].includes(type)) {
    return NextResponse.json(
      { message: "Invalid logo type." },
      { status: 400 }
    );
  }

  const existingLogo = await Logo.findOne({ type });
  if (existingLogo) {
    return NextResponse.json(
      { message: "Logo already exists. Update instead." },
      { status: 400 }
    );
  }

  const newLogo = await Logo.create({ image, type });
  return NextResponse.json(newLogo);
}

// Update a logo
export async function PUT(req) {
  await connectToDatabase();
  const { image, type } = await req.json();

  if (!["dashboard", "site"].includes(type)) {
    return NextResponse.json(
      { message: "Invalid logo type." },
      { status: 400 }
    );
  }

  const updatedLogo = await Logo.findOneAndUpdate(
    { type },
    { image },
    { new: true }
  );
  return NextResponse.json(updatedLogo || {});
}

// Delete a logo
export async function DELETE(req) {
  await connectToDatabase();
  const { type } = await req.json();

  if (!["dashboard", "site"].includes(type)) {
    return NextResponse.json(
      { message: "Invalid logo type." },
      { status: 400 }
    );
  }

  await Logo.deleteOne({ type });
  return NextResponse.json({ message: "Logo deleted successfully" });
}
