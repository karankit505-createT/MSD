const express = require("express");
const multer = require("multer");
const { uploadImage, deleteImage } = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Multer — store file in memory, max 5MB, strictly allowed image types
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP image files are allowed."), false);
    }
  },
});

const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message || "File upload failed" });
    }
    next();
  });
};

// POST /api/upload  →  upload image to Cloudinary (Protected)
router.post("/", verifyToken, handleUpload, uploadImage);

// DELETE /api/upload  →  delete image from Cloudinary (Protected)
router.delete("/", verifyToken, deleteImage);

module.exports = router;

