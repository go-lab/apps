export default function LocalizedStrings(strings, locale) {
    if (typeof strings[locale] !== 'object') {
        throw new Error(`Locale "${locale}" not available.`);
    }

    return {
        get(key, ...params) {
            var val = strings[locale][key];

            if (typeof val === 'undefined') {
                throw new Error(`No entry for "${key}" in locale "${locale}".`);
            }

            if (typeof val === 'function') {
                val = val(...params);
            }

            return val;
        }
    };
}
