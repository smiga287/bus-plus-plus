const express = require("express");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", require("./routes/api")); // Connects the API router to /api

// Test if DB works
db.authenticate()
  .then(() => {
    console.log("Successfully connected to the DB");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
