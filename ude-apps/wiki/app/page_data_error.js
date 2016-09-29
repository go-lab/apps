class PageDataError extends Error {
    constructor(message) {
        super();
        this.name = 'PageDataError';
        this.message = message;
    }
}

export default PageDataError;
