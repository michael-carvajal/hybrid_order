const crypto = require('crypto');

const hashedData = "c1aedfc2813dd8512c994d08c14abe5c8b85bcbe425162b4aa67ca0f04cbb66aeefe278524c54aa04c1ea4e3b4f3c849ed635d429bdfde26f027d1760b8baf3c47622c10d297a3c846d3f8f411b2dada6e6e49c752c78b39434e2b733b28cbb152e373a2e7de5dc0042a06bb121b1ac26b3d7a2665315e22fd4104946c22806c312f3cea520cf456448f7ec453612aa5d1ef7d953d306a68ef65556cb2ad604f25153f2135771d651d310de890338c5a96583ce3cf09e91c253bcc3a310cc03c9f7d0089f628adcba221f1cf46b2fec9bd203d925ff8316f6760be3ac882f8674f6d4d42800f300721c033e3cc52edc587ec3defa15e1032847f15b52e04735e44603c314dce6e13ccf30c6a925bc024a1f77eaeaca82d9606772ea56469c00bbaabe9aeba32e198951b926c69695f72d8a62c296d650cc8b9aa56a76244dbce692327a6ed9a48d2eab1a0f6de61549f13eca4fc2cdbe369d4dbe1eadd3e438fe16810610ff7d95d1747b820045d13111757e91ff9b40aa19a5b2cb607ee838f44fe69f0f6e3f3d5be0b1f66cfc19062c8659ad463b7ed6295b567967f54f3bca2c43ba38d63df08d507286ed8f2992339c8b5cec49629512ab21f8d2f20824f1c3597140fbcbd2312bf4379dc67fef0"
const iv = "8a7e617f1ab903ff2633fcd2956aac2b"

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