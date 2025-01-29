class AstPrinter {
    print(expr) {
        return expr.accept(this);
    }

    // Expression visitors.
    visitBinaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitGroupingExpr(expr) {
        return this.parenthesize("group", expr.expression);
    }

    visitLiteralExpr(expr) {
        if (expr.value == null)
            return "nil";
        return String(expr.value);
    }

    visitUnaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    // Helper methods.
    parenthesize(name, ...exprs) {
        let string = "(" + name;
        exprs.forEach(expr => {
            string += " ";
            string += expr.accept(this);
        });
        string += ")";

        return string;
    }
}

function testAstPrinter() {
    const expression = new Binary(
        new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Literal(123)
        ),
        new Token(TokenType.STAR, "*", null, 1),
        new Grouping(
            new Literal(45.67)
        )
    );

    console.log(new AstPrinter().print(expression));
}

// testAstPrinter();