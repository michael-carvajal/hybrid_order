const getStoreId = require("./getStoreId");

async function login(username, password, page) {
  await page.getByLabel("Email address:", { exact: true }).fill(username);
  await page.getByLabel("Password:").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
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

async function orderFromKAndM(
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
  const storeCode = getStoreId(storeNumber);
  const stores = await page.getByRole("link").all();
  // await stores[0].click()
  await page.getByRole("button", { name: "MAVIS #" }).hover();
  await page.getByRole("textbox", { name: "Search..." }).fill(storeCode);
  // await page.getByRole("textbox", { name: "Search..." }).type(" "); extra space
  const storeLinks = await page.locator(`text=/${storeCode}/i`).all();
  await storeLinks[0].click();
  console.log(stores);

  // await page.getByLabel("Part Number").click();
  // await page.getByLabel("Part Number").fill("212290");
  // await page.getByLabel("Part Number").press("Enter");
}

module.exports = orderFromKAndM;
