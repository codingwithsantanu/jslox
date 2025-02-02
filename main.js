/*
function highlight() {
    const source = inputField.value;

    const highlighter = new Highlighter(source);
    const tokens = highlighter.scanTokens();

    editor.innerHTML = "";
    for (let i = 0; i < source.length; i++) {
        let ch = source[i];
        switch (source[i]) {
            case "\r": ch = ""; break;
            case " ":  ch = "&nbsp;"; break;
            case "\t":  ch = "&nbsp;" * 4; break;
            case "\n":  ch = "<br>"; break;
        }

        if (i === inputField.selectionStart - 1) {
            editor.innerHTML += `<span class="active">${ch}</span>`;
        } else {
            editor.innerHTML += `<span>${ch}</span>`;
        }

        console.log(inputField.selectionStart - 1, i, ch);
    }
    console.log(editor.innerHTML);

    // editor.innerHTML = "";
    // tokens.forEach(token => {
    //     if (token.index == inputField.selectionEnd - 1) {
    //         editor.innerHTML += token.getActiveTag();
    //         console.log("This is it: ", token.getActiveTag());
    //         // editor.innerHTML += `<br><span class="active">&ZeroWidthSpace;</span>`;
    //     } else {
    //         editor.innerHTML += token.getTag();
    //     }

    //     // console.log(token.lexeme, token.color, token.index);
    // });

    // console.log("Source Code: " + source);
    // console.log("Highlighted Code: " + editor.innerHTML);
    // console.log(inputField.selectionEnd, tokens[inputField.selectionStart - 1]);
}

function focus() {
    inputField.focus();
    if (editor.value !== "")
        highlight();
}


document.addEventListener("keydown", () => focus());
editor.addEventListener("click", () => focus());
inputField.addEventListener("input", highlight);
*/

document.addEventListener("keydown", () => editor.focus());
editor.addEventListener("click", () => editor.focus());
// inputField.addEventListener("input", highlight);