const getZipCode = require("./getZipCode");
async function login(username, password, page) {
  // Fill in the username
  await page.fill("#fldAccount", username);

  // Fill in the password
  await page.fill("#fldPassword", password);
  await page.getByRole("button", { name: "Sign In" }).click();
  // await page.getByRole("textbox");
}

async function orderFromTireRack(
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
  const zipCode = getZipCode(storeNumber);
  await page.goto(url);
  await page.locator('input[name="customerID"]').fill("MavisCorp");
  await page.locator("#passText").fill("Mavistire52!");
  await page.keyboard.press("Enter");
  // await page.getByText("click here").click();
  await page.waitForTimeout(2000)
  await page.goto(
    `https://www.tirerackwholesale.com/tires/TireSearchResults.jsp?Vnum=${itemNumber}&searchCriteria=partNum`
  );
  await page.getByText("Add To Cart").click();
  await page.waitForTimeout(3000)
  await page.getByRole("link", { name: "Begin Checkout" }).click();
  await page.waitForTimeout(3000)
  await page.goto(
    "https://www.tirerackwholesale.com/cart/WholesaleCorpSalesServlet?location=cart"
  );
  await page.waitForTimeout(3000)
  await page
  .getByRole("cell", { name: "Search by Store ZIP Code Go" })
  .getByRole("textbox")
  .fill(zipCode);
  await page.waitForTimeout(3000)
  await page.goto(
    "https://www.tirerackwholesale.com/cart/WholesaleCorpSalesServlet?customerType=A&searchType=zipCode&location=cart&searchParam=10562"
  );
  await page.getByRole("radio").check();
  await page.getByRole("button", {name : "Continue"}).click()
  await page.getByLabel("Ground Freight Carrier").check();
  await page.goto("https://www.tirerackwholesale.com/ssl/PaymentInfo.jsp");
  await page.getByLabel("Purchase Order #:").click();
  await page.getByLabel("Purchase Order #:").fill("123");
  await page.locator('input[name="userName"]').click();
  await page.locator('input[name="userName"]').fill("MC");
  await page.getByRole("combobox").selectOption("Zig");
}

module.exports = orderFromTireRack;
