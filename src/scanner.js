class Scanner {
    constructor(source) {
        this.source = source;
        this.tokens = [];

        this.start = 0;
        this.current = 0;
        this.line = 1;

        this.keywords = {
            "and":    TokenType.AND,
            "class":  TokenType.CLASS,
            "else":   TokenType.ELSE,
            "false":  TokenType.FALSE,
            "for":    TokenType.FOR,
            "fun":    TokenType.FUN,
            "if":     TokenType.IF,
            "nil":    TokenType.NIL,
            "or":     TokenType.OR,
            "print":  TokenType.PRINT,
            "return": TokenType.RETURN,
            "super":  TokenType.SUPER,
            "this":   TokenType.THIS,
            "true":   TokenType.TRUE,
            "var":    TokenType.VAR,
            "while":  TokenType.WHILE
        };
    }

    // Main methods for scanning tokens.
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }

    scanToken() {
        const ch = this.advance();
        switch (ch) {
            // One character tokens.
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;

            case '.': this.addToken(TokenType.DOT); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            
            case '+': this.addToken(TokenType.PLUS); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '*': this.addToken(TokenType.STAR); break;
            case '/':
                if (this.match('/')) {
                    // A comments goes until the end of the line.
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                } else {
                    this.addToken(TokenType.SLASH);
                } break;

            // One or two character tokens.
            case '!':
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;

            // Ignore whitespaces.
            case ' ':
            case '\r':
            case '\t':
                break;

            case '\n':
                this.line++;
                break;

            // Multiple character tokens.
            case '"': this.string(); break;

            default:
                if (this.isDigit(ch)) {
                    this.number();
                } else if (this.isAlpha(ch)) {
                    this.identifier();
                } else {
                    error(this.line, "Unexpected character '" + ch + "'.");
                } break;
        }
    }


    // Methods for handling literals.
    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n')
                this.line++;
            this.advance();
        } // Skip all characters til enclosing '"' or EOF.

        if (this.isAtEnd()) {
            error(this.line, "Unterminated string.");
            return;
        } // Throw an error for unterminated strings.

        this.advance(); // The closing '"'.

        // Trim the surrounding quotes and add the token.
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    number() {
        while (this.isDigit(this.peek()))
            this.advance(); // Capture the integer portion.

        // Look for a fractional part.
        if (this.peek() == '.' && this.isDigit(peekNext())) {
            this.advance(); // Capture the '.'
            while (this.isDigit(this.peek()))
                this.advance();
        }

        this.addToken(TokenType.NUMBER,
            Number(this.source.substring(this.start, this.current))
        );
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();

        const text = this.source.substring(this.start, this.current);
        let type = this.keywords[text];
        if (type == null)  // Look for keywords, else it's an INDENTIFIER.
            type = TokenType.IDENTIFIER;
        this.addToken(type);
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


    addToken(type, literal = null) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }
}