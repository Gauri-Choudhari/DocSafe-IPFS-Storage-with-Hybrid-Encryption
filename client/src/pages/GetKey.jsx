import React, { useState, useEffect, useContext } from "react";
import Web3 from 'web3';
import { UserContext } from '../contexts/UserContext';
import '../styles/uploadstyle.css';

const web3 = new Web3(window.ethereum);

const GetKey = () => {
  const { user } = useContext(UserContext);
  const [publicKey, setPublicKey] = useState("");


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
  
  return (
    <div className="upload-container">
      <h2 className='upload-h2'>Get my Public Encryption Key</h2>
      <p>Here at DocSafe, all files are encrypted with dual encryption to get unique keys for enhanced security.
        <br/>  Share the following details for receiving a shared file. </p>
        <div>
        <h3>Your User Address</h3>
        {user && <p>{user}</p>}
      </div>
      <div>
        <h3>Your Public Encryption Key</h3>
        {publicKey && <p>{publicKey}</p>}
      </div>
     
      
    </div>
  );
};

export default GetKey;
