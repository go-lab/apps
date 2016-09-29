class NamedTypeError extends TypeError {
    constructor(moduleName, varName, expectedType, actualValue) {
        super();
        var actualType = typeof actualValue;
        this.name = 'NamedTypeError';
        this.message =
            `${moduleName}: Needs a ${varName} of type "${expectedType}" (was: "${actualType}").`;
    }
}

export default NamedTypeError;
