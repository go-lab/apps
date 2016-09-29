import LocalizedStrings from 'app/localized_strings';

suite('LocalizedStrings', () => {
    var assert = chai.assert;
    var strings, english, german;

    setup(() => {
        strings = {
            'en': {
                key: 'value',
                key2: 'value 2',
                fun: (val) => `val: ${val}`,
            },
            'de': {
                key: 'wert',
                fun: (val1, val2) => val1 + val2,
            }
        };

        english = LocalizedStrings(strings, 'en');
        german = LocalizedStrings(strings, 'de');
    });

    test('normal string lookup', () => {
        assert.equal(english.get('key'), strings.en.key);
        assert.equal(german.get('key'), strings.de.key);
    });

    test('parameterized string lookup', () => {
        assert.equal(english.get('fun', 'val'), strings.en.fun('val'));
        assert.equal(german.get('fun', 'hallo ', 'welt'), strings.de.fun('hallo ', 'welt'));
    });

    test('unavailable language', () => {
        assert.throws(() => {
            LocalizedStrings(strings, 'bla');
        }, 'Locale "bla" not available.');
    });

    test('key not found', () => {
        assert.throws(() => {
            german.get('key2');
        }, 'No entry for "key2" in locale "de".');
    });
});
