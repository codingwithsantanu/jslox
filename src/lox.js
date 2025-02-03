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

    println();

    const parser = new Parser(tokens);
    const statements = parser.parse();

    if (hadError)
        return;

    statements.forEach(statement => {
        println(statement.constructor.name);
    });
    // println(new AstPrinter().print(expression));
    
    println();
    interpreter.interpret(statements);

    // console.log("Output: " + output.innerHTML);
}
