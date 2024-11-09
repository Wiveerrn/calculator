const calculatorScreen = document.querySelector('.calculator-screen');
const buttons = document.querySelectorAll('.btn');
const amountButtons = document.querySelectorAll('.amount-btn');
const currentAmountDisplay = document.getElementById('current-amount');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn'); // 「履歴をクリア」ボタンを取得

let currentInput = '';
let totalAmount = 0;
let history = [];

// ページ読み込み時にLocalStorageから履歴を読み込む
window.addEventListener('load', () => {
    loadHistory();
    updateCurrentAmount();
});

buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        const value = this.value;

        if (value === 'clear') {
            currentInput = '';
            calculatorScreen.value = '';
            totalAmount = 0; // 現在の金額を0にリセット
            updateCurrentAmount(); // 表示を更新
            // 履歴はクリアしません
        } else if (value === 'backspace') {
            currentInput = currentInput.slice(0, -1);
            calculatorScreen.value = currentInput;
        } else if (value === '=') {
            if (currentInput !== '') {
                try {
                    let result = eval(currentInput);
                    calculatorScreen.value = result;
                    addHistory(currentInput, result);
                    currentInput = result.toString();
                    totalAmount = parseFloat(result);
                    updateCurrentAmount();
                } catch (error) {
                    calculatorScreen.value = 'エラー';
                    currentInput = '';
                }
            }
        } else {
            currentInput += value;
            calculatorScreen.value = currentInput;
        }
    });
});

amountButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const value = this.value;
        currentInput += value;
        calculatorScreen.value = currentInput;
    });
});

function updateCurrentAmount() {
    currentAmountDisplay.textContent = totalAmount;
}

function addHistory(expression, result) {
    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
        timestamp: timestamp,
        expression: expression,
        result: result
    };
    history.unshift(historyItem); // 配列の先頭に追加
    updateHistoryDisplay();
    saveHistory();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.timestamp} : ${item.expression} = ${item.result}`;
        historyList.appendChild(listItem);
    });
}

// 履歴をLocalStorageに保存
function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// LocalStorageから履歴を読み込み
function loadHistory() {
    const storedHistory = localStorage.getItem('calculatorHistory');
    if (storedHistory) {
        history = JSON.parse(storedHistory);
        updateHistoryDisplay();
    }
}

// 履歴をクリア
function clearHistory() {
    history = [];
    updateHistoryDisplay();
    localStorage.removeItem('calculatorHistory');
}

// 「履歴をクリア」ボタンのクリックイベントを追加
clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
});
