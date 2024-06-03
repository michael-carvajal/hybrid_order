// renderer.js
document
  .getElementById("order-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const vendor = document.getElementById("vendor").value.toUpperCase().trim();
    const poNumber = document.getElementById("poNumber").value.trim();
    const storeNumber = poNumber.split("-")[0];
    const itemNumber = document.getElementById("itemNumber").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const pickup = document.getElementById("pickup").value;

    await window.electronAPI.runAutomation({
      vendor,
      storeNumber,
      itemNumber,
      poNumber,
      quantity,
      pickup
    });
  });

document
  .getElementById("reset-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    document.getElementById("order-form").reset();
    console.log("reset button cliked");
    await window.electronAPI.resetAutomation();
  });

document.addEventListener("DOMContentLoaded", function () {
  const pickup = document.getElementById("pickup");
  const truckIcon = document.getElementById("truckIcon");
  const personIcon = document.getElementById("personIcon");

  function updateIcons() {
    if (pickup.checked) {
      // Pick up is true
      pickup.value = "true";
      truckIcon.style.display = "none";
      personIcon.style.display = "inline";
    } else {
      // Pick up is false (delivery)
      pickup.value = "false";
      truckIcon.style.display = "inline";
      personIcon.style.display = "none";
    }
  }

  // Initial call to set the correct icons on page load
  updateIcons();

  // Add event listener for when the pickup is clicked
  pickup.addEventListener("change", updateIcons);
});
