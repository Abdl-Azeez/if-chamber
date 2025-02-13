import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
