const interpreter = new Interpreter();

// Main methods.
function runCode(debug = false) {
    const source = getSource();

    // Add a running tag to show that the code is being processed.
    output.innerHTML = "Running Code...<br><br>";
    setTimeout(() => {
        hadError = false;
        hadRuntimeError = false;

        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();

        if (hadError)
            return;

        // Print the tokens.
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

        // The we can display the AST classes.
        if (debug) {
            statements.forEach(statement => {
                print(statement.constructor.name);
                println("Stmt"); // NOTE: Every statement is an instance of Stmt.
                // println(Object.getPrototypeOf(statement.constructor).name);
            });
            println();
        }

        interpreter.interpret(statements);
        
        output.innerHTML += "<br>Running Complete.";
        console.log(output.innerHTML);
    }, 0);
}


// Helper methods.
function getSource() {
    return editor.value;
}

function copyCode() {
    const source = getSource();
    navigator.clipboard.writeText(source);
    window.alert("Code was copied to clipboard. Thanks for trying the best programming language in the universe.");
}


// Focus on main textarea.
document.addEventListener("keydown", () => editor.focus());
editor.addEventListener("click", () => editor.focus());