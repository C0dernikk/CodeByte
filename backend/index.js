require("dotenv").config();
const express = require("express");
const runRoutes = require("./routes/run.routes");
const { connectToDatabase } = require("./data/database");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(runRoutes);

connectToDatabase()
  .then(() => {
    console.log("Database connection established!");
    app.listen(process.env.PORT || 5050);
  })
  .catch((error) => {
    console.error(
      "Database connection failed!",
      error && error.message ? error.message : error
    );
    // also print stack for deeper debugging
    if (error && error.stack) console.error(error.stack);
  });
