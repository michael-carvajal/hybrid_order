const getStoreId = require("./getStoreId");

async function login(username, password, page) {
  // Fill in the username
  await page.getByPlaceholder("Email or Alias").fill(username);

  // Fill in the password
  await page.getByPlaceholder("Password").fill(password);

  await page.click("#send2");
}

async function searchForItem(page, itemNumber, quantity) {
  const itemInput = await page.getByPlaceholder(
    "Search for Size and Brand, Model etc. or Item #"
  );
  await itemInput.waitFor({ state: "visible" });
  itemInput.fill(itemNumber);
  await page.keyboard.press("Enter");
  //   await page.getByRole("textbox", { name: "Qty" }).fill(quantity);
  //   console.log("we found qty");
  //   const addToCart = await page.getByText(" Add to cart ").all();
  //   await addToCart[1].click();
  //   console.log("add to cart");
}

async function orderFromTirehub(
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
    const changeStore = await page.getByRole("link", { name: "Change" });
    await changeStore.waitFor({ state: "visible" });
    await changeStore.click();
    const storeInput = await page.getByPlaceholder("Store Search");
    await storeInput.waitFor({ state: "visible" });
    await storeInput.fill(storeId);
    await page.locator(".store-item__action a").click();

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

module.exports = orderFromTirehub;
