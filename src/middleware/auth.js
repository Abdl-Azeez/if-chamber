import jwt from "jsonwebtoken";

export function authenticateToken(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return { error: "Access token required" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure `adminId` exists
    if (!decoded.adminId) {
      return { error: "Invalid token structure" };
    }

    return { adminId: decoded.adminId }; // 🔥 Correct field name
  } catch (error) {
    console.error("🚨 JWT Error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return { error: "Token expired. Please login again." };
    } else if (error.name === 'JsonWebTokenError') {
      return { error: "Invalid token. Please login again." };
    } else {
      return { error: "Authentication failed. Please login again." };
    }
  }
}
