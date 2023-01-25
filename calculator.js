const clBtn = document.getElementById('cl-btn');
const ngtBtn = document.getElementById('ngt-btn');
const ersBtn = document.getElementById('ers-btn');
const ptBtn = document.getElementById('pt-btn');
const eqsBtn = document.getElementById('eqs-btn');

const numBtns = document.getElementsByClassName('num-btn');
const opBtns = document.getElementsByClassName('op-btn');

const screen = document.querySelector('.screen-content');

let internalScreenValue = 0;
let phantomMinus = false;
let phantomDecimalPoint = false;
let phantomZeroes = 0;
let equalsMemory = null;
let activeOp = null;
let calculatorMemory = null;
let liquidNumber = true;
// tells if the number on screen is to be overwritten on any number input
let clBtnMode = 0;
updateScreen();

function updateScreen() {
    let displedValue = '';
    if (phantomMinus) {
        displedValue += '-';
    }
    displedValue += internalScreenValue.toLocaleString();
    if (phantomDecimalPoint) {
        displedValue += '.';
    }
    for (i = 0; i < phantomZeroes; i++) {
        displedValue += '0';
    }
    screen.textContent = displedValue;
}


function numBtn() {
    clBtnMode = 1;
    clBtn.textContent = 'C';
    let appendedDigit = parseInt(this.id.substr(4));
    if (liquidNumber) {
        phantomDecimalPoint = false;
        phantomZeroes = 0;
        phantomMinus = false;
    }
    if (appendedDigit === 0) {
        if (!Number.isInteger(internalScreenValue) || phantomDecimalPoint) {
            phantomZeroes += 1;
            updateScreen();
            return;
        } else if (phantomMinus) {
            return;
        }
    }
    if (liquidNumber || (internalScreenValue === 0 && !phantomDecimalPoint && !phantomZeroes && !phantomMinus) ) {
        internalScreenValue = appendedDigit;
    } else {
        let updatedValue = '';
        if (phantomMinus) {
            updatedValue += '-';
            phantomMinus = false;
        }
        updatedValue += String(internalScreenValue);
        if (phantomDecimalPoint) {
            updatedValue += '.';
        }
        if (phantomZeroes) {
            updatedValue += '0'.repeat(phantomZeroes)
            phantomZeroes = 0;
        }
        updatedValue += String(appendedDigit);
        if (appendedDigit) {
            phantomDecimalPoint = false;
        }
        internalScreenValue = parseFloat(updatedValue);
    }
    liquidNumber = false;
    updateScreen();
}

for (let i = 0; i < numBtns.length; i++) {
    numBtns[i].addEventListener('click', numBtn, false);
}

clBtn.addEventListener('click', function() {
    phantomDecimalPoint = false;
    phantomZeroes = 0;
    phantomMinus = false;
    internalScreenValue = 0;
    liquidNumber = true;
    if (!clBtnMode) {
        equalsMemory = null;
        activeOp = null;
        calculatorMemory = null;
    } else {
        clBtnMode = 0;
        clBtn.textContent = 'AC';
    } 
    updateScreen();
})

ersBtn.addEventListener('click', function() {
    if (liquidNumber === true) {
        return;
    }
    if (phantomZeroes) {
        phantomZeroes -= 1;
        updateScreen();
        return;
    } else if (phantomDecimalPoint) {
        phantomDecimalPoint = false;
        updateScreen();
        return;
    } else if (phantomMinus) {
        phantomMinus = false; 
        updateScreen();
        return;
    } else if (!internalScreenValue) {
        return;
    }
    if (String(internalScreenValue).length === ((internalScreenValue) < 0 ? 2 : 1)) {
        internalScreenValue = 0;
        updateScreen();
        return;
    }
    if (!Number.isInteger(internalScreenValue)) {
        if (internalScreenValue === parseFloat(internalScreenValue.toFixed(1))) {
            phantomDecimalPoint = true;
        }
    }
    let erasedValue = String(internalScreenValue).substring(0, String(internalScreenValue).length - 1);
    if (String(parseFloat(erasedValue)).length < erasedValue.length) {
        let decimalSplit = erasedValue.split('.');
        phantomZeroes = decimalSplit[1].length;
        phantomDecimalPoint = true;
        if (erasedValue[0] === '-') {
            phantomMinus = true;
            erasedValue *= -1;
        }
    }
    if (Object.is(erasedValue, -0)) {
        internalScreenValue = 0;
        phantomMinus = true;
    }
    internalScreenValue = parseFloat(erasedValue);
    updateScreen();
})

function opBtn() {
    if (equalsMemory) {
        calculatorMemory = internalScreenValue;
        equalsMemory = null;
    }
    if (liquidNumber && !(calculatorMemory === null)) {
        activeOp = this.id.substr(0, 3);
        return;
    }
    if (calculatorMemory === null) {
        calculatorMemory = internalScreenValue;
        liquidNumber = true;
        activeOp = this.id.substr(0, 3);
    } else {
        internalScreenValue = operate(activeOp, calculatorMemory, internalScreenValue);
        calculatorMemory = internalScreenValue;
        liquidNumber = true;
        phantomMinus = false;
        phantomDecimalPoint = false;
        phantomZeroes = 0;
        activeOp = this.id.substr(0, 3);
        updateScreen();
    }
}

for (let i = 0; i < opBtns.length; i++) {
    opBtns[i].addEventListener('click', opBtn, false);
}

function operate(operator, num1, num2) {
    let firstOperand = parseFloat(num1);
    let secondOperand = parseFloat(num2);
    switch(operator) {
        case 'add':
            return firstOperand + secondOperand;
        case 'sub':
            return firstOperand - secondOperand;
        case 'mlt':
            return firstOperand * secondOperand;
        case 'div':
            return firstOperand / secondOperand;
        default:
            return 'ERROR';
    }
}

eqsBtn.addEventListener('click', function() {
    if (calculatorMemory === null) return;
    if (equalsMemory === null) {
        equalsMemory = internalScreenValue;
        internalScreenValue = operate(activeOp, calculatorMemory, internalScreenValue);
    } else {
        internalScreenValue = operate(activeOp, internalScreenValue, equalsMemory);
    }
    phantomMinus = false;
    phantomDecimalPoint = false;
    phantomZeroes = 0;
    liquidNumber = true;
    updateScreen();
})

ptBtn.addEventListener('click', function() {
    if (liquidNumber) {
        internalScreenValue = 0;
    }
    if (Number.isInteger(internalScreenValue)) {
        phantomDecimalPoint = true;
    }
    liquidNumber = false;
    clBtnMode = 1;
    clBtn.textContent = 'C';
    updateScreen();
})

ngtBtn.addEventListener('click', function() {
    if (internalScreenValue === 0) {
        phantomMinus = !phantomMinus;
        liquidNumber = false;
        updateScreen();
        return;
    } 
    internalScreenValue *= -1;
    updateScreen();
})

