const crypto = require('crypto');

const hashedData = "89e61d1365e771716a0ca09922b99d783ecef103f022a6a40f369537931fb19da4aa135433ba8575de7d05d3fd524176f8ee0ffef8e39a1c3b23a0592e14a1f1fa7ed67af8c5d8a035d93fb6be2ef2b5c44aa6adaa3c32dc436eecd685695cf7e4dd6335a3a9e661a4fa82b09a340d40a13290c9083208bc7350309484da4b1b3e7816cb06cc9d112a44a0d46e1bc87e941e1077e792d16e4a5c42a13cd16819682fc6464d7dc0aebed54d551a24147f06f6c1c476512fbd2c2706bf5829de947b00d87f41e900ec9f16a9ae419302586c2f4b401f37ca51f808efbd66ce0b50195ae61081fa42c2df5e49353a1f4b4520595993c222caff5f0aa3c50d55ca002a77aa17dab8f5dd9d757dbcf9c87a7478f9216e0e944defed8d17537c33d7f1753e10d041b859f98f85c5771420ac244c99e5b0a5ac50be2ce32d5e72eb98b76037ccc98d214fbfa190442bdd09e976a1b3e95d10c4a4bfdbaacff3b96b2b4d83042f793a6e68d88f0ea20f8332fe931d9fea211cbb1150a00228996a46555210a23c6c20fd8c1e42319daf088fb70a0866f5e6aef1e6cac61214734f4e7de6a0a39a41f917a30fa8d2b4c0c9c702eed4dd12b8f246e06770b6d1a02e65ad49f675ab7e83a3c1e7697de9e965d8dfb2dcef8ec63fead17b8da94299ef7d61b88e78b22b7d27aa5aa5696749dad3c423f5cd12591fcfddae1dd6f22aba4e6de9f7cce3ab938974cc0ac0d017924fb556e91b5dd5a6f8d8faf286bc04b9b0270355993046b43288a8ce178c0b6964e65cc1353504304f2e7f404478bdbe70256b681b054bacaa9c331db3b748d944aded89809b14a95304f32aa1edce4dbd55e3578e1f3a10041a891130efbc859a95beca3d98ea3640b9cf99e9a3f72c1c84925781d819155290f1c95c2859bca4ae6c834ffad4ca855250221b9b2427b4574e91f1da6fa03c251c65db282217475eac3aee08978a66af512f47864279f4e3c9"
const iv = "4abd82c0f9130187f5cf401db0e28a1c"

function decryptHashedValues(encryptedData, iv, key) {
  const algorithm = "aes-256-cbc";
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return JSON.parse(decryptedData);
}

// function deriveKey(password, salt, iterations, keylen) {
//   return crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha256');
// }

// const key = deriveKey('juan_rocks_123', 'salt', 100000, 32); // Adjust salt and iterations as needed
// console.log('Derived key:', key.toString('hex'));
// const decryptedValues = decryptHashedValues(encryptedData=hashedData, iv, key);
// console.log("Decrypted Values:", decryptedValues);

module.exports = {hashedData, iv, decryptHashedValues};