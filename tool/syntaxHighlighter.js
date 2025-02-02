const COLORS = Object.freeze({
    BLACK: "#1b1f23",
    WHITE: "#fff",
    GRAY: "gray",
    LIGHTGRAY: "#586069",
    BLUE: "#79b8ff",
    LIGHTBLUE: "#c8e1ff",
    GREEN: "#85e89d",
    YELLOW: "#ffdf5d",
    ORANGE: "#ffab70",
    RED: "#f97583",
    DARKRED: "#ea4a5a",
    PURPLE: "#b392f0",
    PINK: "#f692ce"
});


class _Token {
    constructor(lexeme, color, index) {
        this.lexeme = lexeme;
        this.color = color;
        this.index = index;
    }

    getTag() {
        if (this.color == null)
            return this.lexeme;
        return `<span style="color: ${this.color};">${this.lexeme}</span>`
    }

    getActiveTag() {
        if (this.lexeme === "<br>")
            return `<br><span class="active">&ZeroWidthSpace;</span>`
        else if (this.color == null)
            return `<span class="active">${this.lexeme}</span>`;
        return `<span class="active" style="color: ${this.color};">${this.lexeme}</span>`
    }
}


class Highlighter {
    constructor(source) {
        this.source = source;
        this.tokens = [];

        this.start = 0;
        this.current = 0;

        this.keywords = {
            "and":    COLORS.RED,
            "class":  COLORS.RED,
            "else":   COLORS.RED,
            "false":  COLORS.RED,
            "for":    COLORS.RED,
            "fun":    COLORS.RED,
            "if":     COLORS.RED,
            "nil":    COLORS.RED,
            "or":     COLORS.RED,
            "print":  COLORS.RED,
            "return": COLORS.RED,
            "super":  COLORS.RED,
            "this":   COLORS.RED,
            "true":   COLORS.RED,
            "var":    COLORS.RED,
            "while":  COLORS.RED
        };
    }

    // Main methods for scanning tokens.
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        return this.tokens;
    }

    scanToken() {
        const ch = this.advance();
        switch (ch) {
            case '(':
            case ')':
                this.addToken(ch, COLORS.YELLOW);
                break;

            case '{':
            case '}':
                this.addToken(ch, COLORS.PURPLE);
                break;
            
            case '.':
            case ',':
            case ';':
                this.addToken(ch, COLORS.WHITE);
                break;

            case '+':
            case '-':
            case '*':
                this.addToken(ch, COLORS.RED);
                break;

            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                    this.addToken(this.source.substring(this.start, this.current), COLORS.LIGHTGRAY);
                } else {
                    this.addToken(ch, COLORS.GREEN);
                } break;

            case '!':
            case '=':
            case '<':
            case '>':
                this.addToken(ch, COLORS.RED);
                break;

            case ' ':
                this.addToken("&nbsp;", null);
                break;
            case '\r':
                this.addToken("", null);
                break;
            case '\t':
                this.addToken("&nbsp;" * 4, null);
                break;
            case '\n':
                this.addToken("<br>", null);
                break;

            case '"': this.string(); break;

            default:
                if (this.isDigit(ch)) {
                    this.number();
                } else if (this.isAlpha(ch)) {
                    this.identifier();
                } else {
                    this.addToken(ch, COLORS.DARKRED);
                } break;
        }
    }


    // Methods for handling literals.
    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            this.advance();
        }
        this.advance();

        let value = this.source.substring(this.start, this.current);
        value = value.replaceAll(' ', "&nbsp;").replaceAll('\r', "").replaceAll("\t", "&nbsp;" * 4).replaceAll('\n', "</span><br><span>");
        this.addToken(value, COLORS.LIGHTBLUE);
    }

    number() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }

        const value = this.source.substring(this.start, this.current);
        this.addToken(value, COLORS.BLUE);
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);
        let color = this.keywords[text];
        if (color == null)
            color = COLORS.WHITE;
        this.addToken(text, color);
    }


    // Helper methods for better modularity.
    isAtEnd() {
        return this.current >= this.source.length;
    }

    match(expected) {
        if (this.isAtEnd() || this.source.charAt(this.current) != expected)
            return false;

        this.current++;
        return true;
    }


    isDigit(ch) {
        return ch >= '0' && ch <= '9';
    }

    isAlpha(ch) {
        return (ch >= 'a' && ch <= 'z') ||
               (ch >= 'A' && ch <= 'Z') ||
                ch == '_';
    }

    isAlphaNumeric(ch) {
        return this.isAlpha(ch) || this.isDigit(ch);
    }


    advance() {
        return this.source.charAt(this.current++);
    }

    peek() {
        if (this.isAtEnd())
            return '\0';  // Null char signifies EOF.
        return this.source.charAt(this.current);
    }

    peekNext() {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }


    addToken(lexeme, color) {
        if (color == null) {
            this.tokens.push(new _Token(lexeme, color, this.current));
            return;
        }

        for (var i = 0; i < lexeme.length; i++) {
            this.tokens.push(new _Token(lexeme[i], color, this.start + i));
        }
    }
}