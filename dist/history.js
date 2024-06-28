// history.js

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
  
    document.getElementById("add-history-btn").addEventListener("click", addHistoryItem);
  });
  
  const createHistoryDivs = (historyArray, historyContainer) => {
    historyContainer.innerHTML = '';
    historyArray.forEach((historyItem, index) => {
      const historyDiv = document.createElement("div");
      historyDiv.innerText = `History ${index + 1}: ETA ${historyItem.eta}, Confirm ${historyItem.confirm}, Price ${historyItem.price}`;
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
  