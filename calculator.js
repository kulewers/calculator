const clBtn = document.getElementById('cl-btn');
const ngtBtn = document.getElementById('ngt-btn');
const ersBtn = document.getElementById('ers-btn');
const ptBtn = document.getElementById('pt-btn');
const eqsBtn = document.getElementById('eqs-btn');

const numBtns = document.getElementsByClassName('num-btn');
const opBtns = document.getElementsByClassName('op-btn');

const screen = document.querySelector('.screen-content');
screen.textContent = '0';

let equalsMemory = null;
let activeOp = null;
let calculatorMemory = null;
let liquidNumber = true;
// tells if the number on screen is to be overwritten on any number input
let clBtnMode = 0;
// 0 for AC, 1 for C

function numBtn() {
    if (screen.textContent === '0' || liquidNumber) {
        screen.textContent = '';
        screen.textContent += this.id.substr(4);
        liquidNumber = false;
    } else if (!liquidNumber) {
        screen.textContent += this.id.substr(4);
    }
    clBtnMode = 1;
    clBtn.textContent = 'C';
}

for (let i = 0; i < numBtns.length; i++) {
    numBtns[i].addEventListener('click', numBtn, false);
}

clBtn.addEventListener('click', function() {
    if (clBtnMode === 0) {
        equalsMemory = null;
        activeOp = null;
        calculatorMemory = null;
        screen.textContent = '0';
        liquidNumber = true;
    } else {
        screen.textContent = '0';
        liquidNumber = true;
        clBtnMode = 0;
        clBtn.textContent = 'AC';
    } 
})

ersBtn.addEventListener('click', function() {
    if (liquidNumber === true) {
        return;
    } 
    if (screen.textContent.length === 1) {
        screen.textContent = '0';
    } else {
        screen.textContent = screen.textContent.substr(0, screen.textContent.length - 1)
    }

})

function opBtn() {
    if (equalsMemory) {
        calculatorMemory = screen.textContent;
        equalsMemory = null;
    }
    if (liquidNumber && calculatorMemory) {
        activeOp = this.id.substr(0, 3);
        return;
    }
    if (!calculatorMemory) {
        calculatorMemory = screen.textContent;
        liquidNumber = true;
        activeOp = this.id.substr(0, 3);
    } else {
        screen.textContent = operate(activeOp, calculatorMemory, screen.textContent);
        calculatorMemory = screen.textContent;
        liquidNumber = true;
        activeOp = this.id.substr(0, 3);
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
    if (!calculatorMemory) return;
    if (!equalsMemory) {
        equalsMemory = screen.textContent;
        screen.textContent = operate(activeOp, calculatorMemory, screen.textContent);
    } else {
        screen.textContent = operate(activeOp, screen.textContent, equalsMemory);
    }
    liquidNumber = true;
})

ptBtn.addEventListener('click', function() {
    if (liquidNumber) {
        screen.textContent = '0';
    } 
    for (let i = 0; i < screen.textContent.length; i++) {
        if(screen.textContent[i] === '.') {
            return;
        }
    }
    screen.textContent += '.';
    liquidNumber = false;
    clBtnMode = 1;
})

ngtBtn.addEventListener('click', function() {
    screen.textContent = screen.textContent * -1;
})

