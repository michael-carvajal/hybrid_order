const { chromium } = require("playwright");
const crypto = require("crypto");
const path = require("path");
const { hashedData, iv, decryptHashedValues } = require("./hashedValues.js");
const { app, BrowserWindow, ipcMain } = require("electron");
const orderFromATD = require("./atd/index.js");
const orderFromMFI = require("./mfi/index.js");
const orderFromUSA = require("./usa/index.js");
const orderFromNTW = require("./ntw/index.js");
const orderFromTirehub = require("./tirehub/index.js");
// Use dynamic import for ES module
(async () => {
  const contextMenu = (await import("electron-context-menu")).default;

  contextMenu({
    labels: { copy: "Copy", paste: "Paste" },
  });
})();

let mainWindow;
let browser;
let page;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("./dist/index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await chromium.install();
    createWindow();
  }
});

ipcMain.handle("run-automation", async (event, args) => {
  if (browser) {
    await browser.close();
  }

  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();

  function deriveKey(password, salt, iterations, keylen) {
    return crypto.pbkdf2Sync(password, salt, iterations, keylen, "sha256");
  }

  const key = deriveKey("juan_rocks_123", "salt", 100000, 32); // Adjust salt and iterations as needed
  const decryptedValues = decryptHashedValues(hashedData, iv, key);
  // console.log("Decrypted Values:", decryptedValues);

  const { vendor, storeNumber, itemNumber, poNumber, quantity, pickup } = args;
  let websiteUrl, username, password;
  console.log(vendor, storeNumber, itemNumber, poNumber, quantity);
  switch (vendor) {
    case "ATD":
      websiteUrl = decryptedValues.ATD_URL;
      username = decryptedValues.ATD_USERNAME;
      password = decryptedValues.ATD_PASSWORD;
      await orderFromATD(
        page,
        websiteUrl,
        storeNumber,
        itemNumber,
        quantity,
        username,
        password,
        poNumber,
        pickup
      );
      break;

    case "MFI":
      websiteUrl = decryptedValues.MFI_URL;
      username = decryptedValues.MFI_USERNAME;
      password = decryptedValues.MFI_PASSWORD;
      await orderFromMFI(
        page,
        websiteUrl,
        storeNumber,
        itemNumber,
        quantity,
        username,
        password,
        poNumber,
        pickup
      );

      break;
    case "USA":
      websiteUrl = decryptedValues.USA_URL;
      username = decryptedValues.USA_USERNAME;
      password = decryptedValues.USA_PASSWORD;
      await orderFromUSA(
        page,
        websiteUrl,
        storeNumber,
        itemNumber,
        quantity,
        username,
        password,
        poNumber,
        pickup
      );

      break;
    case "NTW":
      websiteUrl = decryptedValues.NTW_URL;
      username = decryptedValues.NTW_USERNAME;
      password = decryptedValues.NTW_PASSWORD;
      await orderFromNTW(
        page,
        websiteUrl,
        storeNumber,
        itemNumber,
        quantity,
        username,
        password,
        poNumber,
        pickup
      );

      break;
    case "TIREHUB":
      websiteUrl = decryptedValues.TIREHUB_URL;
      username = decryptedValues.TIREHUB_USERNAME;
      password = decryptedValues.TIREHUB_PASSWORD;
      await orderFromTirehub(
        page,
        websiteUrl,
        storeNumber,
        itemNumber,
        quantity,
        username,
        password,
        poNumber,
        pickup
      );

      break;

    default:
      console.log("Invalid vendor. Please choose either 'ATD' or 'other'.");
      throw new Error("Invalid vendor");
      break;
  }
});

ipcMain.handle("reset-automation", async (event) => {
  if (browser) {
    await browser.close();
    browser = null;
  }
});
