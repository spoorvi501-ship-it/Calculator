const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let current = "0";
let stored = null;
let operator = null;
let startNew = false;

function render() {
    display.textContent = current;
}

function clearCalculator() {
    current = "0";
    stored = null;
    operator = null;
    startNew = false;
    expression.textContent = "";
    render();
}

function enterNumber(number) {
    if (startNew || current === "Error") {
        current = number;
        startNew = false;
    } else if (current === "0") {
        current = number;
    } else if (current.replace("-", "").length < 15) {
        current += number;
    }

    render();
}

function enterDecimal() {
    if (startNew || current === "Error") {
        current = "0.";
        startNew = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    render();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? null : a / b;
        default:
            return b;
    }
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const value = Number(current);

    if (operator && !startNew) {
        const result = calculate(
            stored, value, operator
        );

        if (result === null || !Number.isFinite(result)) {
            current = "Error";
            expression.textContent = "Cannot divide by zero";
            stored = null;
            operator = null;
            startNew = true;
            render();
            return;
        }

        current = String(Number(result.toPrecision(12)));
        render();
    }

    stored = Number(current);
    operator = nextOperator;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    expression.textContent =
        `${current} ${symbols[nextOperator]}`;

    startNew = true;
}

function showResult() {
    if (operator === null || stored === null ||
        current === "Error") {
        return;
    }

    const left = stored;
    const right = Number(current);
    const op = operator;

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    const result = calculate(left, right, op);

    expression.textContent =
        `${left} ${symbols[op]} ${right} =`;

    if (result === null || !Number.isFinite(result)) {
        current = "Error";
    } else {
        current = String(Number(result.toPrecision(12)));
    }

    stored = null;
    operator = null;
    startNew = true;

    render();
}

function backspace() {
    if (startNew || current === "Error") {
        current = "0";
        startNew = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : "0";
    }

    render();
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
    } else if (button.dataset.op) {
        chooseOperator(button.dataset.op);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;
            case "backspace":
                backspace();
                break;
            case "decimal":
                enterDecimal();
                break;
            case "equals":
                showResult();
                break;
        }
    }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    if (/^[0-9]$/.test(event.key)) {
        enterNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "." || event.key === ",") {
        enterDecimal();
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        showResult();
    } else if (event.key === "Backspace") {
        backspace();
    } else if (
        event.key === "Escape" ||
        event.key.toLowerCase() === "c"
    ) {
        clearCalculator();
    }
});