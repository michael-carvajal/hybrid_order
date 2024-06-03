const getStoreId = require("./getStoreId");

async function login(username, password, page) {
  // Fill in the username
  await page.getByPlaceholder("Email or Alias").fill(username);

  // Fill in the password
  await page.getByPlaceholder("Password").fill(password);

  await page.click("#send2");
}

async function searchForItem(page, itemNumber) {
  await page.getByText("Search for Size and Brand,").click();
  await page.getByPlaceholder("Search for Size and Brand,").fill(itemNumber);
  await page.getByPlaceholder("Search for Size and Brand,").press("Enter");
}
async function searchForStore(page, storeNumber) {
  let storeId;

  storeId = getStoreId(storeNumber);
  await page.getByRole("link", { name: "Change" }).click();
  await page.getByPlaceholder("Store Search").click();
  await page.getByPlaceholder("Store Search").fill(storeId);

  const chooseButton = await page.getByText("Choose", { exact: true });

  // Check if the button has the class "disabled"
  const isDisabled = await chooseButton.evaluate((button) =>
    button.classList.contains("disabled")
  );
  console.log(chooseButton, isDisabled);
  if (isDisabled) {
    await page.locator("#modal-template .header-content button").click();
  } else {
    await chooseButton.click();
  }
}

async function insertQuantity(page, quantity) {
  await page.getByRole("textbox", { name: "QTY" }).click();
  await page.getByRole("textbox", { name: "QTY" }).fill(quantity);
  await page.getByRole("textbox", { name: "QTY" }).press("Enter");
  await page.getByRole("button", { name: "Checkout" }).click();
}

async function orderFromTirehub(
  page,
  url,
  storeNumber,
  itemNumber,
  quantity,
  username,
  password,
  poNumber,
  pickup
) {
  await page.goto(url);
  await login(username, password, page);
  await searchForStore(page, storeNumber);
  await searchForItem(page, itemNumber, quantity);
  await insertQuantity(page, quantity);

  await page.getByPlaceholder("PO Number (optional)").click();
  await page.getByPlaceholder("PO Number (optional)").fill(poNumber);
  if (pickup === "true") {
    await page.locator("#shopping-cart-table").getByText("Will Call").click();
    // await page.locator('div:nth-child(2) > .shipping-method > .shippig-method-radio').click();
  }
  // try {
  //   await searchForItem(page, itemNumber, quantity);
  //   await searchForStore(page, storeNumber);
  //   await insertQuantity(page, quantity);

  //   await page.locator(".primary-btn.medium").click();
  //   await page.fill("#customerPO", poNumber);
  //   // Wait for the confirmation page to load
  //   await page.waitForSelector(".order-confirmation-message strong"); // Replace with the actual selector for the confirmation number

  //   // Extract the confirmation number
  //   const confirmationNumber = await page.textContent(
  //     ".order-confirmation-message strong"
  //   ); // Replace with the actual selector for the confirmation number
  //   console.log(confirmationNumber);
  // } catch (error) {
  //   console.log(error);
  // }
}

module.exports = orderFromTirehub;
