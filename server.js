const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images) from "public"
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
