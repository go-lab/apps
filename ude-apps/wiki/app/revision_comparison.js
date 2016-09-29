// adapted from https://github.com/cemerick/jsdifflib
export default function RevisionComparison(page, revisionId, localizedStrings) {
    function createDiffHtml(options) {
        // create a SequenceMatcher instance that diffs the two sets of lines
        var base = difflib.stringAsLines(options.base);
        var alt = difflib.stringAsLines(options.alternative);
        var sm = new difflib.SequenceMatcher(base, alt);

        // get the opcodes from the SequenceMatcher instance
        // opcodes is a list of 3-tuples describing what changes should be made to the base text
        // in order to yield the new text
        var opcodes = sm.get_opcodes();

        // build the diff view and add it to the current DOM
        return diffview.buildView({
            baseTextLines: base,
            newTextLines: alt,
            opcodes: opcodes,
            // set the display titles for each resource
            baseTextName: options.baseTitle,
            newTextName: options.alternativeTitle,
            contextSize: null,
            viewType: 0
        });
    }

    var alternative = page.revisions.filter(function(revision) {
        return revision.id === revisionId;
    })[0];

    var baseTitle = localizedStrings.get('current revision',
                                         page.currentRevision.timestamp);
    var alternativeTitle = localizedStrings.get('other revision',
                                                alternative.timestamp);

    return {
        asHtml: function() {
            return createDiffHtml({
                base: page.currentRevision.content,
                alternative: alternative.content,
                baseTitle,
                alternativeTitle,
            }).outerHTML;
        },
    };
}
