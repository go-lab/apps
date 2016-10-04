/**
 * Created by Alexandros Trichos on 27/09/2015.
 * Geogebra
 * ver. 1
 */


//Global variables
var prefs = new _IG_Prefs();
var app = { context: "",
    viewer:"",
    viewerName: "",
    viewerId:"",
    data: "",
    ownerId: "",
    prefs: new gadgets.Prefs()};

var debug=true;                    //Toggles bug options
var typing_delay=0;             //Save timeout for 'stopped typing save'

var main_content=$("#main_content");
var errorDisplay=0;
var URL_STATUS=false;
var checkTimeout=0;
var global_geogebra_url="";
var global_geogebra_id="";
var geogebra_length=0;
var appId="";
var storageInfo= new Object();
var mode="student";
var answersArray= new Array();
var teacherName="";
var studentName="";
var geogebraInstance="";

function initialize () {       //Initialization function called during startup
    try {
        debuglogger("Initializing...");
        checkMode();
        //Check for "demo" mode
        if (mode=="student") {
            debuglogger("Student mode.");
            // If in student mode try the vault storage first
            $.when(getCurrentUser())
                .then(function(){
                    init_student_mode();
                })
        }else if(mode=="teacher"){
            debuglogger("Teacher mode.")  ;
            //Initialize student mode
            $.when(getTeacherName())
                .then(function(){
                    $.when(init_teacher_mode())
                        .then(function(){
                            debuglogger("Teacher Mode initialized.");
                        },function(){
                            debuglogger("Could not initialize (vault issue?)")
                        })
                },function(){
                    debuglogger("Could not initialize (cannot get teacher name)")
                })}
        else if (mode=="demo"){
            debuglogger("Demo mode.");
            // When in "demo mode"
            initializeGeogebra(app.prefs.getMsg('example_link_URL'));

        }
        var prefs = new gadgets.Prefs();
        var msg = prefs.getMsg('type_here');
        $("#scratchpad_text").attr("placeholder",msg);
        $("#main_content").show(function(){
            if (mode=="teacher"){
                teacherButtonActions();
            }
        });

    }catch(err){
        debuglogger("Could not complete initialization: "+err);
    }
}

function checkMode(){
    debuglogger("Checking mode...")
    var context=ils.identifyContext();
    var preview="preview";
        var graasp="graasp";
        var standalone_ils="standalone_ils";
        var standalone_html="standalone_html";
        debuglogger(context);
        if (context==preview) mode="demo";
        else if (context==graasp) {
            mode="teacher";
        }
}

var getTeacherName=function(){
    var deferred = $.Deferred();
    debuglogger("Getting teacher name...");
    ils.getCurrentUser(function(tn){
        teacherName=tn;
        if (teacherName){
            debuglogger("Teacher name found: "+teacherName);
            deferred.resolve()
        }else if(viewer.error){
            debuglogger("Error getting teacher name: "+viewer.error);
            deferred.reject()
        }else{
            debuglogger("Error getting teacher name: "+viewer.error);
            deferred.reject()
        }
    });
    return deferred.promise();
}


var init_teacher_mode=function(){
    var deferred = $.Deferred();
    $.when(set_vault_storage())
        .then(function(storageHandler){
            storageInfo.urlStorageHandler=storageHandler[0];
            storageInfo.answerStorageHandler=storageHandler[1];
            //If StorageHandler was initialized try to load data from vault
            debuglogger("StorageHandlers were initialized");
            $.when(load_data_vault(storageInfo.urlStorageHandler))
                .then(function(resource){
                    //If data were loaded from the vault put them in place and keep the id
                    storageInfo.resource=resource;
                    storageInfo.resourceId=storageInfo.resource.metadata.id;
                    $.when(checkURL(storageInfo.resource.content))
                        .then(function(){
                         debuglogger("Successfully loaded URL, Initializing geogebra...");
                         initializeGeogebra(storageInfo.resource.content);
                         displayTeacherControls();                           
                        },function(){
                            askURLfromUser();
                            debuglogger("No valid URL found, asking url from user...");
                            deferred.resolve();
                        });
                },function(){
                    //If data were not loaded from the vault try to create them
                    $.when(create_data_vault(storageInfo.urlStorageHandler))
                        .then(function(id){
                            //If data were created
                            storageInfo.resourceId=id;
                            askURLfromUser();
                            debuglogger("Resource could not be loaded, created resource and asking url from user...");
                            deferred.resolve();
                        },function(){
                            //If data could not be created
                            debuglogger("Vault data could not be created.");
                            deferred.reject();
                        })
                })
        },function(){
            debuglogger("StorageHandler could not be initialized.");
            deferred.reject();
        });
    return deferred.promise();
}

