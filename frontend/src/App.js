import logo from './logo.svg';
import './App.css';
import {useState} from "react";

function App() {
  const[searchName, setSearchName] = useState(" ");
  const[imageUrl, setImageUrl] = useState(" ");
  const[uploadName, setUploadName] =useState(" ");
  const[file, setFile]=useState(null);
  const[message, setMessage] = useState(" ");

  //search image
  const handleSearch = async()=>{
    const res = await fetch(`http://localhost:3001/api/getImage?name=${searchName}`);
    const data = await res.json();
  }

  //upload image
  const handleUpload=async()=> {
    if(!file||!uploadName){
      alert("Please enter a name and select a file");
      return;
    }
    const formData=new FormData();
    formData.append("image", file);

    const res=await fetch(`http://localhost:3001/api/upload?name=${uploadName}`,
      { method: "POST", body: formData });
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Image Search + Upload System
        </h1>

        /*search section*/
        <h2>
          Search Image
        </h2>
        <input>
        placeholder="Enter name(tom/jerry/dog)"
        value={searchName}
        onChange={(e)=>setSearchName(e.target.value)} 
        </input>
        <button onClick = { handleSearch}>Search </button>
        {imageUrl && (
        <img src={imageUrl} alt="Character" width="250" style={{ marginTop: "20px" }} />
      )}

      /*upload section*/
      <h2>Upload New Image</h2>
      <input>
      placeholder="Enter name to replace (tom)"
      value={uploadName}
      onChange{(e)=> setUploadName(e.target.value)}</input>
       <button onClick={handleUpload}>Upload</button>
      </header>
    </div>
  );
}

export default App;
