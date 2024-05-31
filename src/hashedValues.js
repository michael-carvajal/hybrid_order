const crypto = require('crypto');

const hashedData = "7f212adf2d4742a2464ffb575c03e7e381f88c1263dc11aacbf82b7e50f26cfc7a38f0ffdff72d6a6ed6235d0333e1ea671490186e531c695a6516bcce4392a7b8e36a671d9802e015ef95ba700306d2e584c3aeb49d1a751a4da6e02c40203ae1670aa7e41a5a40c7ddda209390f680703e236924c1109659c90ccaceabf647e6129365af175363ba348afe3f43142f5d04fdd0c10c944a3226b0353b89c0d0245c7aa5fde649edc2a3da6d007ecac795c5a2ee29ec16359d587a10176bfe7bd81d26f5dcb594f53ae9d59594cf13e169fbcfc9e03e06cf0b7e3c3781792d922392df87d27b023a21fe3a2d3bd2fd04663fc164cfaab8d53a0daebca208841e5647105856957c358244873080e0b38193ee8aa88e8372bb91a8cf9d1b28ce389dd56dfe4e27f2b390347e4d373170a2e0818c2806bedb96ebb2a7a5ed022eb69212e7c41fe9693f32ef16e2e7dd1366a630cc3b4e8923ad6c1d2dd9bc0d7322708cbdfacabb3705fac9a4b7ecebefb5e68bcaaefc6a17c446050f21af5d18512213e0e3e44bf878693a9863d280c7c6796ad13ea6fe91700112860e96847adc50550c65ba6a45f68a156271a72f44d96f6f69bbaf4014f8970eae74e621391386c6a1d3cefb5cd8c70952f628f1288ec0643ce50ecbc2eb709e4e553a2771443ee26015062a2ebc4046c664ff5bd97bdb048952898fd089c623580df016a49ea64d2dd66d84223b4387e2e10f7385ff3dc6f49d8c37dda293958231ffa1b8f9f962deefe2794f572bd7238e9a9a1fe82f01247476e77125ae8dbd3e0844fbac9322e7b5634929b323feababef7e91fb"
const iv = "de7a6ea827efca48b853d7e0b0c50fc0"

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