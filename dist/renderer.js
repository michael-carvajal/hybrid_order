// renderer.js
document
  .getElementById("order-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const vendor = document.getElementById("vendor").value.toUpperCase().trim();
    const storeNumber = document.getElementById("storeNumber").value.trim();
    const itemNumber = document.getElementById("itemNumber").value.trim();
    const poNumber = document.getElementById("poNumber").value.trim();
    const quantity = document.getElementById("quantity").value.trim();

    await window.electronAPI.runAutomation({
      vendor,
      storeNumber,
      itemNumber,
      poNumber,
      quantity,
    });
  });

document.getElementById("reset-button").addEventListener("click", async () => {
  document.getElementById("order-form").reset();
  console.log('reset button cliked');
  await window.electronAPI.resetAutomation();
});
