const getZipCode = require("./getZipCode");
async function login(username, password, page) {
  await page.locator('input[name="customerID"]').fill(username);
  await page.locator("#passText").fill(password);
  await page.keyboard.press("Enter");
  // await page.getByText("click here").click();
  await page.waitForTimeout(2000);
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
  await login(username, password, page);
  await page.goto(
    `https://www.tirerackwholesale.com/tires/TireSearchResults.jsp?Vnum=${itemNumber}&searchCriteria=partNum`
  );
  await page.locator("#i1_Qty0").selectOption(quantity);
  await page.getByText("Add To Cart").click();
  await page.getByRole("link", { name: "Begin Checkout" }).click();
  await page.goto(
    "https://www.tirerackwholesale.com/cart/WholesaleCorpSalesServlet?location=cart"
  );
  await page
    .getByRole("cell", { name: "Search by Store ZIP Code Go" })
    .getByRole("textbox")
    .fill(zipCode);
  await page.goto(
    `https://www.tirerackwholesale.com/cart/WholesaleCorpSalesServlet?customerType=A&searchType=zipCode&location=cart&searchParam=${zipCode}`
  );
  // // Wait for the div elements containing the store numbers
  // await page.waitForSelector(" table form table tbody tr");
  // await page.waitForTimeout(500);

  const storeError = await page.evaluate((storeNumber) => {
    // Get all tr elements within the table
    const rows = document.querySelectorAll("form table tbody tr");
    console.log(rows);

    // Convert NodeList to Array and find the exact match
    const exactRow = Array.from(rows).find((row) => {
      const text = row.textContent || row.innerText;
      // Check if the row contains the string "- ${storeNumber}"
      return text.includes(` ${storeNumber}`);
    });

    // Click on the radio button if the row is found
    if (exactRow) {
      const radioButton = exactRow.querySelector('input[type="radio"]');
      if (radioButton) {
        radioButton.click();
        return null;
      } else {
        return `Radio button for store ${storeNumber} could not be found`;
      }
    } else {
      return `Store ${storeNumber} could not be found`;
    }
  }, storeNumber);
  console.log(storeError);
  if (storeError) {
    return {error : [storeError]}
  }
  await page.getByRole("button", { name: "Continue" }).click();
  // await page.getByLabel("Ground Freight Carrier").check();
  // await page.goto("https://www.tirerackwholesale.com/ssl/PaymentInfo.jsp");
  await page.getByLabel("Purchase Order #:").fill(poNumber);
  await page.getByRole("combobox").selectOption("Zig");
}

module.exports = orderFromTireRack;
