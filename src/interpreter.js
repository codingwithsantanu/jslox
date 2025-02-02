class Interpreter {
    constructor() {
        this.environment = new Environment();
    }

    // Main methods for interpreting.
    interpret(statements) {
        try {
            statements.forEach(statement => {
                this.execute(statement);
            });
        } catch (error) {}
    }

    evaluate(expr) {
        return expr.accept(this);
    }

    execute(stmt) {
        stmt.accept(this);
    }

    executeBlock(statements, environment) {
        const previous = this.environment;
        try {
            this.environment = environment;

            statements.forEach(statement => {
                this.execute(statement);
            });
        } finally {
            this.environment = previous;
        }
    }

    stringify(object) {
        if (object === null)
            return "nil";

        if (typeof object === "number") {
            let text = String(object);
            if (text.endsWith(".0"))
                text = text.substring(0, text.length - 2);
            return text;
        }

        return String(object);
    }


    // Expression visitors.
    visitBinaryExpr(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.PLUS:
                if (typeof left === "number" && typeof right === "number")
                    return Number(left) + Number(right);
                if (typeof left === "string" && typeof right === "string")
                    return String(left) + String(right);
                
                runtimeError(expr.operator, "Operands must be two numbers or two strings.");
                throw new Error();

            case TokenType.MINUS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) - Number(right);
            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right);
            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);

            case TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);

            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
        }

        // Unreachable.
        return null;
    }

    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
    }
    
    visitLiteralExpr(expr) {
        return expr.value;
    }
    
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);
            case TokenType.BANG:
                return -this.isTruthy(right);
        }

        // Unreachable.
        return null;
    }

    visitVariableExpr(expr) {
        return this.environment.get(expr.name);
    }

    visitAssignExpr(expr) {
        const value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
    }

    visitLogicalExpr(expr) {
        const left = this.evaluate(expr.left);

        if (expr.operator.type === TokenType.OR) {
            if (this.isTruthy(left)) return left;
        } else {
            if (!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }

    visitCallExpr(expr) {}
    visitGetExpr(expr) {}
    visitSetExpr(expr) {}
    visitThisExpr(expr) {}
    visitSuperExpr(expr) {}


    // Statement visitors.
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
        return null;
    }

    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        println(this.stringify(value));
        return null;
    }

    visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.lexeme, value);
        return null;
    }
    
    visitBlockStmt(stmt) {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    }

    visitIfStmt(stmt) {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            this.execute(stmt.elseBranch);
        }

        return null;
    }

    visitWhileStmt(stmt) {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }

        return null;
    }

    visitFunctionStmt(stmt) {}
    visitReturnStmt(stmt) {}
    visitClassStmt(stmt) {}


    // Helper methods for better modularity.
    isTruthy(object) {
        if (object === null)
            return false;
        if (typeof object === "boolean")
            return Boolean(object);
        return true;
    }

    isEqual(left, right) {
        if (left === null && right === null)
            return true;
        if (left === null || right === null)
            return false
        return left === right;
    }


    checkNumberOperand(operator, operand) {
        if (typeof operand === "number")
            return;

        runtimeError(operator, "Operand must be a number.");
        throw new Error();
    }

    checkNumberOperands(operand, left, right) {
        if (typeof left === "number" && typeof right === "number")
            return;

        runtimeError(operator, "Operands must be a numbers.");
        throw new Error();
    }
}