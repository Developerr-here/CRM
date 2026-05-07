import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Identify the User: Without it, the server knows a "valid token" was sent but doesn't know which user sent it (e.g., John vs. Sarah).
      req.user = await User.findById(decoded.userId).select("-password");
      
      // THE SAAS FILTER: Attach organization to the request
      req.org = req.user.organization; 
      
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};