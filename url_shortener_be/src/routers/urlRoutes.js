import express from "express";
import UrlController from "../controllers/urlController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.get("/statistics", protect, UrlController.getStatistics);
router.post("/", protect, UrlController.createShortUrl);
router.get("/:short_code", UrlController.getUrlByShortCode);
router.get("/", protect, UrlController.getUserUrls);
router.put("/:id", protect, UrlController.updateUrl);
router.delete("/:id", protect, UrlController.deleteUrl);

export default router;
