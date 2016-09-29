/**
 * Created by Peter on 17.12.2015.
 */
var key, value, count;
var countRemove = 0;


function createTable(item, counter) {

    if (counter === 1) {
        key = item;

        var keys = [];
        $('.key').each(function () {
            keys.push( $(this).data("key"));
        });

        if(keys.length === 0){
            count = 1;
        }else{
            count = (keys.length + 1) + countRemove;
            console.log(count);
        }

        finalTable(key, count);
        finalModal(count);
        count++;
    } else if (counter === 2){
        value = item;
        $('#value_' + (count - 1) +'').append(value);
        $('#newTerm_' + (count - 1) + '').val(value);
    } else {
        alert('Error ' + counter);
        console.log('error ' + counter + ' > 2');
    }
}

function finalTable(k,count){
    $(".trTmp")
        .clone()
        .attr("id", "Mapping_" + count)
        .attr("class", "Mapping")
        .append('<td class="key" id="key_' + count + '" data-key="' + k + '">' + k + '</td>'
        + '<td class="value" id="value_'+ count +'"></td>'
        + '<td id="edit_' + count + '" class="edit" title="edit">'
        + '<a class="edit_' + count + '" data-toggle="modal" data-target="#myModal_' + count + '">'
        + '<span class="glyphicon glyphicon-edit"></span></a></td>'
        + '<td id="remove_' + count + '" class="remove" title="remove" onclick="removeTr(' + count + ')">'
        + '<a class="remove_' + count + '"><span class="glyphicon glyphicon-remove"></span></a></td>')
        .appendTo(".tableBody");
    console.log("Hey table created")
}

function finalModal(count) {

    $("#myModal")
        .clone().empty()
        .attr("id", "myModal_" + count + "")
        .attr("name", "modalDynamic")
        .append(
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '<h4 class="modal-title">Edit Row</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p><i>Please change the term</i></p>' +
        '<br />' +
        '<label for="newTerm"><b style="padding:1.1em">New Term:</b></label>' +
        '<input id="newTerm_' + count + '" type="text" value="" /> ' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" id = "Set_' + count + '" title="Set Item" onclick="setNewItem(' + count + ')" class="btn btn-primary Set_' + count + '" data-dismiss="modal">Set</button>' +
        '<button type="button" id = "Delete_' + count + '" title="Delete Item" onclick="deleteNewItem(' + count + ')" class="btn btn-default Delete_' + count + '">Delete</button>' +
        '</div></div></div>').appendTo("body");
}

function removeTr(c) {

    var remove = window.confirm("Do you really want to delete this row? ");
    if(remove){
        $(".remove").parent("#Mapping_" + c + "").remove();
        $("#myModal_" + c + "").remove();
        countRemove++;
    }
    console.log(countRemove);
}

function deleteNewItem(c) {
    $('#newTerm_' + c + '').val('');
}

function setNewItem(c) {
    newTerm = $('#newTerm_' + c + '').val();
    $('#value_' + c + '').text(newTerm);
}
