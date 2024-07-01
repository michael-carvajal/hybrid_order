const { chromium, firefox } = require("playwright");
const crypto = require("crypto");
const path = require("path");
const { hashedData, iv, decryptHashedValues } = require("./hashedValues.js");
const { app, BrowserWindow, ipcMain } = require("electron");
const orderFromATD = require("./atd/index.js");
const orderFromMFI = require("./mfi/index.js");
const orderFromUSA = require("./usa/index.js");
const orderFromNTW = require("./ntw/index.js");
const orderFromTirehub = require("./tirehub/index.js");
const orderFromKAndM = require("./k&m/index.js");
const orderFromTireRack = require("./tirerack/index.js");
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
    width: 360,
    height: 715,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("./dist/index.html");

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
    try {
      await browser.close();
    } catch (error) {
      console.error("Error closing previous browser instance:", error);
    }
  }

  const { vendor, storeNumber, itemNumber, poNumber, quantity, pickup } = args;
  const isTireRack = vendor === "TIRERACK" ? firefox : chromium;
  browser = await isTireRack.launch({ headless: false });
  page = await browser.newPage();

  function deriveKey(password, salt, iterations, keylen) {
    return crypto.pbkdf2Sync(password, salt, iterations, keylen, "sha256");
  }

  const key = deriveKey("juan_rocks_123", "salt", 100000, 32);
  const decryptedValues = decryptHashedValues(hashedData, iv, key);

  let websiteUrl, username, password, response;

  switch (vendor) {
    case "ATD":
      websiteUrl = decryptedValues.ATD_URL;
      username = decryptedValues.ATD_USERNAME;
      password = decryptedValues.ATD_PASSWORD;
      response = await orderFromATD(
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
      if (response.error) {
        return response.error;
      }
      return response.confirmation;
    case "MFI":
      websiteUrl = decryptedValues.MFI_URL;
      username = decryptedValues.MFI_USERNAME;
      password = decryptedValues.MFI_PASSWORD;
      response = await orderFromMFI(
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
      if (response.error) {
        return response.error;
      }
      return response.confirmation;
    case "USA":
      websiteUrl = decryptedValues.USA_URL;
      username = decryptedValues.USA_USERNAME;
      password = decryptedValues.USA_PASSWORD;
      response = await orderFromUSA(
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

      if (response.error) {
        return response.error;
      }
      return response.confirmation;
    case "NTW":
      websiteUrl = decryptedValues.NTW_URL;
      username = decryptedValues.NTW_USERNAME;
      password = decryptedValues.NTW_PASSWORD;
      response = await orderFromNTW(
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
      if (response.error) {
        return response.error;
      }
      return response.confirmation;
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
      if (response.error) {
        return response.error;
      }
      return response.confirmation;
    case "K&M":
      websiteUrl = decryptedValues.KANDM_URL;
      username = decryptedValues.KANDM_USERNAME;
      password = decryptedValues.KANDM_PASSWORD;
      await orderFromKAndM(
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
    case "TIRERACK":
      websiteUrl = decryptedValues.TIRERACK_URL;
      const storeInt = parseInt(storeNumber);
      if (storeInt < 1000) {
        username = decryptedValues.TIRERACK_USERNAME_MAVISCORP;
        password = decryptedValues.TIRERACK_PASSWORD_MAVISCORP;
      } else if (storeInt <= 1300) {
        username = decryptedValues.TIRERACK_USERNAME_UPPERCASE;
        password = decryptedValues.TIRERACK_PASSWORD_UPPERCASE;
      } else {
        username = decryptedValues.TIRERACK_USERNAME_LOWERCASE;
        password = decryptedValues.TIRERACK_PASSWORD_LOWERCASE;
      }
      // TODO: change to order from tire rack below
      response = await orderFromTireRack(
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
      if (response.error) {
        return response.error;
      }
      return response.confirmation;
    default:
      console.log("Invalid vendor. Please choose either 'ATD' or 'other'.");
      throw new Error("Invalid vendor");
  }
});

ipcMain.handle("reset-automation", async (event) => {
  if (browser) {
    try {
      await browser.close();
      browser = null;
    } catch (error) {
      console.error("Error closing browser during reset:", error);
    }
  }
});
