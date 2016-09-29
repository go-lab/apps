/**
 * Created by Peter on 24.12.2015.
 */


function hashVisualize(savedHashmap) {

    if (savedHashmap){
        return savedHashmap;
    }

    //Hashmap as an associative Array
    var hashmap = {};

    var keys = [];
    $('.key').each(function () {
        keys.push( $(this).data("key").toUpperCase());
    });

    var values = [];
    $('.value').each(function () {
        values.push($(this).text().toUpperCase());
    });

    //create the HashMap
    for (var i = 0; i < values.length; i++) {
        if (values[i] !== '' && keys[i] !== '') {
            hashmap[keys[i]] = values[i];
        }
    }

    // check if object is empty
    if(Object.keys(hashmap).length === 0 && hashmap.constructor === Object) {
        return null;
    } else {
        return hashmap;
    }


}


/*

 elemClicked = $(this).text();

 function dblClick(elemClicked) {
 if (hashtable[elemClicked.name] != null) {
 return;
 if (checkIfValueExists(elemClicked)) {
 return;
 }
 }
 }
 function checkIfValueExists(val){
 for(var x in hashtable){
 if(hashtable[x] == val){
 return true;
 }
 return false;
 }
 }
 */