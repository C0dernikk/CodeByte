require("dotenv").config();
const express = require("express");
const cors = require("cors");
const runRoutes = require("./routes/run.routes");
const { connectToDatabase } = require("./data/database");

const app = express();

// ==========================
//   GLOBAL CORS MIDDLEWARE
// ==========================

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,        // your Vercel URL
  "http://localhost:3000",            // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Fix OPTIONS preflight for all routes
app.options("*", cors());

// ==========================
//     BODY PARSER
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==========================
//        ROUTES
// ==========================
app.use(runRoutes);

// ==========================
//  DATABASE + SERVER START
// ==========================
connectToDatabase()
  .then(() => {
    console.log("Database connected!");

    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  })
  .catch((error) => {
    console.log("DB connection failed:", error.message || error);
    if (error.stack) console.log(error.stack);
  });
