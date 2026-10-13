const Member = require("../models/Member");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "msd_secret_key_1947_unity_of_peoples";
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "adminmsd1947";

// Local MongoDB sync backup file path
const DATA_FILE_PATH = path.join(__dirname, "../data/members_mongodb_data.json");

// Helper to write all MongoDB members into local JSON backup file
const syncToLocalBackupFile = async () => {
  try {
    const allMembers = await Member.find({}).sort({ createdAt: -1 });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(allMembers, null, 2), "utf8");
    console.log(`📁 MongoDB data synced to local file: ${DATA_FILE_PATH} (${allMembers.length} records)`);
  } catch (err) {
    console.error("Warning: Failed to sync MongoDB data to file:", err.message);
  }
};

// Initial sync on module load
setTimeout(() => {
  syncToLocalBackupFile().catch(() => {});
}, 3000);

// State Code Mapping Helper
const getStateCode = (stateName) => {
  if (!stateName) return "IN";
  const map = {
    Karnataka: "KA",
    "Tamil Nadu": "TN",
    Telangana: "TS",
    "Andhra Pradesh": "AP",
    Jharkhand: "JH",
    Maharashtra: "MH",
    Kerala: "KL",
    Delhi: "DL",
    "Uttar Pradesh": "UP",
    Bihar: "BR",
    Gujarat: "GJ",
    Rajasthan: "RJ",
    Punjab: "PB",
    Haryana: "HR",
    Odisha: "OD",
    "West Bengal": "WB",
    Assam: "AS",
  };
  return map[stateName] || stateName.slice(0, 2).toUpperCase();
};

// Generate Unique Registration ID (India / National Level Cadre)
const generateRegId = async () => {
  const year = new Date().getFullYear();
  // Find highest serial currently in MSD-IND-YYYY-XXXX
  const latestMember = await Member.findOne({
    registrationId: { $regex: new RegExp(`^MSD-IND-${year}-`, "i") },
  }).sort({ registrationId: -1 });

  let nextNum = 1;
  if (latestMember && latestMember.registrationId) {
    const parts = latestMember.registrationId.split("-");
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  } else {
    const totalCount = await Member.countDocuments({});
    nextNum = totalCount + 1;
  }

  const serial = String(nextNum).padStart(4, "0");
  return `MSD-IND-${year}-${serial}`;
};

// ─── 1. Public Member Registration ──────────────────────────────────────────
const registerMember = async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      dob,
      gender,
      mobile,
      whatsapp,
      email,
      bloodGroup,
      state,
      district,
      taluk,
      address,
      pincode,
      qualification,
      profession,
      wing,
      hoursAvailable,
      idProofType,
      idProofNumber,
      pledgeAccepted,
    } = req.body;

    if (!fullName || !fatherName || !dob || !gender || !mobile || !state || !district || !address || !pincode || !wing) {
      return res.status(400).json({ error: "Please fill in all mandatory fields." });
    }

    let photoUrl = "";
    let photoPublicId = "";

    // Upload photo to Cloudinary if provided
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadRes = await cloudinary.uploader.upload(base64, {
        folder: "msd/members",
        resource_type: "image",
      });
      photoUrl = uploadRes.secure_url;
      photoPublicId = uploadRes.public_id;
    }

    const registrationId = await generateRegId();

    const newMember = new Member({
      registrationId,
      fullName,
      fatherName,
      dob,
      gender,
      mobile,
      whatsapp: whatsapp || mobile,
      email: email || "",
      bloodGroup: bloodGroup || "Not Specified",
      photoUrl,
      photoPublicId,
      state,
      district,
      taluk: taluk || "",
      address,
      pincode,
      qualification: qualification || "",
      profession: profession || "",
      wing,
      hoursAvailable: hoursAvailable || "5-10 hours/month",
      idProofType: idProofType || "Aadhaar Card",
      idProofNumber: idProofNumber || "",
      pledgeAccepted: pledgeAccepted === "true" || pledgeAccepted === true,
      status: "PENDING",
    });

    const saved = await newMember.save();

    // Sync to file
    await syncToLocalBackupFile();

    res.status(201).json({
      success: true,
      message: "Registration successful! Awaiting verification.",
      member: saved,
    });
  } catch (error) {
    console.error("Member Registration Error:", error);
    res.status(500).json({ error: error.message || "Failed to register member." });
  }
};

