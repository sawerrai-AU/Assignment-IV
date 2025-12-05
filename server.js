const express = require("express");
const app = express();
const path = require ("path");
const multer = require("multer");
const fs = require("fs");

app.use(express.json());
app.use(express.static("public")); // allow images to be served

// API route to return the correct image
app.get("/api/getImage", (req, res) => {
    const name = req.query.name.toLowerCase();  //name = jerry
const storage =multer.diskStorage({
    destination: (req, file, cb) => cb(null, public),
    image:(req, file, cb)=> {
        const name = req.query.name.toLowerCase();
    

    let imaage = "default.jpg";

    if (name.includes("tom")) image = "tom.jpg";
    if (name.includes("jerry")) image = "jerry.jpg";
    if (name.includes("dog")) image = "dog.jpg";
cb(null, image);
    res.json({ url: "/" + image });  
    } 
});
const upload = multer({storage:storage});
app.post("/api/upload", upload.single("image"),(req, res)=>{
  res.json({ message: "upload successful" });    
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
