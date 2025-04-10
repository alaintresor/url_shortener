import jwt from "jsonwebtoken";

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Keeping the original function for backward compatibility
export const generateToken = (id) => {
  return generateAccessToken(id);
};
