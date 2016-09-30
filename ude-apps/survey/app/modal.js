(function(ReflectionPoll) {
    ReflectionPoll.Modal =
    function Modal(id, getMsg) {
        id = id || ReflectionPoll.util.uuid();
        const labelId = id + '_label';
        const modal = getModal();

        modal.appendTo(document.body).modal({ show: false });

        return {
            open: function() {
                modal.modal('show');
            },
            close: function() {
                modal.modal('hide');
            },
            setHeading: function(heading) {
                modal.find('h4').text(heading);
            },
            setBody: function(bodyElement) {
                modal.find('.modal-body').empty().append($(bodyElement));
            },
            setFooter: function(footerElement) {
                modal.find('.modal-footer').empty().html($(footerElement)).show();
            }
        };

        function getModal() {
            const modalContent = $('<div />')
            .attr('class', 'modal-content')
            .append(getHeader())
            .append($('<div />').attr('class', 'modal-body'))
            .append($('<div />').attr('class', 'modal-footer').hide());

            return $('<div />')
            .attr({
                'class': 'modal fade',
                'tabindex': '1',
                'role': 'dialog',
                'aria-labelledby': labelId,
                'aria-hidden': 'true',
                'id': id
            })
            .append($('<div />').attr('class', 'modal-dialog').append(modalContent));
        }

        function getHeader() {
            const h4 = $('<h4 />').text('Modal').attr({
                'id': labelId,
                'class': 'modal-title'
            });

            return $('<div />')
            .attr('class', 'modal-header')
            .append(closeButton())
            .append(h4);
        }

        function closeButton() {
            const text = $('<span />').attr('aria-hidden', 'true').html('&times;');
            return $('<button />')
            .attr({
                'type': 'button',
                'class': 'close',
                'data-dismiss': 'modal',
                'aria-label': getMsg('close')
            }).append(text);
        }
    };
})(golab.tools.ReflectionPoll);