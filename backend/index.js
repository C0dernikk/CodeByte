require("dotenv").config();
const express = require("express");
const cors = require("cors");
const runRoutes = require("./routes/run.routes");
const { connectToDatabase } = require("./data/database");

const app = express();

// ---- CORS FIX FOR RENDER <-> VERCEL ----
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // e.g. https://my-frontend.vercel.app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Required for preflight (OPTIONS)
app.options("*", cors());

// ---- BODY PARSERS ----
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---- ROUTES ----
app.use(runRoutes);

// ---- DATABASE + SERVER ----
connectToDatabase()
  .then(() => {
    console.log("Database connection established!");
    const PORT = process.env.PORT || 5050; // Render injects PORT
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Database connection failed!", error?.message || error);
    if (error?.stack) console.error(error.stack);
  });
