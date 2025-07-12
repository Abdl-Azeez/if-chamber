import jwt from "jsonwebtoken";

export function authenticateToken(req) {
  // Try both lowercase and capitalized
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  // Debug log for troubleshooting
  if (process.env.NODE_ENV !== 'production') {
    console.log("[auth] Received headers:", Object.fromEntries(req.headers.entries()));
    console.log("[auth] Extracted token:", token);
  }

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
