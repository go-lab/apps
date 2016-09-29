(function(starterApp) {
    starterApp.PostEditor = PostEditor;

    function PostEditor(container, languageHandler) {
        container = $(container);

        return {
            render: render,
            getPostContent: getPostContent
        };

        function render(post) {
            container.empty();

            if (! post) {
                throw new Error('No post given to postEditor.render.');
            }

            form(post).appendTo(container);
            container.find('input').first().focus();
        }

        function getPostContent() {
            return container.find('textarea').val();
        }

        function form(post) {
            return $(
            '<form action="#" method="post" data-post-id="' + post.id +'"></form>')
            .append($('<h2></h2>').text(post.title))
            .append(contentInput(post));
        }

        function contentInput(post) {
            var label = starterApp.util.escapeHTML(
                languageHandler.getMessage('content'));
            return $([
                '<div class="form-group">',
                    '<label for="post_content" class="sr-only">',
                        label,
                    '</label>',
                    '<textarea id="post_content" class="form-control" placeholder="' + label + '">',
                        starterApp.util.escapeHTML(post.content),
                    '</textarea>',
                '</div>'
            ].join(''));
        }
    }
})(golab.tools.starterApp);
