
import React, {useState} from "react";

function App() {
  const[searchName, setSearchName] = useState(" ");//text user types when serching an image
  const[imageUrl, setImageUrl] = useState(" ");//URL of the image returned by the backend
  const[uploadName, setUploadName] =useState(" ");//name user enters when uploading(ex: "tom")
  const[file, setFile]=useState(null); //the actual image file selected from computer
  const[message, setMessage] = useState(" ");//message returned from backend after upload

  //search image
  const handleSearch = async()=>{
    const res = await fetch(`http://localhost:3001/api/getImage?name=${searchName}`);
    const data = await res.json();

    //if backend sends an image name
  if(data.image){
    setImageUrl(`http://localhost:3001/${data.filename}?t=${Date.now()}`);
    } else {
      alert("Image not found");
  }
};
  //upload image
  const handleUpload=async()=> {
    //validation: make sure user selected a file and typed a name
    if(!file||!uploadName){
      alert("Please enter a name and select a file");
      return;
    }

    //FormData allows sending files (multipart/form-data)
    const formData=new FormData();
    formData.append("image", file);

    //send post request to backend
    const res=await fetch(`http://localhost:3001/api/upload?name=${uploadName}`,
      { method: "POST", body: formData, 

      }
    );

    const data=await res.json();
    setMessage(data.message); //show success message
  };

  //frontend UI
  return (
    <div style = {{ width: "600px", margin: "20px auto", fontFamily: "Arial"}}>
        <h1>
          Image Search + Upload System
        </h1>

        {/*search section*/}
        <h2>
          Search Image
        </h2>
        <input
        placeholder="Enter name(tom/jerry/dog)"
        value={searchName}
        onChange={(e)=>setSearchName(e.target.value)} 
        />
        <button onClick = { handleSearch}>Search </button>

        {imageUrl && (
        <img src={imageUrl} 
        alt="Character" 
        width="250"
         style={{ marginTop: "20px" }} />
      )}

      <hr/>

      {/*upload section*/}
      <h2>Upload New Image</h2>
      <input
      placeholder="Enter name to replace (tom)"
      value={uploadName}
      onChange={(e)=> setUploadName(e.target.value)}
      />

      <br/> 
      <br/>
      <input type="file" onChange ={(e) => setFile(e.target.files[0])}/>

      <br/>
      <br/>

       <button onClick={handleUpload}>Upload</button>

       {message && <p style ={{ marginTop:"10px"}} >{message}</p>}
       </div>
    
  );

}
export default App;
