const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ─── Middleware ───────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
  "https://msd-nine.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (tools, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow any localhost port during development
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, true);
    }
    // Allow Vercel production and preview deployments
    if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/upload", uploadRoutes);
app.use("/api/members", memberRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Maha Seva Dal Backend API is running ✅",
    environment: process.env.NODE_ENV || "development",
    port: PORT,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ MSD Backend running on http://0.0.0.0:${PORT} (Render/Cloud ready)`);
});
