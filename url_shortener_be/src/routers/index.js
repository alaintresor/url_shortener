import express from "express";
import docsRoutes from "../documentation/index.doc";
import authRoutes from "./authRoutes";
import urlRoutes from "./urlRoutes";

const router = express.Router();

router.use("/docs", docsRoutes);
router.use("/auth", authRoutes);
router.use("/urls", urlRoutes);

export default router;
