const display = document.getElementById("display");
const maxLength = 12;

function pressKey(key) {
    if (display.value.length >= maxLength) {
        display.value = "ERROR";
        display.classList.add("error");
        return;
    }

    display.classList.remove("error");
    display.value += key;
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "ERROR";
        display.classList.add("error");
    }
}

function clearDisplay() {
    display.value = "";
    display.classList.remove("error");
}

function pressKey(key) {

    if (display.value === "ERROR") {
        display.value = "";
        display.classList.remove("error");
    }

    if (display.value.length >= maxLength) {
        display.value = "ERROR";
        display.classList.add("error");
        return;
    }

    display.classList.remove("error");
    display.value += key;
}
