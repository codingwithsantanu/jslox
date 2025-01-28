// Fetch all the required elements.
const editor = document.getElementById("editor");
const output = document.getElementById("output");
const consoleWidth = Math.floor(output.clientWidth / 16);


// Custom functions for console.log()
function print() {
    let message = "";
    for (let i = 0; i < arguments.length; i++) {
        message += String(arguments[i]) + " ";
    }
    message = message.substring(0, message.length - 1);
    message = message.replaceAll(" ", "&nbsp;").replaceAll("\n", "<br>");
    
    output.innerHTML += message;
    output.scrollTop = output.scrollHeight;
}

function println() {
    print(...arguments);
    print("<br>");
}


// Custom functions for error handling.
let hadError = false;
let hadRuntimeError = false;

function error(line, message) {
    report(line, "", message);
}


function report(line, where, message) {
    println(`[line ${line}] Error${where}: ${message}`);
    hadError = true;
}