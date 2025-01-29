function run() {
    const source = inputField.value;

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

    console.log("Output: " + output.innerHTML);
}