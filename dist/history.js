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
  
    document
      .getElementById("add-history-btn")
      .addEventListener("click", addHistoryItem);
  });
  
  const createHistoryDivs = (historyArray, historyContainer) => {
    historyContainer.innerHTML = "";
    historyArray.reverse().forEach((historyItem) => {
      const historyDiv = document.createElement("div");
      historyDiv.classList.add("alert", "alert-primary");
      
      const confirmList = document.createElement("ul");
      confirmList.style.listStyle = 'none'
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
  