// ─── 2. Get All Members (Admin with Filters & Search) ─────────────────────────
const getAllMembers = async (req, res) => {
  try {
    const { search, state, wing, status, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    }
    if (state && state !== "ALL") {
      query.state = state;
    }
    if (wing && wing !== "ALL") {
      query.wing = wing;
    }
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { fullName: regex },
        { mobile: regex },
        { registrationId: regex },
        { district: regex },
        { email: regex },
      ];
    }

    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalCount = await Member.countDocuments(query);

    // Compute Overall Statistics for KPI cards
    const totalAll = await Member.countDocuments();
    const totalPending = await Member.countDocuments({ status: "PENDING" });
    const totalApproved = await Member.countDocuments({ status: "APPROVED" });
    const totalRejected = await Member.countDocuments({ status: "REJECTED" });

    // Wing Breakdown
    const wingBreakdown = await Member.aggregate([
      { $group: { _id: "$wing", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: members,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
      },
      stats: {
        total: totalAll,
        pending: totalPending,
        approved: totalApproved,
        rejected: totalRejected,
        wingBreakdown,
      },
    });
  } catch (error) {
    console.error("Get All Members Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch members." });
  }
};

// ─── 3. Update Member Status (Approve / Reject / Pending) ─────────────────────
const updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value. Must be PENDING, APPROVED, or REJECTED." });
    }

    const updateFields = { status };
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;
    if (status === "APPROVED") {
      updateFields.approvedAt = new Date();
    } else {
      updateFields.approvedAt = null;
    }

    const updated = await Member.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Member not found." });
    }

    // Update local backup file
    await syncToLocalBackupFile();

    res.json({
      success: true,
      message: `Member status updated to ${status}.`,
      member: updated,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: error.message || "Failed to update member." });
  }
};

// ─── 4. Delete Member ────────────────────────────────────────────────────────
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }

    // Delete photo from Cloudinary if stored
    if (member.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(member.photoPublicId);
      } catch (err) {
        console.warn("Cloudinary delete warning:", err.message);
      }
    }

    await Member.findByIdAndDelete(id);

    // Sync to file
    await syncToLocalBackupFile();

    res.json({ success: true, message: "Member record deleted successfully." });
  } catch (error) {
    console.error("Delete Member Error:", error);
    res.status(500).json({ error: error.message || "Failed to delete member." });
  }
};

