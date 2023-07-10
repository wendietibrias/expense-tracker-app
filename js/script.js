//constanta
const idListItem = 'AabbCckK3PMnOsMpzJkDa931PpepeGKZGKBzmN6';

//data
let dataTransactions = JSON.parse(localStorage.getItem("transaction")) || [];

//DOMElement
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

const displayIncome = document.getElementById('income-display');
const displayExpense = document.getElementById('expense-display');
const displayBalance = document.getElementById('balance-display');

const historyContainer = document.querySelector('.history-container');

const addTransactionBtn = document.getElementById('add-transaction');

//utility function
function generateRandomID() {
   let id = '';

   for(let i = 0; i < 6; i++) {
      id += idListItem[Math.floor(Math.random() * idListItem.length)];
   }

   return id;
}

function clearInput() {
    textInput.value = '';
    typeInput.value = '';
    amountInput.value = '';
}

function convertMoneyFormat(amount) {
    return new Intl.NumberFormat('en-US', {
        style:'currency',
        currency:'USD'
    }).format(amount);
}


//html display function
function displayTransactionHTML(data) {
     return `
       <div data-id="${data.id}" class="w-full flex items-center gap-x-3">
       <div class="flex-1 bg-white  py-2 px-3 shadow-md flex justify-between items-center  shadow-gray-300 border-r-4 ${data.type === 'expense' ? 'border-red-500' : 'border-green-500' }">
       <p class="text-[13px] font-medium text-gray-800">${data.title}</p>
       <p class="font-bold text-[14px] text-gray-800">${convertMoneyFormat(data.amount)}</p>
       </div>
       <button class="delete-btn">
        <i  class="ri-delete-bin-7-line text-red-500"></i>
       </button>
       </div>
     `;
}

//action function
function getAllTransaction() {

    //display income total and expense total
    const filterIncome = dataTransactions.filter((transaction) => transaction.type === 'income').reduce((a,b)=>a+b.amount,0);
    const filterExpense = dataTransactions.filter((transaction) => transaction.type === 'expense').reduce((a,b)=>a+b.amount,0);
    
    displayIncome.innerHTML = convertMoneyFormat(Number(filterIncome));
    displayExpense.innerHTML = convertMoneyFormat(Number(filterExpense));
    displayBalance.innerHTML = convertMoneyFormat(Number(filterIncome) - Number(filterExpense));
 
    //render transactions list
    let temp = '';
    dataTransactions.map((transaction) => temp += displayTransactionHTML(transaction));
    historyContainer.innerHTML = temp;

    //behavior
    const deleteBtn = document.querySelectorAll('.delete-btn');
    deleteBtn.forEach((button) => {
         button.addEventListener('click'  , deleteTransaction);
    });
}

function addTransaction() {
    if(textInput.value === '' || amountInput.value === '' || typeInput.value === '') {
        return alert('please complete field');
    }

    if(typeInput.value === 'Choose the type') {
        return alert('please complete field');
    }

    const objectTransaction = {
        id:generateRandomID(),
        title:textInput.value,
        amount:Number(amountInput.value),
        type:typeInput.value
    }

    dataTransactions.push(objectTransaction);
    localStorage.setItem('transaction',JSON.stringify(dataTransactions));

    clearInput();
    getAllTransaction();

}

function deleteTransaction() {
     const id = this.parentElement.dataset.id;
     const deleteData = dataTransactions.filter((transaction) => transaction.id === id ? "" : transaction);
     dataTransactions = deleteData;
     localStorage.setItem("transaction" , JSON.stringify(dataTransactions));
     getAllTransaction();
}

window.addEventListener('DOMContentLoaded' , getAllTransaction);
addTransactionBtn.addEventListener('click' , addTransaction);
