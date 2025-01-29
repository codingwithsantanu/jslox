function highlight() {
    const source = inputField.value;

    const highlighter = new Highlighter(source);
    const tokens = highlighter.scanTokens();

    editor.innerHTML = "";
    let index = 0;
    tokens.forEach(token => {
        if (index++ == tokens.length - 1) {
            editor.innerHTML += token.getActiveTag();
        } else {
            editor.innerHTML += token.getTag();
        }
    });

    console.log("Source Code: " + source);
    console.log("Highlighted Code: " + editor.innerHTML);
}


document.addEventListener("keydown", () => inputField.focus());
editor.addEventListener("click", () => inputField.focus());
inputField.addEventListener("input", highlight);