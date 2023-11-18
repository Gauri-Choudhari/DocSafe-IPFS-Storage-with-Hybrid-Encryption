const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { bufferToHex } = require('ethereumjs-util');
const sigUtil = require('@metamask/eth-sig-util');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const FormData = require('form-data');


const app = express();
const port = 5000;
const JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzN2FiNmQyMy1iZTAwLTQ3NTItOGZjNC04NTg4ZTI1MTIzNWIiLCJlbWFpbCI6ImVkaXByb2plY3QzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwMDQ4M2I1MTNkMjA5N2RkMGRkYSIsInNjb3BlZEtleVNlY3JldCI6ImJiNGE2ZGQ5NTkyOTAzYTVmODcxNjU5ZmRlZjk5ZWNjMDgzNmM3MzIyM2Q0MDE3MWY5MGVlNWIwNzcwOGNmYzIiLCJpYXQiOjE2OTI5MzkzMzl9.yux8wZwgBayTAV0589TMeoIEBTMLily0TBh-yX8ivQY";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const pinStringToIPFS = async (string, filename) => {
  try {
   const buffer = Buffer.from(string, 'utf8');
   const data = new FormData();
   data.append('file', buffer, {
      filepath: filename
    })
   const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
      headers: {
        'Authorization': JWT
      }
    })
   console.log(res.data)
   return res.data;
  } catch (error) {
   console.log(error) 
  }
}


  
app.post("/encrypt", upload.single("file"), async (req, res) => {
    try {
      const { file, body: { publicKey } } = req;
      const fileBase64 = file.buffer.toString('base64');
      const randomKey = CryptoJS.lib.WordArray.random(32);
      const docKey = CryptoJS.enc.Hex.stringify(randomKey);
  
      const encryptedDocKey = sigUtil.encrypt({
        data: docKey, 
        publicKey: publicKey,
        version: 'x25519-xsalsa20-poly1305',
      });
  
      const hexEncryptedDocKey = '0x' + Buffer.from(JSON.stringify(encryptedDocKey)).toString('hex');
  
      const encryptedFile = CryptoJS.AES.encrypt(fileBase64, docKey).toString();

      const pinatares = await pinStringToIPFS(encryptedFile, file.originalname);
      console.log(pinatares);
      res.json({ hexEncryptedDocKey, encryptedFile, pinatares });
    } catch (error) {
      console.error("Error encrypting file:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/share", upload.single("file"), async (req, res) => {
    try {

      const { decryptedKey, recpublicKey  } = req.body;
      //console.log(decryptedKey, recpublicKey);

      const encryptedDocKey = sigUtil.encrypt({
        data: decryptedKey, 
        publicKey: recpublicKey,
        version: 'x25519-xsalsa20-poly1305',
      });
  
      const hexEncryptedDocKey = '0x' + Buffer.from(JSON.stringify(encryptedDocKey)).toString('hex');
  
      res.json({ hexEncryptedDocKey });
    } catch (error) {
      console.error("Error encrypting file:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