// ─── 5. Download MongoDB Data File ───────────────────────────────────────────
const exportMembersJson = async (req, res) => {
  try {
    const allMembers = await Member.find({}).sort({ createdAt: -1 });
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="msd_members_mongodb_backup_${Date.now()}.json"`
    );
    res.send(JSON.stringify(allMembers, null, 2));
  } catch (error) {
    console.error("Export JSON Error:", error);
    res.status(500).json({ error: "Failed to export data." });
  }
};

// ─── 6. Admin Authentication (Login & Check) ─────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign(
        { username: ADMIN_USER, role: "admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        token,
        admin: { username: ADMIN_USER },
      });
    }

    return res.status(401).json({ error: "Invalid username or password." });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ error: "Authentication failed." });
  }
};

const verifyAdminToken = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// ─── 7. Public Status Verification (By Registration ID or Mobile) ─────────────
const checkMemberStatus = async (req, res) => {
  try {
    const rawQuery = (req.query.query || "").trim();
    if (!rawQuery) {
      return res.status(400).json({ error: "Please enter your Registration ID or 10-digit Mobile Number." });
    }

    const member = await Member.findOne({
      $or: [
        { registrationId: { $regex: new RegExp(`^${rawQuery}$`, "i") } },
        { mobile: rawQuery },
      ],
    });

    if (!member) {
      return res.status(404).json({
        error: "No member application found matching this ID or Mobile Number. Please verify your details.",
      });
    }

    return res.json({
      success: true,
      member: {
        _id: member._id,
        registrationId: member.registrationId,
        fullName: member.fullName,
        fatherName: member.fatherName,
        mobile: member.mobile,
        bloodGroup: member.bloodGroup,
        photoUrl: member.photoUrl,
        state: member.state,
        district: member.district,
        wing: member.wing,
        profession: member.profession,
        status: member.status,
        createdAt: member.createdAt,
        approvedAt: member.approvedAt,
      },
    });
  } catch (error) {
    console.error("Status Check Error:", error);
    res.status(500).json({ error: "Failed to query member status." });
  }
};

// ─── 8. Safe Image Proxy for PVC Card Generation (Zero CORS issues) ───────────
const https = require("https");
const http = require("http");

const proxyPhoto = (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send("No image URL provided");
  }

  try {
    const client = imageUrl.startsWith("https") ? https : http;
    client
      .get(imageUrl, (upstreamRes) => {
        if (upstreamRes.statusCode !== 200) {
          return res.status(upstreamRes.statusCode).send("Failed to load upstream photo");
        }
        res.setHeader("Content-Type", upstreamRes.headers["content-type"] || "image/jpeg");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=86400");
        upstreamRes.pipe(res);
      })
      .on("error", (err) => {
        console.error("Proxy Photo Error:", err.message);
        res.status(500).send("Proxy error: " + err.message);
      });
  } catch (err) {
    console.error("Proxy Photo Exception:", err.message);
    res.status(500).send("Internal server error");
  }
};

// ─── 9. Card Seal & Signature Settings ─────────────────────────────────────
const CARD_SETTINGS_FILE = path.join(__dirname, "../data/card_settings.json");

const getCardSettings = async (req, res) => {
  try {
    if (fs.existsSync(CARD_SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(CARD_SETTINGS_FILE, "utf8"));
      return res.json({ success: true, settings: data });
    }
    const defaultSettings = {
      customSealUrl: "",
      customSignatureUrl: "",
      signatoryName: "Authorized Signatory",
      signatoryTitle: "Central Executive Committee",
    };
    fs.writeFileSync(CARD_SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf8");
    return res.json({ success: true, settings: defaultSettings });
  } catch (err) {
    console.error("Get Card Settings Error:", err);
    res.status(500).json({ error: "Failed to load card settings." });
  }
};

const updateCardSettings = async (req, res) => {
  try {
    const { customSealUrl, customSignatureUrl, signatoryName, signatoryTitle } = req.body;
    let currentSettings = {
      customSealUrl: "",
      customSignatureUrl: "",
      signatoryName: "Authorized Signatory",
      signatoryTitle: "Central Executive Committee",
    };
    if (fs.existsSync(CARD_SETTINGS_FILE)) {
      try {
        currentSettings = JSON.parse(fs.readFileSync(CARD_SETTINGS_FILE, "utf8"));
      } catch (e) {}
    }

    const updated = {
      customSealUrl: customSealUrl !== undefined ? customSealUrl : currentSettings.customSealUrl,
      customSignatureUrl: customSignatureUrl !== undefined ? customSignatureUrl : currentSettings.customSignatureUrl,
      signatoryName: signatoryName !== undefined ? signatoryName : currentSettings.signatoryName,
      signatoryTitle: signatoryTitle !== undefined ? signatoryTitle : currentSettings.signatoryTitle,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(CARD_SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf8");
    return res.json({
      success: true,
      settings: updated,
      message: "Card seal and signature settings updated successfully.",
    });
  } catch (err) {
    console.error("Update Card Settings Error:", err);
    res.status(500).json({ error: "Failed to save card settings." });
  }
};

module.exports = {
  registerMember,
  getAllMembers,
  updateMemberStatus,
  deleteMember,
  exportMembersJson,
  adminLogin,
  verifyAdminToken,
  checkMemberStatus,
  proxyPhoto,
  getCardSettings,
  updateCardSettings,
};