var init_student_mode=function(){
    var deferred = $.Deferred();
    
    $.when(set_vault_storage())   
        .then(function(storageHandler){           
            storageInfo.urlStorageHandler=storageHandler[0];
            storageInfo.answerStorageHandler=storageHandler[1];
            //If StorageHandler was initialized try to load data from vault
            debuglogger("StorageHandlers were initialized");
            $.when(load_data_vault(storageInfo.urlStorageHandler))
                .then(function(resource){
                    //If data were loaded from the vault put them in place and keep the id
                    storageInfo.resource=resource;
                    storageInfo.resourceId=storageInfo.resource.metadata.id;
                    $.when(checkURL(storageInfo.resource.content))
                        .then(function(){
                            debuglogger("Successfully loaded URL");
                            initializeGeogebra(storageInfo.resource.content);
                            debuglogger("Loading student data...");
                           
                        },function(){
                            //Data Could not be loaded
                            debuglogger("No valid URL found!");
                            $("#noValidGeogebra").show();
                            deferred.reject();
                        });
                },function(){
                    //Data Could not be loaded
                    debuglogger("No valid data were found!");
                    $("#noValidGeogebra").show();
                    deferred.reject();
                })
        },function(){
            debuglogger("StorageHandler could not be initialized.");
            $("#noValidGeogebra").show();
            deferred.reject();
        });
    return deferred.promise();
}


function set_vault_storage() {
    var deferred = $.Deferred();
    $.when(getAppId())
        .then(function(){
            golab.common.createEnvironmentHandlers(["geogebraResults", "configuration"], "Geogebra", golab.common.resourceLoader.getDesiredLanguage(),function(environmentHandlers) {
                debuglogger("created environment handlers for GeogebraMaster.");
                debuglogger(environmentHandlers);
                environmentHandlers.configuration.metadataHandler.setTargetDisplayName("Geogebra_Configuration");
                deferred.resolve([environmentHandlers.configuration.storageHandler,environmentHandlers.geogebraResults.storageHandler]);
            });
        });

    return deferred.promise();
}

function getAppId(){
    var deferred = $.Deferred();
    ils.getAppId(function(id){
        appId=id;
        deferred.resolve();
    });

    return deferred.promise();
}

function getURL(){
    var doc_url="";
    var deferred = $.Deferred();

        debuglogger("Loading url from Vault...");
        try {
            var prefs_url = prefs.getString("doc_url");
            if (prefs_url != "" && prefs_url != null) {
                debuglogger("Loaded user prefs url: " + prefs_url);
                return prefs_url;
            } else {
                debuglogger("User prefs url is either empty or invalid");
                return false;
            }

        } catch (err) {
            debuglogger("Cannot load url from vault...", err);
        }
}

