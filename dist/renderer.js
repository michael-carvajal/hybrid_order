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
    const errors = document.querySelector("#errors");

    const runningErrors = await window.electronAPI.runAutomation({
      vendor,
      storeNumber,
      itemNumber,
      poNumber,
      quantity,
      pickup,
    });

    if (runningErrors.length > 0) {
      errors.classList.toggle("hidden");
      errors.innerText = runningErrors[0];
    }
  });

document
  .getElementById("reset-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    document.getElementById("order-form").reset();
    pickup.value = "false";
    truckIcon.style.display = "inline";
    personIcon.style.display = "none";
    errors.innerText = "";
    errors.classList.toggle("hidden")
    console.log("reset button cliked");
    await window.electronAPI.resetAutomation();
  });

document.addEventListener("DOMContentLoaded", function () {
  const pickup = document.getElementById("pickup");
  const truckIcon = document.getElementById("truckIcon");
  const personIcon = document.getElementById("personIcon");
  const errors = document.querySelector("#errors");

  errors.classList.toggle("hidden");

  function updateIcons() {
    if (pickup.checked) {
      // Pick up is true
      pickup.value = "true";
      truckIcon.style.display = "none";
      personIcon.style.display = "inline";
    } else {
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
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("change", async () => {
  const isDarkMode = darkModeToggle.checked;
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("light-mode", !isDarkMode);
});
