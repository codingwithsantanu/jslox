class Lox {
    run(source) {
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
    }
}


const lox = new Lox();
function run() {
    lox.run(editor.value);
    console.log(editor.value);
}