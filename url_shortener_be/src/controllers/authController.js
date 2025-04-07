import bcrypt from "bcryptjs"
import UserService from "../services/userService";
import { generateAccessToken, generateRefreshToken } from "../utils/JWT";
import jwt from "jsonwebtoken";

class AuthController {

  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || username === "") {
        return res
          .status(400)
          .json({ status: "fail", message: "username is required" });
      }
      if (!email || email === "") {
        return res
          .status(400)
          .json({ status: "fail", message: "email is required" });
      }
      if (!password || password === "") {
        return res
          .status(400)
          .json({ status: "fail", message: "password is required" });
      }

      const existingUser = await UserService.getUserByEmail(email);

      const salt = await bcrypt.genSalt(10);
      const password_hashed = await bcrypt.hash(password, salt);

      if (existingUser) {
        return res
          .status(400)
          .json({ status: "fail", message: "User already exists" });
      }

      // Generate refresh token
      const refreshToken = generateRefreshToken(email);

      const newUser = await UserService.createUser({
        username,
        email,
        password: password_hashed,
        refreshToken
      });

      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(201).json({
        status: "success",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
        accessToken: generateAccessToken(newUser.id),
      });
    } catch (error) {
      console.error("Error in register:", error);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || email === "") {
        return res
          .status(400)
          .json({ status: "fail", message: "email is required" });
      }
      if (!password || password === "") {
        return res
          .status(400)
          .json({ status: "fail", message: "password is required" });
      }

      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid email or password" });
      }

      // Generate refresh token
      const refreshToken = generateRefreshToken(user.id);
      
      // Update user's refresh token in database
      await UserService.updateRefreshToken(user.id, refreshToken);

      // Set cookie expiration based on rememberMe
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days if rememberMe, else 1 day
      };

      // Set refreshToken cookie
      res.cookie('refreshToken', refreshToken, cookieOptions);

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        accessToken: generateAccessToken(user.id),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error in login:", error);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
  }
  
  static async refreshToken(req, res) {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({ 
          status: "fail", 
          message: "Refresh token is required" 
        });
      }

      // Find user with matching refresh token
      const user = await UserService.getUserByRefreshToken(refreshToken);
      
      if (!user) {
        return res.status(403).json({ 
          status: "fail", 
          message: "Invalid refresh token" 
        });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ 
            status: "fail", 
            message: "Invalid refresh token" 
          });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user.id);
        
        return res.status(200).json({
          status: "success",
          accessToken
        });
      });
    } catch (error) {
      console.error("Error in refreshToken:", error);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
  }

  static async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(200).json({ 
          status: "success", 
          message: "Logged out successfully" 
        });
      }

      // Find user with this refresh token
      const user = await UserService.getUserByRefreshToken(refreshToken);
      
      if (user) {
        // Clear the refresh token in database
        await UserService.updateRefreshToken(user.id, null);
      }

      // Clear the cookie
      res.clearCookie('refreshToken');
      
      return res.status(200).json({ 
        status: "success", 
        message: "Logged out successfully" 
      });
    } catch (error) {
      console.error("Error in logout:", error);
      return res
        .status(500)
        .json({ status: "fail", message: "Internal server error" });
    }
  }
}

export default AuthController;
