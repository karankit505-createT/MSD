const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    // Personal Details
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    bloodGroup: { type: String, default: "Not Specified" },
    photoUrl: { type: String, default: "" },
    photoPublicId: { type: String, default: "" },

    // Location / Jurisdiction
    state: { type: String, required: true },
    district: { type: String, required: true },
    taluk: { type: String, default: "" },
    address: { type: String, required: true },
    pincode: { type: String, required: true },

    // Professional & Wing
    qualification: { type: String, default: "" },
    profession: { type: String, default: "" },
    wing: {
      type: String,
      required: true,
      enum: [
        "Legal Wing",
        "Medical & Health Wing",
        "Education & Child Welfare",
        "Youth & Sports Wing",
        "Community Seva & Mahaprasadam",
        "General Seva Cadre",
      ],
    },
    hoursAvailable: { type: String, default: "5-10 hours/month" },

    // ID Proof
    idProofType: { type: String, default: "Aadhaar Card" },
    idProofNumber: { type: String, default: "" },

    // Status & System
    pledgeAccepted: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    adminNotes: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);
