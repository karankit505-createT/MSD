const express = require("express");
const multer = require("multer");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

const router = express.Router();

// Multer — store file in memory (not disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// POST /api/upload  →  upload image to Cloudinary
router.post("/", upload.single("image"), uploadImage);

// DELETE /api/upload  →  delete image from Cloudinary
router.delete("/", deleteImage);

module.exports = router;
