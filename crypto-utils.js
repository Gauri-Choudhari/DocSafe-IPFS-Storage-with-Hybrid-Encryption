// crypto-utils.js
const sigUtil = require("eth-sig-util");

async function encrypt(fileBuffer) {
  const randomKey = crypto.getRandomValues(new Uint8Array(32));
  const docKey = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(randomKey));

  const encryptedDocKey = await window.ethereum.request({
    method: "personal_sign",
    params: [docKey, window.ethereum.selectedAddress],
  });

  const encryptedFile = await sigUtil.encrypt({
    publicKey: window.ethereum.selectedAddress,
    data: fileBuffer.toString("hex"),
    version: "x25519-xsalsa20-poly1305",
  });

  return { encryptedDocKey, encryptedFile };
}

async function decrypt(encryptedDocKey, encryptedFile) {
  const decryptedDocKey = await window.ethereum.request({
    method: "eth_decrypt",
    params: [encryptedDocKey, window.ethereum.selectedAddress],
  });

  const decryptedFile = Buffer.from(
    await sigUtil.decrypt({
      privateKey: decryptedDocKey,
      ciphertext: encryptedFile.ciphertext,
      nonce: encryptedFile.nonce,
      ephemPublicKey: encryptedFile.ephemPublicKey,
      version: encryptedFile.version,
    }),
    "hex"
  );

  return { decryptedDocKey, decryptedFile };
}

module.exports = { encrypt, decrypt };
