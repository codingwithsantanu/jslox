const interpreter = new Interpreter();

function getSource() {
    return editor.value;
}

function copyCode() {
    const source = getSource();
    navigator.clipboard.writeText(source);
    window.alert("Code was copied to clipboard.");
}

function run(debug = false) {
    const source = getSource();

    output.innerHTML = "";
    hadError = false;
    hadRuntimeError = false;

    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    if (hadError)
        return;

    // Let's print the tokens first.
    if (debug) {
        tokens.forEach(token => {
            println(token.toString());
        });
        println();
    }

    const parser = new Parser(tokens);
    const statements = parser.parse();

    if (hadError)
        return;

    // Then we can display the AST.
    if (debug) {
        statements.forEach(statement => {
            println(statement.constructor.name);
        });
        println();
    }

    interpreter.interpret(statements);

    // console.log("Output: " + output.innerHTML);
}