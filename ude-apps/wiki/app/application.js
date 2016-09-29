import util                             from 'app/util';
import LoadingIndicator                 from 'app/loading_indicator';
import RevisionComparison               from 'app/revision_comparison';
import EditPage                         from 'app/edit_page';
import Router                           from 'app/router';
import { makeDomTemplating }            from 'app/templating';
import { p, http as h, markdownToHtml } from 'app/util';


var RESOURCE_RECOMMENDATIONS_URL =
    'http://golab-dev.collide.info/analytics/resource_recommendations';
var RESOURCE_RECOMMENDATIONS_SCREENSHOT_URL =
    RESOURCE_RECOMMENDATIONS_URL + '_screenshot/';
var DOWNLOAD_WIKI_SERVICE_URL = 'http://golab-dev.collide.info/analytics/download_wiki_pages';

function dateToLocalString(date) {
    return moment(date).format('llll');
}
function localizeTimestamps(page) {
    page.currentRevision.timestamp =
        dateToLocalString(page.currentRevision.timestamp);
    page.revisions.forEach((r) => r.timestamp = dateToLocalString(r.timestamp));
}

export default function Application({
    pageData,
    actionLogger,
    metadataHandler,
    locale,
    localizedStrings,
    configHandler,
    }) {
    metadataHandler.setTargetDisplayName("wiki");
    var router = Router(window);
    var templating = makeDomTemplating(
        document.querySelector('#content'),
        document
    );

    var wikiIdEncoded = weirdEncodeURIComponent(metadataHandler.getGenerator().id);
    var exportingEnabled = metadataHandler.getContext() !== 'ils';
    var inGraasp = metadataHandler.getContext() === 'graasp';
    var render = function (templateId, variables) {
        variables.exportUrl = `${DOWNLOAD_WIKI_SERVICE_URL}?wikiId=${wikiIdEncoded}&locale=${locale}&`;
        variables.inGraasp = inGraasp;
        variables.exportingEnabled = exportingEnabled;
        return templating.render(templateId, variables);
    };

    moment.locale(locale);

    // this will get replaced once we introduce a view system
    Handlebars.registerHelper('t', (...args) => {
        return localizedStrings.get(...args);
    });

    var clock = {
        now() {
            return Date();
        },
    };
    var editPage = EditPage(templating, render, pageData, actionLogger, clock, localizedStrings);

    var getPage = pageData.getPage;

    router.setRequestHandlers({
        index: function* (params, redirect) {
            var pages = yield pageData.getPages();
            if (pages.length === 0) {
                return redirect('new');
            }
            var indexPage = pages.find((page) => page.isIndex);
            if (indexPage === undefined) {
                throw Error('No index page although there should be one.');
            }
            redirect('view', {pageId: indexPage.id});
        },

        pages: function* () {
            var createdAt = (page) => page.revisions[0];
            var pages = yield pageData.getPages();
            pages = pages.sort((pA, pB) => {
                return createdAt(pA) <= createdAt(pB) ? -1 : 1;
            });
            render('pages', {
                pages: pages,
                page_pages: true,
            });
            yield actionLogger.logAccessIndex();
        },

        view: function* (params, redirect) {
            var page = yield getPage(params.pageId);
            localizeTimestamps(page);
            var pageContent = markdownToHtml(page.currentRevision.content);
            // yield actionLogger.logViewPage(page);
            yield render('view', {
                page,
                pageContent,
                page_view: true,
            });

            $('a[href^=wiki]').each(function rewriteLinksToOtherWikiPages() {
                var [_, pageId] = $(this).attr('href').split(':');
                $(this).attr('href', `#view?pageId=${pageId}`);
            });

            yield actionLogger.logAccessView(page.id);
        },

        edit: function* (params, redirect) {
            var pages = yield pageData.getPages();
            var page = pages.filter((page) => {
                return page.id === params.pageId;
            })[0];
            localizeTimestamps(page);
            var author = metadataHandler.getActor().displayName;
            editPage.editExistingPage(page, pages, author, redirect);

            yield actionLogger.logAccessEdit(page.id);
        },

        new: function* (params, redirect) {
            var pages = yield pageData.getPages();
            var author = metadataHandler.getActor().displayName;
            editPage.newPage(pages, author, redirect);

            yield actionLogger.logAccessNew();
        },

        history: function* (params) {
            var page = yield getPage(params.pageId);
            localizeTimestamps(page);
            render('history', {
                page: page,
                page_history: true,
            });

            yield actionLogger.logAccessRevisions(page.id);
        },

        compare: function* (params) {
            var page = yield getPage(params.pageId);
            localizeTimestamps(page);
            var revisionToCompareId = params.revision;
            var diffHtml =
                RevisionComparison(page, revisionToCompareId, localizedStrings).asHtml();

            render('compare', {
                page: page,
                diff: diffHtml,
            });

            yield actionLogger.logAccessRevisionComparison(page.id, revisionToCompareId);
        },

        resource_recommendations: function* (params, redirect) {
            var wikiPage = yield getPage(params.pageId);
            localizeTimestamps(wikiPage);

            var recommsFetch = h.post(RESOURCE_RECOMMENDATIONS_URL, {
                text: wikiPage.currentRevision.content,
            });

            var _render = render('resource_recomms_page', {
                page: wikiPage,
                page_resource_recomms: true,
            });

            yield _render;

            var resultsElement = $('.resource_recomms .results');

            var loadingIndicator = LoadingIndicator(resultsElement[0]);

            var error = false;
            var resources = [];

            try {
                var fetchResult = yield recommsFetch;
                resources = fetchResult.content;
            } catch (e) {
                error = true;
                console.warn('Error while fetching resource recommendations: %o', e);
            }

            loadingIndicator.stop();

            resources.forEach((r) => {
                // the server proxy can't handle urlencoded slashes
                var url = weirdEncodeURIComponent(r.url);
                r.screenshotUrl = RESOURCE_RECOMMENDATIONS_SCREENSHOT_URL + url;
            });

            var recommsListing = yield templating.get('resource_recomms_listing', {
                error,
                resources,
            });

            resultsElement.html(recommsListing);

            var imageLoadingIndicators = [];
            var imageCount = 0;
            var imagesLoaded = 0;

            $('.img-loading').each(function () {
                imageLoadingIndicators.push(LoadingIndicator(this));
                imageCount++;
            });

            $('.thumbnail img').on('load error', function () {
                imagesLoaded++;
                if (imagesLoaded === imageCount) {
                    imageLoadingIndicators.forEach((li) => li.stop());
                }
                $(this).siblings('.img-loading').slideUp(150);
            });

            $('.thumbnail').on('click', function (event) {
                var url = $(this).attr('href');
                var resource = resources.find((r) => r.url === url);
                actionLogger.logAccessRecommendedResource(wikiPage.id, resource);
            });

            yield actionLogger.logAccessResourceRecommendations(wikiPage.id);
        },
        'configure': function*(params, redirect) {
            yield render('configure', {
                page_configure: true,
                isCollaborative: configHandler.getEntry('collaborative') === 'true',
            });

            $('#page.configure #collaborativityOption').on('change', () => {
                configHandler.writeConfig({
                    'collaborative': $(event.target).prop('checked').toString()
                });
            });
        }
    });

    router.beginRouting();
}

function weirdEncodeURIComponent(uri) {
    // server cannot handle uri encoded slashes
    return encodeURIComponent(uri.replace(/\//g, '__SLASH__'));
}

