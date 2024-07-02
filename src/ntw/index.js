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
  poNumber,
  pickup
) {
  await page.goto(url);
  await login(username, password, page);
  // Store Search
  let storeId = getStoreNumber(storeNumber);
  // await page.waitForTimeout(10000);

  await page.locator("a").filter({ hasText: "Home Account" }).click();
  await page
    .locator("#panelCorporateAccounts .chosen-search input")
    .fill(storeId);
  await page.locator("#panelCorporateAccounts .chosen-search input").type(" ");
  // await page.waitForTimeout(5000);
  await page.keyboard.press("Enter");
  // Tire Search
  await page.getByRole("link", { name: "Tire Part #" }).click();
  await page.getByPlaceholder("Part Number", { exact: true }).click();
  await page.getByPlaceholder("Part Number", { exact: true }).fill(itemNumber);
  await page.getByPlaceholder("Part Number", { exact: true }).press("Enter");
  await page.getByPlaceholder("Qty").click();
  await page.getByPlaceholder("Qty").fill(quantity);
  await page.getByPlaceholder("Qty").press("Enter");
  await page.getByRole("link", { name: "  Checkout" }).click();
  // Checkout
  const price =  await page.textContent("#items > tbody > tr.itemrow > td.cost.price.text-right");
  const eta =  await page.textContent("#deliveryOneDay > span:nth-child(1)");
  
  await page.getByPlaceholder("purchase order").click();
  await page.getByPlaceholder("purchase order").fill(poNumber);
  if (pickup === "true") {
    await page.getByLabel("Will Call").check();
  }
  const confNums =  await page.textContent(`#dlgOrderLinesTable > tr:nth-child(2) > td:nth-child(2)`);
  const netPrice =  await page.textContent(`#dlgOrderLinesTable > tr:nth-child(3) > td:nth-child(4)`);
  const unitCost = netPrice === "$0" ? netPrice : price
  console.log(" ntw price ======>",price);
  return {confirmation : [`Order # ${confNums}`, `Unit Cost ${unitCost}`, pickup === "true" ? "Order set for pick up" : eta]}

 }

module.exports = orderFromNTW;
