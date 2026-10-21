const mongoose = require("mongoose");
const Member = require("../models/Member");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

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

// Initial sync on module load (skip in test environments)
const isTestEnv =
  process.env.NODE_ENV === "test" ||
  Boolean(process.env.NODE_TEST_CONTEXT) ||
  process.argv.some((arg) => arg.includes("test")) ||
  Boolean(process.env.VITEST);

if (!isTestEnv) {
  setTimeout(() => {
    syncToLocalBackupFile().catch(() => {});
  }, 3000);
}

// State Code Mapping Helper (All 28 States & 8 Union Territories)
const getStateCode = (stateName) => {
  if (!stateName) return "IN";
  const map = {
    "Andaman and Nicobar Islands": "AN",
    "Andhra Pradesh": "AP",
    "Arunachal Pradesh": "AR",
    Assam: "AS",
    Bihar: "BR",
    Chandigarh: "CH",
    Chhattisgarh: "CG",
    "Dadra and Nagar Haveli and Daman and Diu": "DD",
    Delhi: "DL",
    Goa: "GA",
    Gujarat: "GJ",
    Haryana: "HR",
    "Himachal Pradesh": "HP",
    "Jammu and Kashmir": "JK",
    Jharkhand: "JH",
    Karnataka: "KA",
    Kerala: "KL",
    Ladakh: "LA",
    Lakshadweep: "LD",
    "Madhya Pradesh": "MP",
    Maharashtra: "MH",
    Manipur: "MN",
    Meghalaya: "ML",
    Mizoram: "MZ",
    Nagaland: "NL",
    Odisha: "OD",
    Puducherry: "PY",
    Punjab: "PB",
    Rajasthan: "RJ",
    Sikkim: "SK",
    "Tamil Nadu": "TN",
    Telangana: "TS",
    Tripura: "TR",
    "Uttar Pradesh": "UP",
    Uttarakhand: "UK",
    "West Bengal": "WB",
  };
  return map[stateName] || stateName.slice(0, 2).toUpperCase();
};

