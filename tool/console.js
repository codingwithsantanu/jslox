// Fetch all the required elements.
const editor = document.getElementById("editor");
const output = document.getElementById("output");


// Displaying messages in the output div.
const REPLACEABLE_CHARS = [
    ["<",  "&lt;"],
    [">",  "&gt;"],
    
    [" ",  "&nbsp;"],
    ["\t", "&nbsp;" * 4],
    ["\n",  "<br>"],
]

// NOTE: Make sure the < and > are at the top

function print() {
    let message = "";
    for (let i = 0; i < arguments.length; i++) {
        message += String(arguments[i]) + " ";
    } // Here we are converting the args into a message string separated by whitespaces.
    message = message.substring(0, message.length - 1);
    
    REPLACEABLE_CHARS.forEach(chars => {
        message = message.replaceAll(chars[0], chars[1]);
    }); // Replaces invalid words with \n with HTML alternatives like <br>.

    output.innerHTML += message;
    output.scrollTop = output.scrollHeight;
}

function println() {
    print(...arguments);
    print("\n");
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
        report(token.line, ` at '${token.lexeme}'`, message);
    }
}

function runtimeError(token, message) {
    hadRuntimeError = true;
    println(`[line ${token.line}]: ${message}`);
}

function report(line, where, message) {
    hadError = true;
    println(`[line ${line}] Error${where}: ${message}`);
}