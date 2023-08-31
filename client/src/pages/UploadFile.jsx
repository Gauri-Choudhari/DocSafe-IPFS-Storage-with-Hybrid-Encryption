import React from "react";
import { useState } from "react";
import '../styles/style.css';
import '../styles/uploadstyle.css';
import axios from "axios";
import { getjwt } from "../utils/info.js";
const JWT = `Bearer ${getjwt()}`;

function UploadFile(){

const [file, setFile] = useState();
const [fileurl, setFileurl] = useState();
const [filehash, setFileHash] = useState();

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setFileurl(e.target.files[0]);
    }

    async function onSubmit(e){
        e.preventDefault();
        console.log(file);
        console.log(fileurl);
        const formData = new FormData();
        formData.append('file',  fileurl);
    
        const metadata = JSON.stringify({
          name: fileurl.name,
        });
        formData.append('pinataMetadata', metadata);
        
        const options = JSON.stringify({
          cidVersion: 0,
        })
        formData.append('pinataOptions', options);
      
      
          try{
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
              maxBodyLength: "Infinity",
              headers: {
                
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': JWT
              }
            });
            console.log(res.data);
            setFileHash(res.data.IpfsHash);
            alert("Uploaded successfully");
          } catch (error) {
            console.log(error);
            alert("There was an error. Please try again.");
          }
      };

  

return(

    <body className="Main">
      <h1 className="Title">File Upload</h1>
        <div className="container">

        <form className="form"
                encType="multipart/form-data"
                >

                
                    <input className="fileinput" type="file" name="file" id="file" onChange={handleChange}/>
                    
                    <div className = {filehash? "hashdisplaydiv":"hide"}>
                      <p className="normaltext">File uploaded successfully<br/><br/>
                      File hash is : {filehash}<br/><br/>
                      You can access your file <a href={`https://ipfs.io/ipfs/${filehash}`} target = "_blank">here</a>
                      </p>
                    </div>
                    <br/>
                    <p className="normaltext">File Preview</p>
                    <iframe className="filepreview" title="filepreview" width="800" height={file?"800":"0"} src={file}/>
                <div>
                 <div style={{width: '100%', display: "flex", 'justify-content': 'center'}}>
                        <button className="uploadfilebutton" 
                        
                        onClick={onSubmit}>Upload File</button>
                   </div> </div>

                </form>

            </div>
        </body>
 
)
}



export default UploadFile;

