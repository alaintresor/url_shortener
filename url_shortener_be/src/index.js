import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routers";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configure CORS with proper options
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:3000' 
    : 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


// welcome message
app.get("/", (req, res) => {
  res.json({ message: "Welcome to URL Shortener APIs" });
});

app.use("/api/v1", router);


try {
  app.listen(port, () => {
    console.log(`server running on port ${port} `);
  });
} catch (error) {
  console.log(error);
}