function askURLfromUser()
{
    $(".loading_animation, .loading_error").hide();
    $("#doc_url_input_field").val('').empty().removeClass("error");
    $(".prompt_msg").show();
    $("#popup_group").fadeIn(1000,function(){
        adjustHeight();
    });

    $("#doc_url_input_field").on('input',function() {
        URL_STATUS=false;
        showlLoader();
        clearTimeout(errorDisplay);
        clearTimeout(typing_delay);
        typing_delay=setTimeout(function(){
            var temp_url=getField();
            var doc_url=transformURL(temp_url);
            var statusPromise = $.when(checkURL(doc_url));
            statusPromise.done(function(status){
                clearTimeout(errorDisplay);
                initActions(doc_url);
                URL_STATUS=true;
            }).fail(function(){
                clearTimeout(errorDisplay);
                showError();
            });
            errorDisplay=setTimeout(function(){
                showError();
            },2000)
        },1000)
    });

    function initActions(doc_url){
        saveURL(doc_url);
        $("#popup_group").fadeOut(500,function(){
            initializeGeogebra(doc_url);
        });
    }

    function getField(){
        return $("#doc_url_input_field").val();
    }

    function transformURL(tempURL){
        var fullURL="";

        if (tempURL.search("geogebra.org")>=0||!isNaN(tempURL)) {
            var patt = /[0-9]+/;
            var geogebraID = patt.exec(tempURL);
            if (geogebraID&&!isNaN(geogebraID)) {
                fullURL = "http://tube.geogebra.org/material/iframe/id/" + geogebraID + "/width/912/height/715/border/888888/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/true/ld/false/sri/true/at/auto";
            }
        }
        return fullURL;
    }

    function saveField(){
        var doc_url=getField();
        saveURL(doc_url);
    }

    function showError(){
        $(".loading_animation").stop(true,true).hide();
        $("#doc_url_input_button").stop(true,true).hide();
        $(".loading_error").stop(true,true).show();
        $("#doc_url_input_field").addClass("error");
    }
    function showlLoader(){

        $(".prompt_msg").hide();
        $(".loading_error").stop(true,true).hide();
        $("#doc_url_input_button").stop(true,true).hide();
        $(".loading_animation").stop(true,true).show();
        $("#doc_url_input_field").removeClass("error");
    }
}

function getCurrentUser(){
    var deferred= $.Deferred();
    ils.getCurrentUser(function(current_user){
        studentNameName=current_user;
        debuglogger(studentNameName);
        deferred.resolve();
    });
    return deferred.promise();
}

function checkURL(doc_url) {
    debuglogger("Checking url: ",doc_url)
    var deferred= $.Deferred();
    if(doc_url&&doc_url!=""){
        $.ajax({
            type: 'HEAD',
            url: doc_url,
            success: function(data) {
                deferred.resolve();
            },
            error: function() {
                deferred.reject();
            }
        });
    }else{
        deferred.reject();
    }
    return deferred.promise();
}

function load_data_vault(storageHandler){

    debuglogger("Loading application data from the vault...");
    var deferred = $.Deferred();

    storageHandler.configureFilters(true,false,true,true);

    storageHandler.readLatestResource("configuration", function(error, resource){
        if (error!=undefined) {
            debuglogger("No data is found: " + error);
            deferred.reject()

        } else {
            debuglogger("Logging resource:");
            debuglogger(resource);
            if (resource){
                debuglogger("Successfully loaded resource "+resource.metadata.id);
                if (resource.content===typeof ('string')){
                    resource.content=resource.content.trim();
                }
                deferred.resolve(resource);
            }else{
                debuglogger("Data are empty");
                deferred.reject()
            }
        }
    });

    return deferred.promise();
}

function saveURL(doc_url){
    debuglogger("Trying to store URL...");
    debuglogger("Saving application data for resource "+ storageInfo.resourceId +" to the vault...");
    var deferred = $.Deferred();
    debuglogger("URL store: "+doc_url);
    storageInfo.urlStorageHandler.updateResource(storageInfo.resourceId,doc_url, function(error, resource){
        if (error!=undefined) {
            debuglogger("Data for resource "+storageInfo.resourceId+" could not be updated: " + error);
            deferred.reject();

        } else {
            debuglogger("Successfully updated resource "+resource.metadata.id);
            deferred.resolve(resource);
        }
    })
    return deferred.promise();
}


function create_data_vault(storageHandler){

    debuglogger("Creating application data to the vault...");
    var deferred = $.Deferred();
    var GeogebraMasterText="";
    storageHandler.createResource(GeogebraMasterText, function(error, resource){
        if (error!=undefined) {
            debuglogger("Could not create data: " + error);
            deferred.reject();
        } else {
            debuglogger("Successfully created resource "+resource.metadata.id);
            console.log(resource);
            deferred.resolve(resource.metadata.id);
        }
    });
    return deferred.promise();
}

