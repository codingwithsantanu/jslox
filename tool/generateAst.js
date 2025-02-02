class GenerateAst {
    constructor() {
        // this.defineAst("Expr", [
        //     "Binary   : left, operator, right",
        //     "Grouping : expression",
        //     "Literal  : value",
        //     "Unary    : operator, right", //
        //     "Variable : name",
        //     "Assign   : name, value", //
        //     "Logical  : left, operator, right", //
        //     "Call     : callee, paren, _arguments",
        //     "Get      : object, name",
        //     "Set      : object, name, value",
        //     "This     : keyword", //
        //     "Super    : keyword, method"
        // ]);
        
        this.defineAst("Stmt", [
            "Expression : expression",
            "Print      : expression",
            "Var        : name, initializer", //
            "Block      : statements",
            "If         : condition, thenBranch, elseBranch",
            "While      : condition, body", //
            "Function   : name, params, body",
            "Return     : keyword, value", //
            "Class      : name, superclass, methods"
        ]);
    }

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
        console.log();
    }

    defineBranch(baseName, className, fieldList) {
        console.log(`class ${className} extends ${baseName} {`);
        
        // Constructor.
        const fields = fieldList.split(", ");
        console.log(`    constructor(${fieldList}) {`);
        console.log("        super();");
        fields.forEach(field => {
            console.log(`        this.${field} = ${field};`);
        });
        console.log("    }");
        console.log();

        // Visitor method.
        console.log("    accept(visitor) {");
        console.log(`        return visitor.visit${className}${baseName}(this);`);
        console.log("    }");

        console.log("}");
        console.log();
    }
}


new GenerateAst();