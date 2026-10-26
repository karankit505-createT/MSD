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
    age: { type: Number },
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

    // Status & System
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    pledgeAccepted: { type: Boolean, default: true },
    adminNotes: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);
