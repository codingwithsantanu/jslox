class GenerateAst {
    // Main methods.
    displayExprAst() {
        this.defineAst("Expr", [
            "Binary   : Expr left, Token operator, Expr right",
            "Grouping : Expr expression",
            "Literal  : Object value",
            "Unary    : Token operator, Expr right", //
            "Variable : Token name",
            "Assign   : Token name, Expr value", //
            "Logical  : Expr left, Token operator, Expr right", //
            "Call     : Expr callee, Token paren, List<Expr> args",
            "Get      : Expr object, Token name",
            "Set      : Expr object, Token name, Expr value",
            "This     : Token keyword", //
            "Super    : Token keyword, Token method"
        ]);

        // NOTE: In call expression, you can't name the parameter
        // ....  arguments as it is reserved for js. Instead I have
        // ....  used args which is not reserved. If you skip this
        // ....  step you may see unexpected behavior most of the time
        // ....  as arguments would return the args passed to the
        // ....  function interpreting a call instead of the parsed
        // ....  function declaration we want to get the length of.
    }

    displayStmtAst() {
        this.defineAst("Stmt", [
            "Expression : Expr expression",
            "Print      : Expr expression",
            "Var        : Token name, Expr initializer", //
            "Block      : List<Stmt> statements",
            "If         : Expr condition, Stmt thenBranch, Stmt elseBranch",
            "While      : Expr condition, Stmt body", //
            "Function   : Token name, List<Token> params, List<Stmt> body",
            "Return     : Token keyword, Expr value", //
            "Class      : Token name, Expr.Variable superclass, List<Stmt.Function> methods"
        ]);
    }


    // Helper methods.
    defineAst(baseName, types) {
        this.defineBaseClass(baseName);

        // The AST classes.
        types.forEach(type => {
            const className = type.split(":")[0].trim();
            const fields = type.split(":")[1].trim();
            this.defineBranch(baseName, className, fields);
        });
    }

    defineBaseClass(baseName) {
        console.log(`class ${baseName} {`);
        console.log("    accept(visitor) {}");
        console.log("}");
    }

    defineBranch(baseName, className, fieldList) {
        console.log(`\nclass ${className} extends ${baseName} {`);

        // Prepare the fields. We will remove the types.
        const fields = []
        fieldList.split(", ").forEach(field => {
            fields.push(field.split(" ")[1]);
        });
        fieldList = fields.join(", ");
        
        // Constructor.
        console.log(`    constructor(${fieldList}) {`);
        console.log("        super();");
        fields.forEach(field => {
            console.log(`        this.${field} = ${field};`);
        });
        console.log("    }\n");

        // Visitor method.
        console.log("    accept(visitor) {");
        console.log(`        return visitor.visit${className}${baseName}(this);`);
        console.log("    }");

        console.log("}");
    }
}


const astGenerator = new GenerateAst();
// astGenerator.displayExprAst();
astGenerator.displayStmtAst();