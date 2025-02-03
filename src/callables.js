class LoxCallable {
    arity() {}
    call(interpreter, args) {}
}

class LoxFunction extends LoxCallable {
    constructor(declaration, closure) {
        super();
        this.declaration = declaration;
        this.closure = closure;
    }

    call(interpreter, args) {
        const environment = new Environment(this.closure);
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme, args[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.body, environment);
        } catch (returnValue) {
            return returnValue.value;
        } return null; // Default return value is nil.
    }

    arity() {
        return this.declaration.params.length;
    }

    toString() {
        return `&lt;fn ${this.declaration.name.lexeme}&gt;`;
    }
}