// Helper: Convert string to clean Title Case for official identity documents
const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  const cleaned = str.trim().replace(/\s+/g, " ");
  // If the string was submitted in all uppercase (e.g. "DEEPU KUMAR"), convert to lower then capitalize
  const base = cleaned === cleaned.toUpperCase() ? cleaned.toLowerCase() : cleaned;
  return base.replace(/(?:^|\s|[-/.,'#])([a-z\u00C0-\u024F])/g, (char) => char.toUpperCase());
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

// ─── Registration Validation Helpers & Enums ────────────────────────────────
const VALID_WINGS = [
  "Legal Wing",
  "Medical & Health Wing",
  "Education & Child Welfare",
  "Youth & Sports Wing",
  "Community Seva & Mahaprasadam",
  "General Seva Cadre",
];

const VALID_GENDERS = ["Male", "Female", "Other"];

const VALID_BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Not Specified", ""
];

const calculateAgeFromDob = (dobStr) => {
  if (!dobStr) return null;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const validateRegistrationData = (body, file) => {
  const errors = {};

  const fullName = (body.fullName || "").trim();
  const fatherName = (body.fatherName || "").trim();
  const dob = (body.dob || "").trim();
  const gender = (body.gender || "").trim();
  const mobile = (body.mobile || "").trim();
  const whatsapp = (body.whatsapp || "").trim();
  const email = (body.email || "").trim();
  const bloodGroup = (body.bloodGroup || "").trim();
  const state = (body.state || "").trim();
  const district = (body.district || "").trim();
  const address = (body.address || "").trim();
  const pincode = (body.pincode || "").trim();
  const wing = (body.wing || "").trim();
  const pledgeAccepted = body.pledgeAccepted === true || body.pledgeAccepted === "true";

  // Full Name
  if (!fullName) {
    errors.fullName = "Full Name is required.";
  } else if (fullName.length < 3) {
    errors.fullName = "Full Name must be at least 3 characters long.";
  } else if (!/^[a-zA-Z\s.']{3,70}$/.test(fullName)) {
    errors.fullName = "Full Name should contain only letters, dots, and spaces.";
  }

  // Father's / Husband's Name
  if (!fatherName) {
    errors.fatherName = "Father's / Husband's Name is required.";
  } else if (fatherName.length < 3) {
    errors.fatherName = "Father's / Husband's Name must be at least 3 characters long.";
  } else if (!/^[a-zA-Z\s.']{3,70}$/.test(fatherName)) {
    errors.fatherName = "Father's / Husband's Name should contain only letters, dots, and spaces.";
  }

  // Date of Birth & Age Eligibility
  if (!dob) {
    errors.dob = "Date of Birth is required.";
  } else {
    const age = calculateAgeFromDob(dob);
    if (age === null) {
      errors.dob = "Please enter a valid Date of Birth (YYYY-MM-DD).";
    } else if (new Date(dob) > new Date()) {
      errors.dob = "Date of Birth cannot be in the future.";
    } else if (age < 12) {
      errors.dob = "Cadre member must be at least 12 years of age to register.";
    } else if (age > 115) {
      errors.dob = "Please enter a realistic Date of Birth.";
    }
  }

  // Gender
  if (!gender || !VALID_GENDERS.includes(gender)) {
    errors.gender = "Please select a valid Gender (Male, Female, or Other).";
  }

  // Primary Mobile (10 digits starting with 6, 7, 8, 9)
  if (!mobile) {
    errors.mobile = "Primary Mobile Number is required.";
  } else if (!/^[6-9]\d{9}$/.test(mobile)) {
    errors.mobile = "Mobile Number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.";
  }

  // WhatsApp (optional, but validated if provided)
  if (whatsapp && !/^[6-9]\d{9}$/.test(whatsapp)) {
    errors.whatsapp = "WhatsApp Number must be a valid 10-digit number.";
  }

  // Email (optional, but validated if provided)
  if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Blood Group
  if (bloodGroup && !VALID_BLOOD_GROUPS.includes(bloodGroup)) {
    errors.bloodGroup = "Invalid Blood Group option selected.";
  }

  // State
  if (!state) {
    errors.state = "State / Union Territory is required.";
  }

  // District
  if (!district) {
    errors.district = "District is required.";
  } else if (district.length < 2) {
    errors.district = "District name must be at least 2 characters.";
  }

  // Residential Address
  if (!address) {
    errors.address = "Residential Address is required.";
  } else if (address.length < 8) {
    errors.address = "Please provide complete address (at least 8 characters).";
  }

  // Postal PIN Code (6 digits starting with 1-9)
  if (!pincode) {
    errors.pincode = "Postal PIN Code is required.";
  } else if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    errors.pincode = "PIN Code must be a valid 6-digit Indian postal code.";
  }

  // Primary Cadre Wing
  if (!wing || !VALID_WINGS.includes(wing)) {
    errors.wing = `Please choose a valid MSD Wing (${VALID_WINGS.join(", ")}).`;
  }

  // Seva Pledge
  if (!pledgeAccepted) {
    errors.pledgeAccepted = "You must accept the Maha Seva Dal 1947 Seva Pledge to complete registration.";
  }

  // Photo Validation (MANDATORY)
  if (!file) {
    errors.photo = "Passport size photograph is mandatory for cadre registration.";
  } else {
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimes.includes(file.mimetype)) {
      errors.photo = "Photograph must be a valid JPG, PNG, or WEBP image.";
    } else if (file.size > 5 * 1024 * 1024) {
      errors.photo = "Photograph file size must not exceed 5 MB.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError: Object.values(errors)[0] || null,
  };
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

    // Run Server-side Data Validation
    const validation = validateRegistrationData(req.body, req.file);
    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.firstError,
        errors: validation.errors,
      });
    }

    // Check for existing active registration with the same mobile
    const cleanMobile = mobile.trim();
    const existingMember = await Member.findOne({
      mobile: cleanMobile,
      status: { $in: ["PENDING", "APPROVED"] },
    });
    if (existingMember) {
      return res.status(409).json({
        error: "This mobile number is already registered",
        existingRegistrationId: existingMember.registrationId,
        status: existingMember.status,
      });
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

    // Sanitize names and administrative text to official Title Case
    const sanitizedFullName = toTitleCase(fullName);
    const sanitizedFatherName = toTitleCase(fatherName);
    const sanitizedDistrict = toTitleCase(district);
    const sanitizedTaluk = taluk ? toTitleCase(taluk) : "";
    const sanitizedProfession = profession ? toTitleCase(profession) : "";
    const sanitizedAddress = toTitleCase(address);
    const finalAge = calculateAgeFromDob(dob);

    const newMember = new Member({
      registrationId,
      fullName: sanitizedFullName,
      fatherName: sanitizedFatherName,
      dob,
      age: finalAge,
      gender,
      mobile,
      whatsapp: whatsapp || mobile,
      email: email || "",
      bloodGroup: bloodGroup || "Not Specified",
      photoUrl,
      photoPublicId,
      state,
      district: sanitizedDistrict,
      taluk: sanitizedTaluk,
      address: sanitizedAddress,
      pincode,
      qualification: qualification || "",
      profession: sanitizedProfession,
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
    const member = mongoose.isValidObjectId(id)
      ? await Member.findById(id)
      : await Member.findOne({ registrationId: id });
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

    await Member.findByIdAndDelete(member._id);

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
    const adminUser = process.env.ADMIN_USERNAME || ADMIN_USER;
    const adminPass = process.env.ADMIN_PASSWORD || ADMIN_PASS;
    const jwtSecret = process.env.JWT_SECRET || JWT_SECRET;

    if (!adminUser || !adminPass || !jwtSecret) {
      console.error("Admin credentials or JWT_SECRET are not configured in environment variables.");
      return res.status(500).json({ error: "Server authentication is not properly configured." });
    }

    if (username === adminUser && password === adminPass) {
      const token = jwt.sign(
        { username: adminUser, role: "admin" },
        jwtSecret,
        { expiresIn: "7d" }
      );
      return res.json({
        success: true,
        token,
        admin: { username: adminUser },
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

    // Normalize phone input if formatted with +91, leading 0, spaces, or hyphens
    let cleanPhone = rawQuery.replace(/[\s\-\(\)]/g, "");
    if (cleanPhone.startsWith("+91")) cleanPhone = cleanPhone.slice(3);
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
    if (cleanPhone.startsWith("0") && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

    const isDigitsOnly = /^\d+$/.test(cleanPhone);
    if (isDigitsOnly) {
      if (cleanPhone.length !== 10) {
        return res.status(400).json({
          error: `Mobile number must be exactly 10 digits. Received ${cleanPhone.length} digits.`,
        });
      }
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return res.status(400).json({
          error: "Must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.",
        });
      }
    }

    const safeRegexQuery = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let member = null;
    try {
      member = await Member.findOne({
        $or: [
          { registrationId: { $regex: new RegExp(`^${safeRegexQuery}$`, "i") } },
          { mobile: isDigitsOnly ? cleanPhone : rawQuery },
          { mobile: cleanPhone },
        ],
      });
    } catch (dbErr) {
      console.warn("MongoDB query failed, checking local backup JSON:", dbErr.message);
      if (fs.existsSync(DATA_FILE_PATH)) {
        try {
          const localList = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf8"));
          const searchVal = isDigitsOnly ? cleanPhone : rawQuery.toLowerCase();
          member = localList.find((m) => {
            const mReg = (m.registrationId || "").toLowerCase();
            const mMobile = (m.mobile || "").replace(/[\s\-\+]/g, "");
            return mReg === searchVal || mMobile === searchVal || mMobile.endsWith(searchVal);
          });
        } catch (fErr) {}
      }
    }

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
        dob: member.dob,
        age: member.age,
        gender: member.gender,
        mobile: member.mobile,
        whatsapp: member.whatsapp,
        email: member.email,
        bloodGroup: member.bloodGroup,
        photoUrl: member.photoUrl,
        state: member.state,
        district: member.district,
        taluk: member.taluk,
        address: member.address,
        pincode: member.pincode,
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
  getStateCode,
};



