const getStoreId = require("./getStoreId");

async function login(username, password, page) {
  // Fill in the username
  await page.getByRole("textbox", { name: "Username" }).fill(username);

  // // Fill in the password
  await page.getByRole("textbox", { name: "Password" }).fill(password);

  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForTimeout(1000);
  await page.keyboard.press("Escape");
  // await page.click("#btn-login");
}

async function orderFromMFI(
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
  const storeId = await getStoreId(storeNumber);
  console.log(storeId);
  await page.fill("#cphBody_cphPageBody_txtCust", storeId);
  await page.keyboard.press("Enter");
  await page
    .getByRole("textbox", { name: "ENTER SEARCH CRITERIA" })
    .fill(itemNumber);
  await page.keyboard.press("Enter");
  await page.locator(".form_elements  span + input").fill(quantity);
  await page.getByRole("button", { name: "ADD TO CART " }).click();
  await page
    .locator("#cHeaderLoggedIn_divReturnRequestDesktop + .other .cart.active")
    .click();

  if (pickup === "true") {
    await page.locator("#WillcallP").click();
  }
  await page.locator("#divCheckOut").click();

  await page.locator(".inner div span input").fill(poNumber);

  const orderNumber = await page.textContent(
    "text=Order Placed, Order Number:"
  );
  console.log(orderNumber);
}

module.exports = orderFromMFI;
