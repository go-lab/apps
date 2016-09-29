import * as util from 'app/util';

export default function EditPage(templating, render, pageData, actionLogger, clock, locale) {
    return {
        newPage: newPage,
        editExistingPage: editExistingPage,
    };

    // TODO write tests for this
    function newPage(pages, author, redirect) {
        var page = {
            new: true,
            isIndex: pages.length === 0,
            title: locale.get('new page'),
            currentRevision: {
                content: '',
                author: author,
            }
        };
        return renderEditPage(page, pages, author, redirect);
    }

    function editExistingPage(page, pages, author, redirect) {
        return renderEditPage(page, pages, author, redirect);
    }

    function renderEditPage(page, pages, author, redirect) {
        return render('edit', {
            page: page,
            pages: pages,
            page_new: page.new === true,
            page_edit: page.new !== true
        }).then(function() {
            handleSaveButtonState();
            handleToolbarInteraction();
            handleSubmit(page, author, redirect);
        });
    }

    function handleSaveButtonState() {
        var saveButton =
            templating.target.querySelector('button[type="submit"]');
        var contentInput = templating.target.querySelector('textarea');
        var titleInput   = templating.target.querySelector('input#title');

        var inputsFilled = () => {
            if (titleInput) {
                return isFilled(titleInput) && isFilled(contentInput);
            } else {
                return isFilled(contentInput);
            }
        };

        var setButtonState = () => {
            saveButton.disabled = ! inputsFilled();
        };

        setButtonState();
        contentInput.addEventListener('input', setButtonState);
        titleInput && titleInput.addEventListener('input', setButtonState);
    }

    function isFilled(input) {
        return input.value.trim() !== '';
    }

    function handleToolbarInteraction() {
        var tools        = templating.target.querySelector('#toolbar');
        var linkPageTool = tools.querySelector('.insert_wiki_link');
        var pagesDisplay = linkPageTool.querySelector('.pages_display');
        var textarea     = templating.target.querySelector('textarea');

        $(pagesDisplay).on('click', 'a', insertLinkIntoTextarea(textarea));
    }

    function insertLinkIntoTextarea(textarea) {
        return function(event) {
            event.preventDefault();
            var [textStart, selectedText, textEnd] = splitValueOnSelection(textarea);
            var pageId = $(this).data('id');
            var pageTitle = $(this).text();
            var link = makeLinkToWikiPage(pageId, pageTitle, selectedText);
            textarea.value = textStart + link + textEnd;
        };
    }

    function splitValueOnSelection(input) {
        var value = input.value;
        var start = input.selectionStart;
        var end = input.selectionEnd;
        return [
            value.substring(0, start),
            value.substring(start, end),
            value.substring(end, value.length),
        ];
    }

    function makeLinkToWikiPage(pageId, pageTitle, selectedText) {
        var link = `(wiki:${pageId} "${pageTitle}")`;
        var text = pageTitle;
        if (selectedText !== '') {
            text = selectedText;
        }
        return `[${text}]${link}`;
    }

    function handleSubmit(page, author, redirect) {
        var form = templating.target.querySelector('#edit_page');
        var inputs = {
            textarea: form.querySelector('textarea'),
            titleInput: form.querySelector('#title')
        };

        form.addEventListener('submit', (event) => {
            util.p.spawn(function* () {
                event.preventDefault();

                page = yield saveNewData(inputs, page, author);

                redirect('view', { pageId: page.id });
            });
        });
    }

    function saveNewData({ textarea, titleInput }, page, author) {
        var revision = {
            author,
            content: textarea.value,
            timestamp: clock.now(),
        };

        if (page.new === true) {
            revision.isIndex = page.isIndex || false;
            revision.title = titleInput.value;
            return pageData.newPage(revision).then((page) => {
                return actionLogger.logAddPage(page).return(page);
            });
        }

        return pageData.newRevision(page.id, revision).then(() => {
            return actionLogger.logChangePage(page);
        }).return(page);
    }
}
