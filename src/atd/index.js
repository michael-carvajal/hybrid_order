const getStoreId = require("./storeNumberAndIDS");

async function login(username, password, page) {
  // Fill in the username
  await page.fill("#j_username", username);

  // Fill in the password
  await page.fill("#j_password", password);

  await page.click("#btn-login");
}

async function searchForItem(page, itemNumber, quantity) {
  await page.fill("#global-search-input", itemNumber);
  await page.click("#global-search-button");
  await page.getByRole("textbox", { name: "Qty" }).fill(quantity);
  //   console.log("we found qty");
  const addToCart = await page.getByText(" Add to cart ").all();
  await addToCart[1].click();
  //   console.log("add to cart");
}

async function orderFromATD(
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
  let storeId;
  try {
    storeId = await getStoreId(storeNumber);
    //   console.log(storeId);
    await page.fill("#select-location", storeId);
    await page.click("#btn-continue");

    await searchForItem(page, itemNumber, quantity);
    await page.fill("#customerPO", poNumber);
    // Wait for the confirmation page to load
    await page.waitForSelector(".order-confirmation-message strong"); // Replace with the actual selector for the confirmation number

    // Extract the confirmation number
    const confirmationNumber = await page.textContent(
      ".order-confirmation-message strong"
    ); // Replace with the actual selector for the confirmation number
    console.log(confirmationNumber);
  } catch (error) {
    console.log(error);
  }
}

module.exports = orderFromATD;
