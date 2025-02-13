import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("admin_token"); // Remove token cookie
  return Response.json({ message: "Logged out successfully" }, { status: 200 });
}
