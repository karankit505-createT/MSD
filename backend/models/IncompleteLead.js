const mongoose = require("mongoose");

const IncompleteLeadSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      default: "Volunteer Cadre",
      trim: true,
    },
    channel: {
      type: String,
      enum: ["web", "whatsapp"],
      default: "web",
    },
    lastStepCompleted: {
      type: String,
      default: "STEP_1_PROFILE",
    },
    lastStepLabel: {
      type: String,
      default: "Step 1: Personal Profile",
    },
    partialData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "ABANDONED", "RECOVERED"],
      default: "ABANDONED",
    },
    nudgeCount: {
      type: Number,
      default: 0,
    },
    lastNudgedAt: {
      type: Date,
      default: null,
    },
    abandonedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("IncompleteLead", IncompleteLeadSchema);

