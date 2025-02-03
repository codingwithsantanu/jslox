class ReturnError extends Error {
    constructor(value) {
        super();
        this.value = value;
    }
}