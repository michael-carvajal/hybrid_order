const getStoreId = require("./storeNumberAndIDS");

async function login(username, password, page) {
  // Fill in the username
  await page.fill("#j_username", username);

  // Fill in the password
  await page.fill("#j_password", password);

  await page.click("#btn-login");
}

async function searchForItem(page, itemNumber, quantity) {
  try {
    await page.fill("#global-search-input", itemNumber);
    await page.click("#global-search-button");
    await page.getByRole("textbox", { name: "Qty" }).fill(quantity);
    const addToCart = await page.getByText(" Add to cart ").all();
    await addToCart[1].click();
  } catch (error) {
    return ["Item not found"];
  }
}

async function orderFromATD(
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
  let storeId, errors;
  try {
    storeId = await getStoreId(storeNumber);
    if (!storeId) {
      return { error: ["Store cannot be found"] };
    }
    //   console.log(storeId);
    await page.fill("#select-location", storeId);
    await page.click("#btn-continue");

    const itemError = await searchForItem(page, itemNumber, quantity);
    if (itemError) {
      return { error: itemError };
    }

    await page.fill("#customerPO", poNumber);
    if (pickup === "true") {
      await page.getByText("Customer Pickup").click();
    }
    // Wait for the confirmation page to load
    await page.waitForSelector(".order-confirmation-message strong"); // Replace with the actual selector for the confirmation number

    // Extract the confirmation number
    const confirmationNumber = await page.textContent(
      ".order-confirmation-message strong"
    ); // Replace with the actual selector for the confirmation number
    const confNumParsed = confirmationNumber.split(" ").at(-1);
    const eta = await page.textContent(".estDeliveryDate")
    return {
      confirmation: [
        `Confirmation number # ${confNumParsed}`,
        pickup === "true" ? "Order set for will call" : `ETA is ${eta.trim()}`,
      ],
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = orderFromATD;
