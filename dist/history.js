// history.js

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  const historyContainer = document.getElementById("history-container");

  let historyState = localStorage.getItem("historyState");
  if (!historyState) {
    historyState = dummyData;
  } else {
    historyState = JSON.parse(historyState);
  }
  createHistoryDivs(historyState, historyContainer);

  document
    .getElementById("add-history-btn")
    .addEventListener("click", addHistoryItem);
});

const createHistoryDivs = (historyState, historyContainer) => {
  for (const [store, value] of Object.entries(historyState)) {
    console.log(`${store}: ${value}`);
    const historyDiv = document.createElement("div");
    historyDiv.innerText = `${store} history div: ETA ${value.eta}, Confirm ${value.confrim}, Price ${value.price}`;
    historyContainer.appendChild(historyDiv);
  }
};

const dummyData = {
  1: { eta: "1234", confrim: "yes", price: 1234 },
  2: { eta: "1234", confrim: "yes", price: 1234 },
  100: { eta: "1234", confrim: "yes", price: 1234 },
};

const addHistoryItem = () => {
  let historyState = localStorage.getItem("historyState");
  if (!historyState) {
    historyState = dummyData;
  } else {
    historyState = JSON.parse(historyState);
  }

  const newKey = Object.keys(historyState).length + 1;
  historyState[newKey] = { eta: "5678", confrim: "no", price: 5678 };

  localStorage.setItem("historyState", JSON.stringify(historyState));
  const historyContainer = document.getElementById("history-container");
  historyContainer.innerHTML = "";
  createHistoryDivs(historyState, historyContainer);
};
