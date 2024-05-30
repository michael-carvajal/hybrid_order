const getStoreId = require("./getStoreId");

async function login(username, password, page) {
  // Fill in the username
  await page.fill("#usernameTextBox", username);

  // Fill in the password
  await page.fill("#passwordTextBox", password);
  await page.getByRole("button").click();
  await page.getByRole("textbox");
}
async function searchForItem(page, itemNumber, quantity) {
  await page.fill("#tirepartField", itemNumber);
  await page.keyboard.press("Enter");
  await page.getByText(/Primary Warehouse*/i).click();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.type(quantity);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
}

async function orderFromUSA(
  page,
  url,
  storeNumber,
  itemNumber,
  quantity,
  username,
  password,
  poNumber
) {
  await page.goto(url);
  await login(username, password, page);
  await page.fill("#SelectDealerAutoComplete", storeNumber + " ");
  // Wait for the div containing the store number to be visible
  await page.waitForSelector(
    `div.divSelectDealerResult >> text=${storeNumber}`
  );

  // Click on the div containing the store number
  await page.click(`div.divSelectDealerResult >> text=${storeNumber}`);

  await searchForItem(page, itemNumber, quantity);
  await page.fill("#inputPurchaseOrder", poNumber);

  try {
    // Wait for the confirmation page to load
    await page.waitForSelector("div p.text-green.pl-2"); // Replace with the actual selector for the confirmation number
    await page.waitForSelector("div.flex p span.block"); // Replace with the actual selector for the confirmation number
    

    // Extract the confirmation number
    const confirmationNumber = await page.textContent("div p.text-green.pl-2"); // Replace with the actual selector for the confirmation number
    const price = await page.textContent("div.flex p span.block"); // Replace with the actual selector for the confirmation number
    console.log(confirmationNumber, " -- $", price.slice(1)) ;
  } catch (error) {
    console.log(error);
  }
}

module.exports = orderFromUSA;
