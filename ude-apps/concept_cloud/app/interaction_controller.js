(function(conceptCloud) {

    conceptCloud.InteractionController = InteractionController;
    var resourceController;
    var tagCloud;
    var metadataHandler;
    var languageHandler;

    function initializeMessageBundles() {
        //initialize localization for html


        $("#st_legend_concept_not_used").text(languageHandler.getMessage('legend_concept_not_used')+" | ");
        $("#st_legend_concept_used").text(languageHandler.getMessage('legend_concept_used')+" | ");
        $("#st_legend_concept_use_not_possible").text(languageHandler.getMessage('legend_concept_use_not_possible'));

        $("#t_legend_concept_not_used").text(languageHandler.getMessage('legend_concept_not_used')+" | ");
        $("#t_legend_concept_used").text(languageHandler.getMessage('legend_concept_used')+" | ");
        $("#t_legend_concept_use_not_possible").text(languageHandler.getMessage('legend_concept_use_not_possible'));

        $("#legend_concept_not_used_yet").text(languageHandler.getMessage('legend_concept_not_used_yet')+" | ");
        $("#legend_concept_used_partially").text(languageHandler.getMessage('legend_concept_used_partially')+" | ");
        $("#legend_concept_used_everywhere").text(languageHandler.getMessage('legend_concept_used_everywhere'));

        $("#counter_span").text(languageHandler.getMessage('counter_span'));

        $("#filter-title-phase").text(languageHandler.getMessage('filter_title_phase'));
        $("#filter-title-app").text(languageHandler.getMessage('filter_title_app'));
        $("#filter-title-student").text(languageHandler.getMessage('filter_title_student'));

        $("#info-fancy").html('<i class="notify flashy fa fa-exclamation-circle"></i> ' + languageHandler.getMessage('info_fancy'));
        $("#info-flashy").html('<i class="notify fancy fa fa-star"></i> ' + languageHandler.getMessage('info_flashy'));
    }

    function InteractionController() {
        resourceController = conceptCloud.resourceController;
        metadataHandler = conceptCloud.retrieverMetadataHandler;
        tagCloud = conceptCloud.tagCloud;
        languageHandler = conceptCloud.languageHandler;
        initializeMessageBundles();

        // REFRESH
        conceptCloud.toolbar.onActionClick('refresh', function() {
            console.log("refreshing conceptCloud...");
            conceptCloud.toolbar.setLastRefresh(null);
            tagCloud.initialize();
        });

        return {};
    }

    function resetTeacherView() {
        // reset conceptCloud to initial teacher view
        tagCloud.applyPhaseFilter(null);
        tagCloud.removeCurrentStudent();
        tagCloud.setTagsToDefault();

        if ($('#wrapper-app').hasClass('student-view')) {
            $('#wrapper-app').removeClass('student-view');
            $('#wrapper-app').addClass('teacher-view');
        }
    }

    function setPhaseWidth() {
        $('.phase-detail').each( function() {
            $(this).css('width', 100/conceptCloud.ilsPhases.length + '%');
        });
    }

    function printPhaseList(phaseList, phaseColors) {

        var phases = tagCloud.removeIds(conceptCloud.ilsPhases);

        for(var i = 0; i < phases.length; i++) {
            var currentColor = typeof phaseColors === 'string' ? phaseColors : phaseColors[i];
            $(phaseList).append('<div class="phase-detail ' + currentColor + '">' + phases[i] + '</div>');
        }
    }

    // STUDENT Modal
    function buildStudentModal(tagName, tagClass){
        var adressText;
        var phaseList = $('.row.phases');
        var selectedStudent = tagCloud.returnCurrentStudent;

        // remove previous modal content
        $(phaseList).html('');

        // load color specific text
        if(tagClass == 'red') {
            adressText = languageHandler.getMessage('no_concept_used') + tagName+"\n"+languageHandler.getMessage('no_concept_used_advice') ;
        } else if (tagClass == 'yellow') {
            adressText = languageHandler.getMessage('concept_used_not_consistently')+ tagName+"\n"+languageHandler.getMessage('concept_used_not_consistently_advice') ;
        } else if(tagClass == 'green'){
            adressText = languageHandler.getMessage('concept_used_consistently')+ tagName+"\n"+languageHandler.getMessage('concept_used_consistently_advice') ;
        }

        // set modal heading
        $("#tag_information").find(".user_name").html(selectedStudent);
        // show color specific adresstext
        $("#tag_information").find(".anspracheText").html(adressText);

        // check phases for correct coloring
        comparePhases(conceptCloud.userModel, function(phaseColors){
            printPhaseList(phaseList, phaseColors);
            setPhaseWidth();
        }, tagName);

        // select and show tag specific reflection question
        if(conceptCloud.showQuestions) {
            selectQuestions(tagName);
        }
    }

    // TEACHER Modal
    function buildTeacherModal(tagName, tagClass){

        var text;
        var selectedStudent;
        var phaseList;

        // show message
        $("#tag_information").find(".used_concepts").html(languageHandler.getMessage('students_used_concept'));

        // show all students related to this tag
        tagCloud.buildFilteredStudentList(tagName);

        // student is selected in sidebar
        if(tagCloud.returnCurrentStudent() != undefined) {
            selectedStudent = tagCloud.returnCurrentStudent();
            phaseList = $('.row.phases');
            $(phaseList).html('');

            if(tagClass == 'red') {
                text = languageHandler.getMessage('students_used_concept_in_no_phase');
            } else {
                text = languageHandler.getMessage('students_used_concept_in_phases');
            }

            comparePhases(conceptCloud.userModel[tagCloud.returnCurrentStudent()], function (phaseColors) {
                printPhaseList(phaseList, phaseColors);
                setPhaseWidth();
            }, tagName);

            $('li.student.filtered').each(function(){
                if($('li.student.filtered').hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                if($(this).find('span.studentName').text() == selectedStudent){
                    $(this).addClass('selected');
                }
            });

            $('.inactive .paragraph').removeClass('inactive');

            $("#tag_information").find(".info .user_name").html(selectedStudent + " ");
            $("#tag_information").find(".info .text").html(text);

            if($('.phase-legende').hasClass('hidden')) {
                $('.phase-legende').removeClass('hidden');
            }
        } else {
            // no student is selected in sidebar
            $('.student.info.paragraph').find(".user_name").html("");   // delete user_name
            $('.student.info.paragraph').find(".text").html("");        // delete texts
            $('.phasen.paragraph').find(".row.phases").html("");        // delete phases
            if($('.phase-legende').hasClass('hidden')) {
                $('.phase-legende').addClass('hidden');                 // hide legende if visible
            }

        }
    }

    function selectQuestions(conceptName) {
        $('.reflection.paragraph').find('.questions').html('');
        var conceptQuestions = conceptCloud.conceptModels.returnQuestions();
        if(Object.keys(conceptQuestions).length != 0) {
            for (var i in conceptQuestions[conceptName]) {
                $('.reflection.paragraph')
                    .find('.questions')
                    .append(
                        '<li>' +
                            '<i class="fa fa-caret-right"></i>' + conceptQuestions[conceptName][i] +
                        '</li>');
            }
        } else {
            $('.reflection.paragraph').find('.questions')
                .append(
                    '<li concept="' + conceptName + '" class="reload-questions">' +
                        '<i class="fa fa-refresh"></i>'+languageHandler.getMessage('err_could_not_load_questions') +
                    '</li>');
        }
    }

    function comparePhases(model, callback, tagName){
        var result = [];
        // get information about phases with used apps
        var phasesWithApps = tagCloud.removeIds(conceptCloud.generalModel.metadata.phasesWithApps);

        /*
         CSS Classes:
         Green: no-interaction-required
         Red: interaction-required
         Grey: interaction-less
         */

        for(var j in conceptCloud.generalModel.metadata.phases){
            var phaseStatus = "interaction-required";
            var phaseName = conceptCloud.generalModel.metadata.phases[j].split('@')[0];

            if($.inArray(phaseName, phasesWithApps) == -1) {
                // phase doesn't include any apps
                // grey
                phaseStatus = "interaction-less";
            } else {
                // phase include apps
                // check if red or green
                if(conceptCloud.retrieverMetadataHandler._context === 'preview') {
                    // Standalone or Preview Mode
                    if(model[tagCloud.returnCurrentStudent()].data[tagName] === undefined) {

                        // user hasn't used concept in phase yet
                        // red
                        phaseStatus = "interaction-required";
                    } else {
                        for (var i in model[tagCloud.returnCurrentStudent()].data[tagName]) {
                            var localPhaseName = i.split('@')[0];
                            if (localPhaseName == phaseName) {
                                // user has used concept in phase
                                // green
                                phaseStatus = "no-interaction-required";
                            }
                        }
                    }
                } else {
                    if(model.data[tagName] === undefined) {
                        // user hasn't used concept in phase yet
                        // red
                        phaseStatus = "interaction-required";
                    } else {
                        for (var i in model.data[tagName]) {

                            var localPhaseName = i.split('@')[0];

                            if (localPhaseName == phaseName) {
                                // user has used concept in phase
                                // green
                                phaseStatus = "no-interaction-required";
                            }
                        }
                    }
                }
            }
            result.push(phaseStatus);
        }
        callback(result);
    }


    //change glyphicon
    $('.panel-collapse.collapse').on('hide.bs.collapse', function () {
        $(this).parent('.panel-default')
            .find('.panel-heading')
            .find('.glyphicon')
            .toggleClass('glyphicon glyphicon-plus')
            .toggleClass('glyphicon glyphicon-minus');
        if($(this).find('li').hasClass('selected')){
            resetTeacherView();
            // remove "selected" class from all list items
            $.each($(this).find('li'),function() {
                $(this).removeClass('selected');
            });
        }
    });


    $('.panel-collapse.collapse').on('show.bs.collapse', function () {
        $(this).parent('.panel-default')
            .find('.panel-heading')
            .find('.glyphicon')
            .toggleClass('glyphicon glyphicon-plus')
            .toggleClass('glyphicon glyphicon-minus');
    });

    // teacher interaction
    $(function() {

        // show/hide sidebar
        $(document).on('click', '.sidebar-toggler', function () {
            $("#sidebar").toggleClass("is-visible");
        });

        // hide sidebar on outside click
        $('#tag_cloud').on('click', 'text', function () {
            if ($('#sidebar').hasClass('is-visible')) {
                $('#sidebar').removeClass('is-visible');
            }
        });

        // show/hide sidebar
        $(document).on('click', '.analytics-toggler', function () {
            $("#evolution").toggleClass("is-visible");
        });

        // hide sidebar on outside click
        $('#tag_cloud').on('click', 'text', function () {
            if ($('#evolution').hasClass('is-visible')) {
                $('#evolution').removeClass('is-visible');
            }
        });

        // select student in sidebar
        $(document).on('click', 'li.student.complete', function () {

            var selectedStudent = $(this).find("span").text();

            tagCloud.applyPhaseFilter(null);

            if ($(this).hasClass('selected')) {
                resetTeacherView();
                // list styling
                $(this).removeClass('selected');

            } else {
                tagCloud.setCurrentStudent(selectedStudent);
                tagCloud.applyStudentFilter(selectedStudent);
                // list styling
                $.each($('li.student'), function () {
                    $(this).removeClass('selected');
                });
                $(this).addClass('selected');

            }
            conceptCloud.loggingInterface.accessFilter(conceptCloud.userModel[selectedStudent], "userModel", "studentFilter");
        });

        // select phase in sidebar
        $(document).on('click', 'li.phase', function () {
            if(conceptCloud.aggregatedView) {
                var selectedPhase = $(this).find("span").text();

                if ($(this).hasClass('selected')) {
                    tagCloud.applyPhaseFilter(null);

                    // list styling
                    $(this).removeClass('selected');
                } else {
                    tagCloud.applyPhaseFilter(selectedPhase);

                    // list styling
                    $.each($('li.phase'), function () {
                        $(this).removeClass('selected');
                    });
                    $(this).addClass('selected');
                }
                conceptCloud.loggingInterface.accessFilter(selectedPhase, "phase", "phaseFilter");
            }
        });

        // select app in sidebar
        $(document).on('click', 'li.app', function () {
            var selectedApp = $(this).find("span").attr("id");

            if ($(this).hasClass('selected')) {

                tagCloud.applyAppFilter(null);

                // list styling
                $(this).removeClass('selected');
            } else {
                tagCloud.applyAppFilter(selectedApp);

                // list styling
                $.each($('li.app'), function () {
                    $(this).removeClass('selected');
                });
                $(this).addClass('selected');
            }
            conceptCloud.loggingInterface.accessFilter(selectedApp, "app", "appFilter");
        });

        // show modal
        $(document).on('click', 'text', function () {
            var tagName = $(this).text();
            var tagClass = $(this).attr("class");


            if(!conceptCloud.aggregatedView) {
                buildStudentModal(tagName, tagClass);

            } else {
                buildTeacherModal(tagName, tagClass);
            }

            $("#tag_information").find(".modal-title")
                .html(tagName)
                .attr("class", "modal-title " + tagClass);
            $("#tag_information").find(".counter")
                .html(tagCloud.returnTagFrequency(tagName));
            $("#tag_information").modal('toggle');
            conceptCloud.loggingInterface.accessModal(tagName, tagClass, tagCloud.returnTagFrequency(tagName));

        });

        // reload reflection questions
        $(document).on('click', '.reload-questions', function() {
            selectQuestions($(this).attr("concept"));
        });


    });

})(golab.tools.conceptCloud);