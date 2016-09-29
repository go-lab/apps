/**
 * Created by Peter on 22.10.2015.
 */

// Nav Bar Hamburger
var nav = $('.cmd-off-canvas-nav'),
    toggle = $('.cmd-off-canvas-toggle');


toggle.on('click touch', function () {
    $(this).toggleClass('cmd_is_active');
    nav.toggleClass('cmd_is_active');

});



//remove
function remove() {
    $('.MapSvgMain').html("");
    $('.pSlider').remove();
    $('.tableBodyListNamesHigh').empty();
    $('.tableBodyListNamesFilter').empty();
}

function removeBasic(){
    $('.MapSvgMain').html("");
    $('.pSlider').remove();
}

// show/hide sidebar
$(document).on('click', '.sidebar-toggler', function () {
    $("#sidebar").toggleClass("is-visible");
});


