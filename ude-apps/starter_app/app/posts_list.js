(function(starterApp) {
    starterApp.PostsList = PostsList;

    function PostsList(modal, languageHandler) {
        modal = $(modal);
        var openPostEvents = starterApp.PubSub();
        translateMarkup();
        initialize();

        return {
            show: show,
            hide: hide,
            onOpenPost: openPostEvents.subscribe,
        };

        function show(posts) {
            var table = postsTable(posts);
            modal.find('.modal-body').empty().append(table);
            modal.modal('show');
        }

        function hide() {
            modal.modal('hide');
        }

        function postsTable(posts) {
            var table = $('<table class="table table-striped"></table')
            .append([
                $('<thead></thead>').append([
                    $('<th></th>').text(languageHandler.getMessage('post_title')),
                    $('<th></th>').text(languageHandler.getMessage('last_change')),
                    $('<th></th>').text(languageHandler.getMessage('action')),
                ]),
                $('<tbody></tbody>')
            ]);
            table.find('tbody').append(posts.map(tableRow));
            return table;
        }

        function tableRow(post) {
            var date = starterApp.util.formatDate(
                post.lastChangeDate,
                languageHandler.getMessage('full_date_moment_format')
            );
            return $('<tr></tr>')
            .append([
                $('<td></td>').text(post.title),
                $('<td></td>').text(date),
                $('<td></td>').append(openButton(post))
            ])
            .data('post-id', post.id);
        }

        function openButton() {
            var openMsg = languageHandler.getMessage('open_post');
            return $('<button class="btn btn-default open_post" role="button" title="' +
                     openMsg + '"></button>')
            .append($('<span class="glyphicon glyphicon-arrow-right"></span>'))
            .append($('<span class="sr-only"></span>').text(openMsg));
        }

        function initialize() {
            modal.modal({
                show: false,
            });
            modal.on('click', 'button.open_post', function(event) {
                var postId = $(event.target).parents('tr').data('post-id');
                openPostEvents.publish(postId);
            });
        }

        function translateMarkup() {
            modal.find('#posts_list_label')
                 .text(languageHandler.getMessage('posts'));
            modal.find('.modal-header button')
                 .attr('aria-label', languageHandler.getMessage('close'));
        }
    }
})(golab.tools.starterApp);
