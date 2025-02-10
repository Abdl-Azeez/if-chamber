import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    console.log("🔍 Raw Password:", password);

    // Hash password properly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("🔑 Hashed Password:", hashedPassword);

    // Save admin
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Admin created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("🚨 Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
