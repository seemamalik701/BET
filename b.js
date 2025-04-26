document.addEventListener("DOMContentLoaded", function() {
    const expenseForm = document.getElementById("expenseForm");
    const transactionList = document.getElementById("transactionList");
    const categoryInput = document.getElementById("category");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");
    const dateInput = document.getElementById("date");
    const expenseChart = document.getElementById("expenseChart").getContext("2d");
  
    let transactions = [];
  
    // Load saved transactions from local storage
    if (localStorage.getItem("transactions")) {
      transactions = JSON.parse(localStorage.getItem("transactions"));
      displayTransactions();
      updateChart();
    }
  
    // Add a new transaction
    expenseForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const category = categoryInput.value;
      const amount = parseFloat(amountInput.value);
      const type = typeInput.value;
      const date = dateInput.value;
  
      const transaction = { category, amount, type, date };
      transactions.push(transaction);
  
      localStorage.setItem("transactions", JSON.stringify(transactions));
  
      categoryInput.value = "";
      amountInput.value = "";
      typeInput.value = "income";
      dateInput.value = "";
  
      displayTransactions();
      updateChart();
    });
  
    // Display all transactions in the list
    function displayTransactions() {
      transactionList.innerHTML = "";
      transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${transaction.category}</strong><br>
          Type: ${transaction.type} | Amount: $${transaction.amount.toFixed(2)} | Date: ${transaction.date}
          <button class="deleteBtn" data-index="${index}">Delete</button>
        `;
        transactionList.appendChild(li);
      });
  
      // Delete transaction
      const deleteBtns = document.querySelectorAll(".deleteBtn");
      deleteBtns.forEach(btn => {
        btn.addEventListener("click", function() {
          const index = btn.getAttribute("data-index");
          transactions.splice(index, 1);
          localStorage.setItem("transactions", JSON.stringify(transactions));
          displayTransactions();
          updateChart();
        });
      });
    }
  
    // Update the expense chart with vibrant colors
    function updateChart() {
      const categories = {
        income: 0,
        expense: 0,
      };
  
      transactions.forEach(transaction => {
        if (transaction.type === "income") {
          categories.income += transaction.amount;
        } else {
          categories.expense += transaction.amount;
        }
      });
  
      new Chart(expenseChart, {
        type: "pie",
        data: {
          labels: ["Income", "Expenses"],
          datasets: [{
            data: [categories.income, categories.expense],
            backgroundColor: ["#FF7E5F", "#F44336"], // Vibrant colors for Income and Expenses
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }
  });
  