import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { username, password } = await req.json();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ error: "Invalid username" }, { status: 401 });
    }

    console.log("🔍 Entered Password:", password);
    console.log("🔑 Stored Hashed Password:", admin.password);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("✅ bcrypt.compare Result:", isMatch);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("🚨 Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
