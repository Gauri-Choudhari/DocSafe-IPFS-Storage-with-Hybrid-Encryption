// *********************************************************//
//                    UNDER DEVELOPMENT                     //
// *********************************************************//

import CryptoJS from 'crypto-js';

const generateKey=(p)=>
{
    var salt = CryptoJS.lib.WordArray.random(128/8);
    return CryptoJS.PBKDF2(p, salt, { keySize: 512/32, iterations: 1000 });
}

const encryptFile = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const rand = Math.random();
    const key = generateKey(rand.toString('hex'));
    const wordArray = CryptoJS.lib.WordArray.create(reader.result);
    const encrypted = CryptoJS.AES.encrypt(wordArray, key);
    const encryptedFile = new Blob([encrypted], { type: file.type });
    const encryptedFileUrl = URL.createObjectURL(encryptedFile);
    
  };
  reader.readAsArrayBuffer(file);
};

export default encryptFile;