function initializeGeogebra(doc_url){
    global_geogebra_url=doc_url;
    var geogebraIframe='<iframe id="geogebraIftame" scrolling="no" src="'+doc_url+'" width="100%" height="715px" style="border:0px;" onLoad="autoResize()";> </iframe>';

    if (mode=="demo"){
        geogebraIframe='<iframe id="geogebraIftame" scrolling="no" src="'+doc_url+'" width="100%" height="400px" style="border:0px;" onLoad="autoResize()";> </iframe>';

    }
    geogebraInstance=$('#geogebra_container').html(geogebraIframe);

    $('#geogebra_container').fadeIn(500,function(){
        try{
            setTimeout(function(){
                adjustHeight();
                $("#openGeogebraButton, #editGeogebraButton").removeAttr("disabled");
                $("#geogebraLink").attr("href",global_geogebra_url).text(global_geogebra_url);
                $("#newGeogebraURL").val(global_geogebra_url);
            },2000);
        }
        catch(err){
            debuglogger("Couldn't set dynamic height.");
        }
    });
    return true;
}


function adjustHeight(){
    gadgets.window.adjustHeight();

}


function debuglogger() {                     //Custom logger for debugging purposes
    if (debug){
        var prefix="Geogebra App: "+appId+": ";
        for(var i = 0; i < arguments.length; i++) {
            console.log(prefix, arguments[i]);
        }
     }
}


jQuery.fn.center = function (orientation) {     //jquery function for centering an element in the screen
    this.css("position","absolute");
    if (orientation=="" || orientation==null || orientation===null) orientation="both";
    if (orientation=="horizontal" || orientation=="both"){
        this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
            $(window).scrollLeft()) + "px");
    }
    if (orientation=="vertical" || orientation=="both"){
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
            $(window).scrollTop()) + "px");
    }
    return this;
}


function teacherButtonActions(){
    $("#button_select").fadeIn(500);
    $("body")
        .on("click","#teacherViewButton",function(){
            $("#button_select button").removeClass("active");
            $(this).addClass("active");
            $("#geogebra_container, #change_geogebra").fadeOut(200,function(){
                $("#geogebra_results").fadeIn(200,function(){
                    adjustHeight();
                });
            });
        })
        .on("click","#changeGeogebraButton",function(){
            $("#button_select button").removeClass("active");
            $(this).addClass("active");
            $("#geogebra_container, #geogebra_results").fadeOut(200,function(){
                $("#change_geogebra").fadeIn(200,function(){
                    adjustHeight();
                });
            });
        })
        .on("click","#studentViewButton", function(){
            $("#button_select button").removeClass("active");
            $(this).addClass("active");
            $("#geogebra_results, #change_geogebra").fadeOut(200,function(){
                $("#geogebra_container").fadeIn(200,function() {
                    adjustHeight();
                });
            })
        });

}

function displayTeacherControls(){
    if (typeof global_geogebra_url=== 'string'){
        $("#currentGeogebraUrl").show();
        $("#openGeogebraButton, #editGeogebraButton").removeAttr("disabled");
        $("#geogebraLink").attr("href",global_geogebra_url).text(global_geogebra_url);
        $("#newGeogebraURL").val(global_geogebra_url);
    }else{
        $("#currentGeogebraUrl").hide();
        $("#geogebraFromXLS").show();
        $("#openGeogebraButton, #editGeogebraButton").attr("disabled","disabled");
    }

}

function editGeogebra(){
    var editURL=global_geogebra_url.replace("pubhtml","edit");
    window.open(editURL,'popup','width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,directories=no,location=no,menubar=no,status=no,left=0,top=0');
}
function openGeogebra(){
    window.open(global_geogebra_url,'popup','width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,directories=no,location=no,menubar=no,status=no,left=0,top=0');
}

function resetGeogebra(){
    $.when(saveURL(""))
        .then(function(){
            var geogebraClone='<div id="geogebra_container" style="display:none"></div>';
            $(geogebraClone).insertAfter(geogebraInstance);
            geogebraInstance.remove();
            geogebraInstance=geogebraClone;
            askURLfromUser();
            $("#studentViewButton").trigger('click');
        });
}

var generateUUID = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();
