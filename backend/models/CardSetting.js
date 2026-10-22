const mongoose = require("mongoose");

const cardSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    customSealUrl: { type: String, default: "" },
    customSignatureUrl: { type: String, default: "" },
    signatoryName: { type: String, default: "Authorized Signatory" },
    signatoryTitle: { type: String, default: "Central Executive Committee" },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CardSetting", cardSettingSchema);
