const screen = document.querySelector('.screen-content');
let calculatorMemory = '';
screen.textContent = 0;


function operate(fnOperator, num1, num2) {
    let action = fnOperator.substr(0,2);
    if (action === 'add') {
        return num1 + num2;
    } else if (action === 'sub') {
        return num1 - num2;
    } else if (action === 'mlt') {
        return num1 * num2;
    } else if (action === 'div') {
        return num1 / num2;
    }
}

function numButton() {
    if (screen.textContent === '0') {
        screen.textContent = '';
    }
    let num = this.id.substr(4);
    screen.textContent += num;
}

let operator = null;
function opButton() {
    if (operator !== null) {
        document.getElementById(operator).classList.remove('selected');
    }
    this.classList.add('selected');
    operator = this.id;
    if (calculatorMemory === '') {
        calculatorMemory = screen.textContent;
        screen.textContent = 0;
    }
    // screen.textContent = operate(operator, calculatorMemory, screen.textContent);
}

const numButtons = document.getElementsByClassName('num-btn');

for (let i = 0; i < numButtons.length; i++) {
    numButtons[i].addEventListener('click', numButton, false);
}

const opButtons = document.getElementsByClassName('op-btn');

for (let i = 0; i < opButtons.length; i++) {
    opButtons[i].addEventListener('click', opButton, false);
}