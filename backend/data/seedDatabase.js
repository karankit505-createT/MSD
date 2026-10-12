/**
 * MongoDB Data Manager & Seeder for Maha Seva Dal (MSD)
 * Run: node backend/data/seedDatabase.js
 */
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Member = require("../models/Member");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/msd_database";
const BACKUP_FILE = path.join(__dirname, "members_mongodb_data.json");

async function main() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const count = await Member.countDocuments();
  console.log(`Current Members in MongoDB: ${count}`);

  // Export current MongoDB data to members_mongodb_data.json
  const allMembers = await Member.find({}).sort({ createdAt: -1 });
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(allMembers, null, 2), "utf8");
  console.log(`✅ Synced ${allMembers.length} records to: ${BACKUP_FILE}`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
