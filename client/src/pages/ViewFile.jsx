// ViewFile.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import { UserContext } from '../contexts/UserContext';

const ViewFile = () => {
  const { ext, hash, key } = useParams();
  const { user } = useContext(UserContext);
  const [decryptedFileurl, setDecryptedFileurl] = useState(null);

  useEffect(() => {
    const fetchEncryptedFile = async () => {
      try {
        // Fetch the encrypted file from IPFS using the hash
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
        const encryptedFile = response.data;

        const decryptedDocKey = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [key, user],
        });

        const decryptedFile = CryptoJS.AES.decrypt(encryptedFile, decryptedDocKey);
        const decryptedFileText = decryptedFile.toString(CryptoJS.enc.Utf8);

        const contentTypeMap = {
          'txt': 'text/plain',
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'png': 'image/png',
        };

        const fileType = contentTypeMap[ext] || 'application/octet-stream';

        // Create a data URL for the Blob
        const newurl = `data:${fileType};base64,${decryptedFileText}`;
        setDecryptedFileurl(newurl);
      } catch (error) {
        console.error("Error fetching or decrypting the file:", error.message);
      }
    };

    fetchEncryptedFile();
  }, [ext, hash, key, user]);

  return (
    <div>
      <h2>View Decrypted File</h2>
      <div>
    
        {decryptedFileurl && (
          <iframe
            title="decryptedFile"
            width="400"
            height="400"
            src={decryptedFileurl}
          />
        )}
      </div>
    </div>
  );
};

export default ViewFile;
