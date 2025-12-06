
//Import required modules
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

//Enable CORS so React(frontend) can call backend API
app.use(cors());
app.use(express.json());

//serve all images inside/public as static files
app.use(express.static("public"));

// SEARCH ROUTE
app.get("/api/getImage", (req, res) => {
    let name = req.query.name;

    //If no name is provided, return error
    if (!name) return res.status(400).json({ error: "Name is required" });

    name = name.toLowerCase();

    //default image
    let fileName = "default.jpg";

    //check which character user is searching for
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

/*MULTER SETUP(Handles file uploads)
multer.diskStorage controls where files are saved
Uploaded file is temporarily saved as tempUpload.jpg

*/
const upload = multer({
    storage: multer.diskStorage({

        //save all uploaded files into/public
        destination: (req, file, cb) => cb(null, "public/"),

        //give temporary name before renaming
        filename: (req, file, cb) => cb(null, "tempUpload.jpg")
    })
});

/* UPLOAD ROUTE
allows user to upload a new image for tom/jerry/dog
backend renames uploaded file to tom.jpg, jerry.jpg, or dog
ovewrites existing file
*/
app.post("/api/upload", upload.single("image"), (req, res) => {
    const name = req.query.name?.toLowerCase();

    //validate name
    if (!name) return res.status(400).json({ error: "Character name is required" });

    //validate file upload
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    //decide the final filename based on name
    let fileName = null;

    if (name.includes("tom")) fileName = "tom.jpg";
    if (name.includes("jerry")) fileName = "jerry.jpg";
    if (name.includes("dog")) fileName = "dog.jpg";

    //invalid name entered by user
    if (!fileName) return res.status(400).json({ error: "Invalid character name" });

    //build file paths for rename
    const oldPath = path.join(__dirname, "public", "tempUpload.jpg");
    const newPath = path.join(__dirname, "public", fileName);

    //rename(overwrite existing character image)
    fs.rename(oldPath, newPath, (err) => {
        if (err) return res.status(500).json({ error: "File rename failed" });
        res.json({ message: "Upload successful" });
    });
});

// START SERVER
app.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
});
