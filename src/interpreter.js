class Interpreter {
    // fields...

    // constructor...

    // Main methods for interpreting.
    interpret(expression) {
        try {
            const value = this.evaluate(expression);
            print(this.stringify(value));
        } catch (error) {}
    }

    evaluate(expr) {
        return expr.accept(this);
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
                return this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL:
                return !this.isEqual(left, right);
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