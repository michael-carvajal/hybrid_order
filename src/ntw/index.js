function getStoreNumber(storeNumber) {
  // Add leading zeroes based on the length of the storeNumber
  if (storeNumber.length === 1) {
    storeNumber = "000" + storeNumber;
  } else if (storeNumber.length === 2) {
    storeNumber = "00" + storeNumber;
  } else if (storeNumber.length === 3) {
    storeNumber = "0" + storeNumber;
  }

  return storeNumber;
}

async function login(username, password, page) {
  // Fill in the username
  await page.fill("#fldAccount", username);

  // Fill in the password
  await page.fill("#fldPassword", password);
  await page.getByRole("button", { name: "Sign In" }).click();
  // await page.getByRole("textbox");
}

async function orderFromNTW(
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
  await page.waitForTimeout(10000);
  // Retrieve all elements that match the text "Home Account"
  const clicker = await page.getByText("Home Account").all();

  // Wait for the last element to be visible
  const lastHomeAccount = clicker[clicker.length - 1];
  await lastHomeAccount.waitFor({ state: "visible" });

  // Click on the last element
  await lastHomeAccount.click();

  await page.keyboard.type(getStoreNumber(storeNumber));
  await page.keyboard.press("Enter");
  try {
    const tireParts = await page.getByText("Tire Part #").all();
    await page.waitForTimeout(3000);
    const partField = tireParts[0];

    await partField.click();
    await page.fill("#fldSearchPart", itemNumber);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    // await page.keyboard.press("Tab");
    // await page.waitForTimeout(3000);
    // await page.keyboard.press("Enter");
    await page.getByRole("textbox", { name: "Qty" }).fill(quantity);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.getByRole("link", { name: "Checkout" }).click();
    await page.fill("#fldCheckoutPO", poNumber);
    const unitPrice = await page.locator(".cost.price.text-right").innerText();
    await page.waitForTimeout(5000);
    await page.waitForSelector("#dlgOrderLinesTable");

    // Get the confirmation number from the first tr -> td element
    const confirmationNumber = await page
      .locator("#dlgOrderLinesTable > tr:first-child > td:first-child")
      .innerText();

    console.log("Confirmation Number:", confirmationNumber);
    // Get the price from the fourth td in the third tr
    const netPrice = await page
      .locator("#dlgOrderLinesTable > tr:nth-child(3) > td:nth-child(4)")
      .innerText();
    if (netPrice === "$0") {
      console.log("Net Price:", netPrice);
    } else {
      console.log("Unit Price: $ ", unitPrice.slice(1));

    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = orderFromNTW;
