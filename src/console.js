// Fetch all the required elements.
const editor = document.getElementById("editor");
const output = document.getElementById("output");


// Custom functions as alternative of console.log()
function print() {
    let message = "";
    for (let i = 0; i < arguments.length; i++) {
        message += String(arguments[i]) + " ";
    }

    message = message.substring(0, message.length - 1);
    message = message.replaceAll(" ", "&nbsp;");
    message = message.replaceAll("\n", "<br>");

    output.innerHTML += message;
    output.scrollTop = output.scrollHeight;
}

function println() {
    print(...arguments);
    print("<br>"); // Print args first the \n
}


// Error handling.
let hadError = false;
let hadRuntimeError = false;

function error(line, message) {
    report(line, "", message);
}

function parseError(token, message) {
    if (token.type === TokenType.EOF) {
        report(token.line, " at end", message);
    } else {
        report(token.line, " at '" + token.lexeme + "'", message);
    }
}

function runtimeError(token, message) {
    hadRuntimeError = true;
    println(`[line ${token.line}] ${message}`);
}

function report(line, where, message) {
    println(`[line ${line}] Error${where}: ${message}`);
    hadError = true;
}