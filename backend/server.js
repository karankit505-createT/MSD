const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Trust first proxy hop when behind reverse proxy (DigitalOcean App Platform / Nginx)
app.set("trust proxy", 1);

const isTestEnv =
  process.env.NODE_ENV === "test" ||
  Boolean(process.env.NODE_TEST_CONTEXT) ||
  process.argv.some((arg) => arg.includes("test")) ||
  Boolean(process.env.VITEST);

// Connect to MongoDB (skip during unit tests)
if (!isTestEnv) {
  connectDB();
}

// ─── Security Headers (Helmet) ─────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ─── Middleware ───────────────────────────────────────────────
const parseAllowedOrigins = () => {
  const envList = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ];
  const list = envList
    .filter(Boolean)
    .map((o) => o.trim().replace(/\/+$/, ""));

  if (process.env.NODE_ENV !== "production") {
    list.push(
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:3000"
    );
  }
  return [...new Set(list)];
};

const isOriginAllowed = (origin, allowedList, isDev) => {
  // Allow non-browser requests (tools, curl, server-to-server health checks)
  if (!origin) return true;
  const cleanOrigin = origin.trim().replace(/\/+$/, "");

  if (isDev) {
    if (cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")) {
      return true;
    }
  }
  return allowedList.includes(cleanOrigin);
};

const allowedOrigins = parseAllowedOrigins();
const isDev = process.env.NODE_ENV !== "production";

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin, allowedOrigins, isDev)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation: Origin not allowed"));
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/upload", uploadRoutes);
app.use("/api/members", memberRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

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
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    error: isProd ? "Internal Server Error" : (err.message || "Internal Server Error"),
  });
});

const validateJwtSecret = (secret, isProd = process.env.NODE_ENV === "production") => {
  if (isProd) {
    if (!secret || typeof secret !== "string" || secret.trim().length < 32) {
      return {
        valid: false,
        error: "FATAL: JWT_SECRET must be configured with at least 32 characters in production.",
      };
    }
  }
  return { valid: true };
};

// ─── Start Server & Process Handlers ──────────────────────────
let server = null;
if (require.main === module) {
  const secretCheck = validateJwtSecret(process.env.JWT_SECRET, process.env.NODE_ENV === "production");
  if (!secretCheck.valid) {
    console.error(secretCheck.error);
    process.exit(1);
  }

  server = app.listen(PORT, HOST, () => {
    console.log(`✅ MSD Backend running on http://${HOST}:${PORT}`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
      server.close(async () => {
        console.log("HTTP server closed.");
        try {
          const mongoose = require("mongoose");
          await mongoose.disconnect();
          console.log("MongoDB connection closed.");
        } catch (e) {
          console.error("Error during MongoDB disconnection:", e.message);
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (err) => {
    console.error("FATAL Uncaught Exception:", err.message);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("FATAL Unhandled Rejection:", reason);
    process.exit(1);
  });
}

module.exports = { app, parseAllowedOrigins, isOriginAllowed, validateJwtSecret };

