const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
//enable CORS so React(frontend) can call backend API
app.use(cors());
app.use(express.json()); //Parse JSON request bodies
app.use(express.static("public")); // allow images to be served

// API route to return the correct image
app.get("/api/getImage", (req, res) => {
  let name = req.query.name;

  //if no name is provided, return error
  if (!name) return res.status(400).json({ error: "Name is required" });
  name = name.toLowerCase();

  let fileName = "default.jpg";

  //check whivh character user is searching for
  if (name.includes("tom")) fileName = "tom.jpg";
  if (name.includes("jerry")) fileName = "jerry.jpg";
  if (name.includes("dog")) fileName = "dog.jpg";

  //build full file path

  const filePath = path.join(__dirname, "public", fileName);

  //check if the file exists in public folder
  if (fs.existsSync(filePath)) {
    return res.json({ image: fileName });
  }

  //if file not found
  return res.status(404).json({ error: "Image not found" });
});

//multer setup for file upload
const upload = multer({
  storage: multer.diskStorage({
    //save all uploaded files into public
    destination: (req, file, cb) => cb(null, "public/"),

    //give temporary name before renaming
    filename: (req, file, cb) => cb(null, "tempUpload.jpg"),
  }), // temporary file name before renaming
});

//upload route
app.post("/api/upload", upload.single("image"), (req, res) => {
  const name = req.query.name?.toLowerCase();

  //validate name
  if (!name)
    return res.status(400).json({ error: "character name is required" });

  //validate file upload
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  //decide the final filename based on name
  let fileName = null;

  if (name.includes("tom")) fileName = "tom.jpg";
  if (name.includes("jerry")) fileName = "jerry.jpg";
  if (name.includes("dog")) fileName = "dog.jpg";

  //invalid name entered by user
  if (!fileName)
    return res.status(400).json({ error: "Invalid character name" });

  //build file paths for rename
  const oldPath = path.join(__dirname, "public", "tempUpload.jpg");
  const newPath = path.join(__dirname, "public", fileName);

  //rename(overwrite existing character image)
  fs.rename(oldPath, newPath, (err) => {
    if (err) return res.status(500).json({ error: "File rename failed" });
    res.json({ message: "Upload successful" });
  });
});

// Start server
app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
