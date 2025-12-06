const express = require("express");
const app = express();
const path = require ("path");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // allow images to be served

// API route to return the correct image
app.get("/api/getImage", (req, res) => {
    const name = req.query.name;  

    if(!name){
        return res.status(400).json({ error: "Name is required"});
        name=name.toLowerCase();
    }

   const filePath=path.join(__dirname, "public" , fileName);

if(fs.existsSync(filePath)){
    return res.json({ image: fileName});
}
return res.status(404).json({error: "Image not found"});

});

//multer setup for file upload
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => 
            cb(null, "public/"),
        
        filename: (req, file, cb) => 
            cb(null, "tempUpload.jpg")
    })// temporary file name before renaming
        
  
});


    
//upload route
app.post("/api/upload", upload.single("image"),(req, res)=>{
  const name=req.query.name?.toLowerCase();
  
  if(!name){
    return res.status(400).json({error: "character name is required"});
  }
  if(!req.file){
    return res.status(400).json({ error: "No image uploaded"});
  
     let fileName = null;

    if (name.includes("tom")) fileName = "tom.jpg";
    if (name.includes("jerry")) fileName = "jerry.jpg";
    if (name.includes("dog")) fileName = "dog.jpg";

  const oldPath=path.join(__dirname, "public" , "tempUpload.jpg");
  const newPath=path.join(__dirname, "public" , fileName);

  fs.rename(oldPath, newPath, (err)=>{
    if(err) return res.status(500).json({error:"File rename failed"});
    res.json({ message:"Upload successful"});
  });


// Start server
app.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
});
