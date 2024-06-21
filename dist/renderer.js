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
    const confirmDetails = document.querySelector("#confirmation-details");

    if (!errors.classList.contains("hidden")) {
      errors.classList.toggle("hidden");
      errors.innerText = "";
    } else if (!confirmDetails.classList.contains("hidden")) {
      confirmDetails.classList.toggle("hidden");
      confirmDetails.innerText = "";
    }

    const response = await window.electronAPI.runAutomation({
      vendor,
      storeNumber,
      itemNumber,
      poNumber,
      quantity,
      pickup,
    });
    console.log("response in rerender ========>", response);
    if (response.length === 1) {
      const ele = document.createElement("div");
      const errorCancel = document.createElement("div");
      errorCancel.setAttribute("id", "error-cancel");
      errorCancel.addEventListener("click", () => {
        errors.classList.toggle("hidden");
        errors.innerText = "";
      });
      errorCancel.innerText = "x";
      ele.innerText = response[0];
      errors.appendChild(errorCancel);
      errors.appendChild(ele);
      errors.classList.toggle("hidden");
    } else {
      response.forEach((element) => {
        const listEle = document.createElement("li");
        listEle.innerText = element;
        confirmDetails.appendChild(listEle);
      });
      confirmDetails.classList.toggle("hidden");
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
    if (!errors.classList.contains("hidden")) {
      errors.classList.toggle("hidden");
    }
    errors.innerText = "";
    confirmDetails.innerText = "";
    console.log("reset button cliked");
    await window.electronAPI.resetAutomation();
  });

document.addEventListener("DOMContentLoaded", function () {
  const pickup = document.getElementById("pickup");
  const truckIcon = document.getElementById("truckIcon");
  const personIcon = document.getElementById("personIcon");
  const errors = document.querySelector("#errors");
  const confirmDetails = document.querySelector("#confirmation-details");

  errors.classList.toggle("hidden");
  confirmDetails.classList.toggle("hidden");

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
