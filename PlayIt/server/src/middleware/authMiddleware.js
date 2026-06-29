// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware: Protect private routes by verifying JWT authentication.
 * - Checks for a valid Bearer token in the Authorization header.
 * - Decodes token to get user ID.
 * - Fetches user data from DB and attaches it to req.user (excluding password).
 * - If no token or invalid token, returns 401 Unauthorized.
 */
const protect = async (req, res, next) => {
  let token;

  try {
    // Ensure Authorization header exists and starts with "Bearer"
    if (req.headers?.authorization?.startsWith("Bearer")) {
      // Extract the token string after "Bearer "
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret stored in .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data from DB using decoded user ID
      // Exclude password field for security
      req.user = await User.findById(decoded.id).select("-password");

      // If user not found (possibly deleted), block access
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Token is valid and user exists → continue to protected route
      return next();
    }

    // If header is missing or not "Bearer", reject request
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    // Handles invalid/expired token or decoding errors
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export default protect;
