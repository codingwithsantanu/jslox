class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        let statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.declaration());
        }

        return statements;
    }

    // Methods for parsing Expressions.
    expression() {
        return this.assignment();
    }

    assignment() {
        let expr = this.or();

        if (this.match(TokenType.EQUAL)) {
            const equals = this.previous();
            const value = this.assignment();

            if (expr instanceof Variable) {
                const name = (expr instanceof Variable) ? expr.name : null;
                if (name !== null)
                    return new Assign(name, value);
            }

            this.error(equals, "Invalid assignment target.");
        }

        return expr;
    }

    or() {
        let expr = this.and();

        while (this.match(TokenType.OR)) {
            const operator = this.previous();
            const right = this.and();
            expr = new Logical(expr, operator, right);
        }

        return expr;
    }

    and() {
        let expr = this.equality();

        while (this.match(TokenType.AND)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new Logical(expr, operator, right);
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();

        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    comparison() {
        let expr = this.term();

        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    term() {
        let expr = this.factor();

        while (this.match(TokenType.MINUS, TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    factor() {
        let expr = this.unary();

        while (this.match(TokenType.SLASH, TokenType.STAR)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    unary() {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new Unary(operator, right);
        }

        return this.call();
    }

    call() {
        let expr = this.primary();

        while (true) {
            if (this.match(TokenType.LEFT_PAREN)) {
                expr = this.finishCall(expr);
            } else {
                break;
            }
        }

        return expr;
    }

    finishCall(callee) {
        let args = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (args.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 arguments.");
                    // We don't really need to limit args.
                }

                args.push(this.expression());
            } while (this.match(TokenType.COMMA));
        }

        const paren = this.consume(
            TokenType.RIGHT_PAREN,
            "Expect ')' after arguments."
        );

        return new Call(callee, paren, args);
    }

    primary() {
        if (this.match(TokenType.TRUE))  return new Literal(true);
        if (this.match(TokenType.FALSE)) return new Literal(false);
        if (this.match(TokenType.NIL))   return new Literal(null);

        if (this.match(TokenType.NUMBER, TokenType.STRING))
            return new Literal(this.previous().literal);

        if (this.match(TokenType.IDENTIFIER))
            return new Variable(this.previous());

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping(expr);
        }

        throw this.error(this.peek(), "Expect expression.");
    }


    // Methods for parsing Statements.
    statement() {
        if (this.match(TokenType.PRINT))
            return this.printStatement();
        if (this.match(TokenType.LEFT_BRACE))
            return new Block(this.block());
        if (this.match(TokenType.IF))
            return this.ifStatement();
        if (this.match(TokenType.WHILE))
            return this.whileStatement();
        if (this.match(TokenType.FOR))
            return this.forStatement();
        if (this.match(TokenType.RETURN))
            return this.returnStatement();

        return this.expressionStatement();
    }

    declaration() {
        try {
            if (this.match(TokenType.VAR))
                return this.varDeclaration();
            if (this.match(TokenType.FUN))
                return this.functionDeclaration("function");

            return this.statement();
        } catch (error) {
            this.synchronize();
            return null;
        }
    }

    expressionStatement() {
        const expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Expression(expr);
    }

    printStatement() {
        const value = this.expression();
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
        return new Print(value);
    }

    varDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");

        let initializer = null;
        if (this.match(TokenType.EQUAL))
            initializer = this.expression();

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new Var(name, initializer);
    }

    block() {
        let statements = [];

        while (!this.check(TokenType.RIGHT_BRACE)) {
            statements.push(this.declaration());
        }

        this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }

    ifStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

        const thenBranch = this.statement();
        let elseBranch = null;
        if (this.match(TokenType.ELSE)) {
            elseBranch = this.statement();
        }

        return new If(condition, thenBranch, elseBranch);
    }

    whileStatement() {
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");

        const body = this.statement();
        return new While(condition, body);
    }

    forStatement() {
        // This statement is complex as we need to
        // desugarise it. Let's consume the args first.
        this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
        
        let initializer;
        if (this.match(TokenType.SEMICOLON)) {
            initializer = null;
        } else if (this.match(TokenType.VAR)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

        let increment = null;
        if (!this.check(TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }

        this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
        let body = this.statement();
        
        // After the args we need to structure the Stmt.
        if (increment != null) {
            body = new Block([
                body,
                new Expression(increment)
            ]);
        }

        if (condition == null)
            condition = new Literal(true);
        body = new While(condition, body);

        if (initializer != null) {
            body = new Block([initializer, body]);
        }

        /* 
          Structure:
           {
               initializer;
               {
                   body;
                   increment;
               }
           }
        */

        return body;
    }

    functionDeclaration(kind) {
        const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
        this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);

        let parameters = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this.error(this.peek(), "Can't have more than 255 parameters.");
                }

                parameters.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
            } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expect '(' after parameters.");

        this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);
        const body = this.block();
        return new Function(name, parameters, body);
    }

    returnStatement() {
        const keyword = this.previous();
        let value = null;
        if (!this.check(TokenType.SEMICOLON))
            value = this.expression();

        this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
        return new Return(keyword, value);
    }


    // Methods for Panic Mode Error Recovery.
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        
        throw this.error(this.peek(), message);
    }

    error(token, message) {
        parseError(token, message);
        throw new Error(message);
    }

    synchronize() {
        this.advance();

        while (!this.isAtEnd()) {
            if (this.previous().type === TokenType.SEMICOLON)
                return;

            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance();
        }
    }


    // Helper methods for better modularity and clarity.
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }


    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
}