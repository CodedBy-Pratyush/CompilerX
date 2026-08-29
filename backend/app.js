require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const executionRoutes = require("./routes/executionRoutes");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// FIX: Render sits behind a reverse proxy that sets "X-Forwarded-For".
// Without trusting it, express-rate-limit throws on every rate-limited
// request (e.g. /auth/login, /auth/signUp), causing 500 errors.
app.set("trust proxy", 1);
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));



app.use("/auth", authRoutes);
app.use("/", projectRoutes);
app.use("/", executionRoutes);
app.use("/", aiRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, msg: err.message || "Server error" });
});



module.exports = app;
