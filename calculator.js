// DOM Elements
let display = document.getElementById('result');
let expressionDisplay = document.getElementById('expression');
let themeIcon = document.getElementById('theme-icon');
let scientificPanel = document.getElementById('scientific-panel');
let sciToggle = document.getElementById('sci-toggle');
let historyPanel = document.getElementById('history-panel');
let historyToggle = document.getElementById('history-toggle');
let historyList = document.getElementById('history-list');
let memoryIndicator = document.getElementById('memory-indicator');
let particlesContainer = document.getElementById('particles');

// Calculator State
let currentExpression = '';
let memoryValue = 0;
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
let isScientificMode = false;

// Initialize calculator
function initCalculator() {
    updateHistoryDisplay();
    createParticles();
    updateMemoryIndicator();
   
    // Check for saved theme
    if (localStorage.getItem('calculatorTheme') === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

// Display functions
function appendToDisplay(value) {
    // Handle special values
    if (value === 'Math.PI') value = Math.PI.toString();
    if (value === 'Math.E') value = Math.E.toString();
   
    display.value += value;
    currentExpression += value;
    expressionDisplay.textContent = currentExpression;
}

function clearDisplay() {
    display.value = '';
    currentExpression = '';
    expressionDisplay.textContent = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);
    expressionDisplay.textContent = currentExpression;
}

// Calculation function
function calculate() {
    try {
        // Replace × with * for calculation
        let expression = display.value.replace(/×/g, '*');
       
        // Basic validation to prevent malicious code execution
        if (!isValidExpression(expression)) {
            throw new Error('Invalid expression');
        }
       
        let result = eval(expression);
       
        // Handle division by zero and other math errors
        if (!isFinite(result)) {
            throw new Error('Math error');
        }
       
        // Format result
        if (Number.isInteger(result)) {
            display.value = result;
        } else {
            display.value = parseFloat(result.toFixed(10));
        }
       
        // Add to history
        addToHistory(expression, display.value);
       
        // Update expression display
        currentExpression = '';
        expressionDisplay.textContent = '';
       
        // Add visual feedback
        addCalculationEffect();
       
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            clearDisplay();
        }, 1500);
    }
}

// Enhanced validation
function isValidExpression(expr) {
    // More comprehensive validation
    const validChars = /^[0-9+\-*/.() MathPIEsincostanlogsqrt]+$/;
    const balancedParens = (expr.match(/\(/g) || []).length === (expr.match(/\)/g) || []).length;
   
    return validChars.test(expr) && balancedParens;
}

