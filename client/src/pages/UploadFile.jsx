// UploadFile.jsx
import React, { useState, useEffect, useContext } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import Web3 from 'web3';
import DocDep from '../contracts/DocDep.json';
import contract from '../contracts/contract-address.json';
import { UserContext } from '../contexts/UserContext';
import '../styles/uploadstyle.css';

//https://gateway.pinata.cloud/ipfs/QmedFxiupmnS8HJ6A6st8DEMp4sXR1jVxNS55NpDYqPqpj

const web3 = new Web3(window.ethereum);
const doccon = new web3.eth.Contract(DocDep.abi, contract.docdep);

const UploadFile = () => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [fileurl, setFileurl] = useState(null);
  const [publicKey, setPublicKey] = useState("");
  const [IPFSHash, setIPFSHash] = useState(null);
  const [encryptedDocKey, setEncryptedDocKey] = useState("");
  const [encryptedFile, setEncryptedFile] = useState("");
  const [decryptedDocKey, setDecryptedDocKey] = useState("");
  const [decryptedFile, setDecryptedFile] = useState(null);
  const [decryptedFileurl, setDecryptedFileurl] = useState("");

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const result = await window.ethereum.request({
          method: "eth_getEncryptionPublicKey",
          params: [window.ethereum.selectedAddress],
        });
        setPublicKey(result);
      } catch (error) {
        console.error("Error fetching public key:", error.message);
      }
    };

    fetchPublicKey();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileurl(URL.createObjectURL(e.target.files[0]));
    
  };

  const handleEncrypt = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(file.encoding);
      formData.append("publicKey", publicKey);

      console.log(formData);

      const result = await axios.post("http://localhost:5000/encrypt", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for FormData
        },
      });

      console.log(result.data);

      setEncryptedDocKey(result.data.hexEncryptedDocKey);
      setEncryptedFile(result.data.encryptedFile);

      setIPFSHash(result.data.pinatares.IpfsHash);

      await addDocumentToBlockchain(file.name, result.data.pinatares.IpfsHash, result.data.hexEncryptedDocKey);

    } catch (error) {
      console.error("Error encrypting file:", error.message);
    }
  };

  // const handleDecrypt = async () => {
  //   try {
  //     // Use eth_decrypt to decrypt the encrypted document key
  //     const decryptedDocKey = await window.ethereum.request({
  //       method: 'eth_decrypt',
  //       params: [encryptedDocKey, window.ethereum.selectedAddress],
  //     });

  //     //console.log('Decrypted Document Key:', decryptedDocKey);

  //     // Now you can use the decrypted document key to decrypt the file
  //     const decryptedFile = CryptoJS.AES.decrypt(encryptedFile, decryptedDocKey);
  //     console.log(decryptedFile);
  //     const decryptedFileText = decryptedFile.toString(CryptoJS.enc.Utf8);

  //     const fileExtension = (file.name || '').split('.').pop().toLowerCase();
  //     setDecryptedFile(decryptedFileText);

  //   // Map file extensions to content types (add more as needed)
  //   const contentTypeMap = {
  //     'txt': 'text/plain',
  //     'pdf': 'application/pdf',
  //     'jpg': 'image/jpeg',
  //     'png': 'image/png',
  //     // Add more mappings as needed
  //   };

  //   // Determine the content type based on the file extension
  //   const fileType = contentTypeMap[fileExtension] || 'application/octet-stream';
  //   console.log(file.name, fileExtension, fileType);

  //   setDecryptedDocKey(decryptedDocKey);

  //     // Create a data URL for the Blob
      
  //     // Update state with the decrypted file URL
  //     const newurl = `data:${fileType};base64,${decryptedFileText}`
  //     setDecryptedFileurl(newurl);
  //   //console.log(decryptedFileurl);
  //   } catch (error) {
  //     console.error('Error decrypting file:', error.message);
  //   }
  // };

  const addDocumentToBlockchain = async (name, ipfsHash, encKey) => {
    try {
        await doccon.methods.addDoc(name, ipfsHash, encKey).send({ from: user });
        alert("Document added to the blockchain successfully!");
    } catch (error) {
      console.error("Error adding document to the blockchain:", error.message);
    }
  };

  
  return (
    <div className="upload-container">
      <h2 className='upload-h2'>Upload a Document</h2>
      <div>
        <h3>Your Public Encryption Key</h3>
        {publicKey && <p>{publicKey}</p>}
      </div>
     
      <label className='upload-label'>
        Choose a File:
        <input type="file" onChange={handleFileChange} required className='fileinput'/>
      </label>
      
     
      {/* <button onClick={handleDecrypt}>Decrypt File</button> */}

      

      <iframe height={file?"400":"0"} src={fileurl} className='filepreview'/>
      <button onClick={handleEncrypt} className='uploadfilebutton'>Encrypt and Upload File</button>

    </div>
  );
};

export default UploadFile;
