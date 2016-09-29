export function pagesFixture() {
    var page1 = {
        id: '0',
        title: 'Index',
        slug: 'index',
        revisions: [{
            id: '1',
            timestamp: new Date(Date.now() - 1000*60*60*48),
            content: 'This is the index page.',
            author: 'Peter peterson',
        }, {
            id: '0',
            timestamp: new Date(Date.now() - 1000*60*60*58),
            content: 'This was the index page.',
            author: 'Franz Mustermann'
        }],
    };

    page1.currentRevision = page1.revisions[0];

    var page2 = {
        id: '1',
        title: 'Seite 2',
        slug: 'seite-2',
        revisions: [{
            id: '1',
            timestamp: new Date(Date.now() - 1000*60*60*48),
            content: 'Dies ist die zweite Seite.\nDeswegen zwei Zeilen. Möp.',
            author: 'Peter peterson',
        }, {
            id: '0',
            timestamp: new Date(Date.now() - 1000*60*60*58),
            content: 'Dies war die zweite Seite.',
            author: 'Franz Mustermann'
        }],
    };

    page2.currentRevision = page2.revisions[1];

    return [page1, page2];
}
