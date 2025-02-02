const interpreter = new Interpreter();

function getSource() {
    return editor.value;
}

function run() {
    const source = getSource();

    output.innerHTML = "";
    hadError = false;
    hadRuntimeError = false;

    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    if (hadError)
        return;

    // Let's print the tokens first.
    tokens.forEach(token => {
        println(token.toString());
    });

    const parser = new Parser(tokens);
    const expression = parser.parse();

    if (hadError)
        return;

    println();
    println(new AstPrinter().print(expression));
    
    println();
    interpreter.interpret(expression);

    // console.log("Output: " + output.innerHTML);
}