class Environment {
    constructor(enclosing = null) {
        this.enclosing = enclosing;
        this.values = {};
    }

    // Methods for storing and fetching variables.
    define(name, value) {
        this.values[name] = value;
    }

    get(name) {
        if (name.lexeme in this.values) {
            return this.values[name.lexeme];
        }

        if (this.enclosing != null) {
            return this.enclosing.get(name);
        }

        runtimeError(name, `Undefined variable '${name}'.`);
        throw new Error();
    }

    assign(name, value) {
        if (name.lexeme in this.values) {
            this.values[name.lexeme] = value;
            return;
        }

        if (this.enclosing != null) {
            this.enclosing.assign(name, value);
            return;
        }

        runtimeError(name, `Undefined variable '${name}'.`);
        throw new Error();
    }
}