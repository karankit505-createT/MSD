const express = require("express");
const multer = require("multer");
const {
  registerMember,
  getAllMembers,
  updateMemberStatus,
  deleteMember,
  exportMembersJson,
  adminLogin,
  verifyAdminToken,
  checkMemberStatus,
  proxyPhoto,
} = require("../controllers/memberController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Multer memory storage for member photo uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB photo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG/PNG/WEBP) are allowed."), false);
    }
  },
});

// ─── Public Member Registration & Status Verification ───
router.post("/register", upload.single("photo"), registerMember);
router.get("/status", checkMemberStatus);
router.get("/proxy-photo", proxyPhoto);

// ─── Admin Auth ───
router.post("/admin/login", adminLogin);
router.get("/admin/verify", verifyToken, verifyAdminToken);

// ─── Admin Member Management (Protected) ───
router.get("/admin/all", verifyToken, getAllMembers);
router.get("/admin/export-json", verifyToken, exportMembersJson);
router.patch("/admin/:id/status", verifyToken, updateMemberStatus);
router.put("/admin/:id/status", verifyToken, updateMemberStatus);
router.delete("/admin/:id", verifyToken, deleteMember);

module.exports = router;
