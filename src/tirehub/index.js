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
  const cartPrice = await page.textContent(".cart-price");

  await page.getByPlaceholder("PO Number (optional)").click();
  await page.getByPlaceholder("PO Number (optional)").fill(poNumber);
  if (pickup === "true") {
    await page.locator("#shopping-cart-table").getByText("Will Call").click();
    // await page.locator('div:nth-child(2) > .shipping-method > .shippig-method-radio').click();
  }
  const orderNumber = await page.textContent(".order-number strong");
  console.log("order number or tire hub ", orderNumber.split(""));
  const isZeroPrice = cartPrice.indexOf("$0.00") > 0 ? "" : cartPrice
  return {
    confirmation: [
      `Order # ${orderNumber.split("\n")[1].trim()}`,
      isZeroPrice,
      pickup === "true" ? "Order set for pick up" : "",
    ],
  };
}

module.exports = orderFromTirehub;
