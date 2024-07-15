window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  const historyContainer = document.getElementById("history-container");

  let historyState = localStorage.getItem("historyState");
  if (!historyState) {
    historyState = { history: [] };
  } else {
    historyState = JSON.parse(historyState);
  }
  createHistoryDivs(historyState.history, historyContainer);

  document
    .getElementById("clear-history-btn")
    .addEventListener("click", showConfirmModal);

  document
    .getElementById("confirm-clear-history")
    .addEventListener("click", clearHistory);
});

const createHistoryDivs = (historyArray, historyContainer) => {
  historyContainer.innerHTML = "";
  historyArray.reverse().forEach((historyItem) => {
    const historyDiv = document.createElement("div");
    historyDiv.classList.add("alert", "alert-primary");

    const confirmList = document.createElement("ul");
    confirmList.style.listStyle = "none";
    confirmList.style.marginBottom = "0";
    Object.values(historyItem).forEach((attr) => {
      console.log(attr);
      const li = document.createElement("li");
      li.innerText = attr;
      confirmList.appendChild(li);
    });

    historyDiv.appendChild(confirmList);
    historyContainer.appendChild(historyDiv);
  });
};
const addHistoryItem = () => {
  let historyState = localStorage.getItem("historyState");
  if (!historyState) {
    historyState = { history: [] };
  } else {
    historyState = JSON.parse(historyState);
  }

  const newHistoryItem = { eta: "5678", confirm: "no", price: 5678 };
  historyState.history.push(newHistoryItem);

  localStorage.setItem("historyState", JSON.stringify(historyState));
  const historyContainer = document.getElementById("history-container");
  createHistoryDivs(historyState.history, historyContainer);
};

const closeModal = () => {
  const confirmModal = document.getElementById("confirmModal");
  confirmModal.style.display = "none";
  confirmModal.style.opacity = 0;
};
const showConfirmModal = () => {
  const confirmModal = document.getElementById("confirmModal");
  confirmModal.style.display = "block";
  confirmModal.style.opacity = 100;
  // confirmModal.show();
};
const clearHistory = () => {
  const confirmModal = document.getElementById("confirmModal");
  confirmModal.style.display = "none";
  confirmModal.style.opacity = 0;

  localStorage.removeItem("historyState");
  const historyContainer = document.getElementById("history-container");
  createHistoryDivs([], historyContainer);
};

document.getElementById("close-modal-cancel").addEventListener('click', closeModal);
document.getElementById("close-modal-x").addEventListener('click', closeModal);
