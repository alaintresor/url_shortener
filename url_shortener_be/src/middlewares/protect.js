import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import db from "../database/models/index.js";
const User = db["User"];

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password", "refreshToken"] },
      });
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          status: "fail", 
          message: "Token expired",
          code: "TOKEN_EXPIRED" 
        });
      }
      return res.status(401).json({ 
        status: "fail", 
        message: "Not authorized" 
      });
    }
  } else if (!token) {
    return res.status(401).json({ 
      status: "fail", 
      message: "Not authorized, no token" 
    });
  }
});

