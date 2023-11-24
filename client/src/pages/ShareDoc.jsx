// ShareDoc.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from '../contexts/UserContext';
import axios from "axios";
import CryptoJS from "crypto-js";
import Web3 from 'web3';
import DocDep from '../contracts/DocDep.json';
import contract from '../contracts/contract-address.json';
import '../styles/profile.css';


const web3 = new Web3(window.ethereum);
const doccon = new web3.eth.Contract(DocDep.abi, contract.docdep);


const ShareDoc = () => {
  const { user } = useContext(UserContext);

  const { hash, key } = useParams();
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [encryptedSharedKey, setEncryptedSharedKey] = useState("");
  const [isShared, setIsShared] = useState(false);

    const shareDocument = async () => {
      try {
        // Decrypt the provided key using the user's private key
        const decryptedKey = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [key, user],
        });

        // Encrypt the key with the recipient's public key
        const result = await axios.post("http://localhost:5000/share", {decryptedKey: decryptedKey, recpublicKey: recipientPublicKey}, {
        headers: {
          "Content-Type": "application/json", // Set the content type for FormData
        },
      });

      console.log(result.data);
        
        await addSharedDocumentToBlockchain(hash, recipientAddress, result.data.hexEncryptedDocKey);

        setEncryptedSharedKey(result.data.hexEncryptedDocKey);
        setIsShared(true);
      } catch (error) {
        console.error("Error sharing document:", error.message);
      }
    };

  const addSharedDocumentToBlockchain = async (hash, recipientAddress, encryptedKey) => {
    try {
        try {
            await doccon.methods.shareDocument(hash, recipientAddress, encryptedKey).send({ from: user });
            alert("Record added to the blockchain successfully!");
        } catch (error) {
          console.error("Error adding document to the blockchain:", error.message);
        }
    } catch (error) {
      console.error("Error adding shared document to the blockchain:", error.message);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-h2">Share Document</h2>
      <div>
   
      <label className="profile-label-2">
        Recipient Address:
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          required
          className="profile-input-2"
        />
      </label>
      <br/>
      <label className="profile-label-2">
        Recipient Public Key:
        <input
          type="text"
          value={recipientPublicKey}
          onChange={(e) => setRecipientPublicKey(e.target.value)}
          required
          className="profile-input-2"
        />
      </label>
      <button onClick={shareDocument} className="profile-button-2">Share Document</button>
      {isShared ? (
        <div>
          <p>Document shared successfully!</p>
          {/* <p>Encrypted Shared Key: {encryptedSharedKey}</p> */}
        </div>
      ) : (
        <p></p>
      )}
    </div>
    </div>
  );
};

export default ShareDoc;
