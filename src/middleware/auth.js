import jwt from "jsonwebtoken";

export function authenticateToken(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return { error: "Unauthorized: No token provided" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure `adminId` exists
    if (!decoded.adminId) {
      return { error: "Unauthorized: Invalid token structure" };
    }

    return { adminId: decoded.adminId }; // 🔥 Correct field name
  } catch (error) {
    console.error("🚨 JWT Error:", error);
    return { error: "Unauthorized: Invalid token" };
  }
}
