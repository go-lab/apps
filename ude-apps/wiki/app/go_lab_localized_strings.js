export default function GoLabLocalizedStrings(goLabLanguageHandler) {
    return {
        get: function(key, ...args) {
            return goLabLanguageHandler.getMessage(key, ...args);
        },
    }
}