// History functions
function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toLocaleString()
    };
   
    history.unshift(historyItem);
   
    // Keep only last 20 items
    if (history.length > 20) {
        history.pop();
    }
   
    // Save to localStorage
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
   
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = '';
   
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
            <div class="history-timestamp">${item.timestamp}</div>
        `;
       
        historyItem.addEventListener('click', () => {
            display.value = item.result;
            currentExpression = item.result.toString();
            expressionDisplay.textContent = '';
        });
       
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    history = [];
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    updateHistoryDisplay();
}

// Memory functions
function memoryAdd() {
    const currentValue = parseFloat(display.value) || 0;
    memoryValue += currentValue;
    updateMemoryIndicator();
}

function memorySubtract() {
    const currentValue = parseFloat(display.value) || 0;
    memoryValue -= currentValue;
    updateMemoryIndicator();
}

function memoryRecall() {
    display.value = memoryValue;
    currentExpression = memoryValue.toString();
    expressionDisplay.textContent = '';
}

function memoryClear() {
    memoryValue = 0;
    updateMemoryIndicator();
}

function updateMemoryIndicator() {
    if (memoryValue !== 0) {
        memoryIndicator.style.color = 'var(--accent-color)';
        memoryIndicator.title = `Memory: ${memoryValue}`;
    } else {
        memoryIndicator.style.color = 'var(--text-secondary)';
        memoryIndicator.title = 'Memory is empty';
    }
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('light-theme');
   
    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('calculatorTheme', 'light');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('calculatorTheme', 'dark');
    }
   
    // Update particles for new theme
    createParticles();
}

// Scientific mode toggle
function toggleScientific() {
    isScientificMode = !isScientificMode;
    scientificPanel.classList.toggle('active');
   
    if (isScientificMode) {
        sciToggle.style.background = 'var(--accent-color)';
    } else {
        sciToggle.style.background = 'var(--sci-bg)';
    }
}

// History panel toggle
function toggleHistory() {
    historyPanel.classList.toggle('active');
}

// Visual effects
function addCalculationEffect() {
    const displayContainer = document.querySelector('.display-container');
    displayContainer.style.boxShadow = '0 0 20px var(--equals-glow)';
   
    setTimeout(() => {
        displayContainer.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.3)';
    }, 500);
}

function createParticles() {
    particlesContainer.innerHTML = '';
    const particleCount = 50;
   
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
       
        // Random properties
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 20 + 10;
        const animationDelay = Math.random() * 5;
       
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
       
        // Theme-based color
        if (document.body.classList.contains('light-theme')) {
            particle.style.background = 'var(--accent-color)';
        }
       
        particlesContainer.appendChild(particle);
    }
}

// Enhanced keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
   
    // Prevent default for calculator keys
    if (['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','Enter','=','Escape','Backspace','(',')'].includes(key)) {
        event.preventDefault();
    }
   
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
        addButtonEffect(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
        addButtonEffect(key === '*' ? 'multiply' :
                        key === '/' ? 'divide' :
                        key === '+' ? 'add' : 'subtract');
    } else if (key === '.') {
        appendToDisplay('.');
        addButtonEffect('decimal');
    } else if (key === 'Enter' || key === '=') {
        calculate();
        addButtonEffect('equals');
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
        addButtonEffect('clear');
    } else if (key === 'Backspace') {
        deleteLast();
        addButtonEffect('delete');
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    } else if (key === 'm' || key === 'M') {
        // Memory functions with Ctrl
        if (event.ctrlKey) {
            if (event.shiftKey) {
                memoryAdd();
            } else if (event.altKey) {
                memorySubtract();
            } else {
                memoryRecall();
            }
        }
    } else if (key === 's' || key === 'S') {
        // Toggle scientific mode with Ctrl
        if (event.ctrlKey) {
            toggleScientific();
        }
    } else if (key === 't' || key === 'T') {
        // Toggle theme with Ctrl
        if (event.ctrlKey) {
            toggleTheme();
        }
    } else if (key === 'h' || key === 'H') {
        // Toggle history with Ctrl
        if (event.ctrlKey) {
            toggleHistory();
        }
    }
});

// Button press effect
function addButtonEffect(action) {
    const button = document.querySelector(`[data-action="${action}"]`) ||
                   document.querySelector(`[data-value="${action}"]`);
   
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// Event listeners
themeIcon.addEventListener('click', toggleTheme);
sciToggle.addEventListener('click', toggleScientific);
historyToggle.addEventListener('click', toggleHistory);

// Memory functions attached to buttons (you would need to add these buttons to HTML)
document.addEventListener('DOMContentLoaded', function() {
    // Add memory buttons if they exist
    const memoryAddBtn = document.querySelector('[data-action="memory-add"]');
    const memorySubtractBtn = document.querySelector('[data-action="memory-subtract"]');
    const memoryRecallBtn = document.querySelector('[data-action="memory-recall"]');
    const memoryClearBtn = document.querySelector('[data-action="memory-clear"]');
   
    if (memoryAddBtn) memoryAddBtn.addEventListener('click', memoryAdd);
    if (memorySubtractBtn) memorySubtractBtn.addEventListener('click', memorySubtract);
    if (memoryRecallBtn) memoryRecallBtn.addEventListener('click', memoryRecall);
    if (memoryClearBtn) memoryClearBtn.addEventListener('click', memoryClear);
});

// Initialize calculator when page loads
window.onload = initCalculator;
