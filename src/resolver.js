const FunctionType = Object.freeze({
    NONE: "NONE",
    FUNCTION: "FUNCTION"
});

class Resolver {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.scopes = [];
        this.currentFunction = FunctionType.NONE;
    }

    // Main methods.
    resolve(statements) {
        try {
            statements.forEach(statement => {
                statement.accept(this);
            });
        } catch (error) {
            statements.accept(this);
        }
    }

    beginScope() {
        this.scopes.push({});
    }

    endScope() {
        this.scopes.pop();
    }

    declare(name) {
        if (this.scopes.length === 0)
            return;

        const scope = this.scopes[this.scopes.length - 1];
        if (name.lexeme in scope) {
            error(name, "Already a variable with this name in this scope.");
        }
        
        scope[name.lexeme] = true;
    }

    define(name) {
        if (this.scopes.length === 0)
            return;
        this.scopes[this.scopes.length - 1][name.lexeme] = true;
    }

    resolveLocal(expr, name) {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i][name.lexeme] != null || this.scopes[i][name.lexeme] != undefined) {
                this.interpreter.resolve(expr, this.scopes.length - 1 - i);
                return;
            }
        }
    }

    resolveFunction(fn, type) {
        const enclosingFunction = this.currentFunction;
        this.currentFunction = type;

        this.beginScope();
        fn.params.forEach(param => {
            // this.declare(param);
            this.define(param);
        });
        this.resolve(fn.body);
        this.endScope();

        this.currentFunction = enclosingFunction;
    }


    // Expresion visitors.
    visitBinaryExpr(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    visitGroupingExpr(expr) {
        this.resolve(expr.expression);
        return null;
    }

    visitLiteralExpr(expr) {
        return null;
    }

    visitUnaryExpr(expr) {
        this.resolve(expr.right);
        return null;
    }

    visitLogicalExpr(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
        return null;
    }

    visitVariableExpr(expr) {
        if (this.scopes.length !== 0 &&
            this.scopes[this.scopes.length - 1][expr.name.lexeme] == false) {
                error(expr.name, "Can't read local variable in its own initializer.");
        }

        this.resolveLocal(expr, expr.name);
        return null;
    }

    visitAssignExpr(expr) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
        return null;
    }

    visitCallExpr(expr) {
        this.resolve(expr.callee);
        expr.arguments.forEach(argument => {
            this.resolve(argument);
        });

        return null;
    }

    
    // Statement visitors.
    visitExpressionStmt(stmt) {
        this.resolve(stmt.expression);
        return null;
    }

    visitPrintStmt(stmt) {
        this.resolve(stmt.expression);
        return null;
    }

    visitVarStmt(stmt) {
        this.declare(stmt.name);
        if (stmt.initializer != null)
            this.resolve(stmt.initializer);
        this.define(stmt.name);
        return null;
    }

    visitBlockStmt(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
        return null;
    }

    visitIfStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch != null)
            this.resolve(stmt.elseBranch);
        return null;
    }

    visitWhileStmt(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
        return null;
    }

    visitFunctionStmt(stmt) {
        // this.declare(stmt.name);
        this.define(stmt.name);

        this.resolveFunction(stmt, FunctionType.FUNCTION);
        return null;
    }

    visitReturnStmt(stmt) {
        if (this.currentFunction === FunctionType.NONE) {
            error(stmt.keyword, "Can't return from top-level code.");
        }

        if (stmt.value != null)
            this.resolve(stmt.value);
        return null;
    }
}


// CONTINUE: 11.3.6, visitExpressionStmt() done.