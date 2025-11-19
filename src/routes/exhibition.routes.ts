import { Router } from "express";
import multer from "multer";
import { exhibitionController } from "../controllers/exhibition.controller";

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Allow images and videos
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/webm",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  },
});

// POST /api/exhibitions - Create new exhibition
router.post(
  "/",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
    { name: "productVideo", maxCount: 1 },
  ]),
  (req, res, next) => exhibitionController.createExhibition(req, res, next),
);

// GET /api/exhibitions - Get all exhibitions
router.get("/", (req, res, next) =>
  exhibitionController.getAllExhibitions(req, res, next),
);

// GET /api/exhibitions/:id - Get exhibition by ID
router.get("/:id", (req, res, next) =>
  exhibitionController.getExhibitionById(req, res, next),
);

export default router;
