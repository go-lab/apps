/**
 * Created by richard on 16.01.16.
 */

(function (starterApp) {

    starterApp.InteractionController = InteractionController;
    var resourceController;
    var metadataHandler;
    var languageHandler;
    var configDialog;
    var toolbar;
    var groupFormation;

    var navBar = $('#navBar');
    var overviewDiv = $('#overviewDiv');
    var participationDiv = $('#participationDiv');
    var calculationDiv = $('#calculationDiv');
    var artifactsDiv = $('#artifactDiv');
    var artifactTable = $('#artifactTable');
    var resultDiv = $('#resultDiv');

    var studentDiv = $('#studentDiv');
    var studentTable = $('#studentTable');

    var synonymsDiv = $('#synonymDiv');

    function InteractionController() {

        initialize();

        return {
            setGroupFormation: setGroupFormation,
            refresh: refresh
        };

        function initialize() {
            resourceController = starterApp.resourceController;
            metadataHandler = starterApp.metadataHandler;
            languageHandler = starterApp.languageHandler;
            configDialog = starterApp.configDialog;
            toolbar = starterApp.toolbar;

            setToolbarActionListeners();
            setNavBarActionListeners();
            setSynonymDivActionListeners();
            loadStoredSynonymData();
            transalteStaticLanguageStrings();

            $('#navBarOverview').click();
        }

        function transalteStaticLanguageStrings() {

            navbarStrings();
            divHeadings();
            $('#selectionSummaryHeading').text(languageHandler.getMessage('selectionSummaryHeading'));


            function navbarStrings() {

                $('#navBarResultSpan').text(languageHandler.getMessage('navBarResult'));
                $('#navBarCalculationSpan').text(languageHandler.getMessage('navBarCalculation'));
                $('#navBarSummarySpan').text(languageHandler.getMessage('navBarSummary'));
                $('#navBarParticipationSpan').text(languageHandler.getMessage('navBarParticipation'));
                $('#navBarSourcesSpan').text(languageHandler.getMessage('navBarSources'));
                $('#navBarStudentsSpan').text(languageHandler.getMessage('navBarStudents'));
                $('#navBarSynonymsSpan').text(languageHandler.getMessage('navBarSynonyms'));
            }

            function divHeadings() {

                $('#resultDivHeadingSpan').text(languageHandler.getMessage('resultDivHeading'));
                $('#calculationDivHeadingSpan').text(languageHandler.getMessage('calculationDivHeading'));
                $('#overviewDivHeadingSpan').text(languageHandler.getMessage('overviewDivHeading'));
                $('#synonymDivHeadingSpan').text(languageHandler.getMessage('synonymDivHeading'));

            }

        }

        function setToolbarActionListeners() {

            toolbar.onActionClick('refresh', function () {
                try {
                    console.log("...refreshing Data...");
                    starterApp.loadingIndicator.show();
                    refresh();
                } catch (error) {
                    starterApp.handleError(error, languageHandler.getMessage('refresh_error'));
                }
            });

            toolbar.onActionClick('configure', function () {
                try {
                    openConfig();
                } catch (error) {
                    starterApp.handleError(error);
                }
            });

            toolbar.onActionClick('devFlag', function () {
                try {
                    starterApp.errorDisplay.show(languageHandler.getMessage('devModeFlagInfo'));
                } catch (error) {
                    starterApp.handleError(error);
                }
            });

        }

        function setNavBarActionListeners() {

            navBar.children().click(function () {
                navBar.children().removeClass('active');
                $(this).addClass('active');

                $('#navBarDivs').children().each(function () {
                    $(this).hide();
                });


                switch (this.id) {

                    case 'navBarResult':
                        resultDiv.show();
                        break;

                    case 'navBarCalculation':
                        calculationDiv.show();
                        break;

                    case 'navBarOverview':
                        overviewDiv.show();
                        break;

                    case 'navBarParticipation':
                        participationDiv.show();
                        break;

                    case 'navBarArtifacts':
                        artifactsDiv.show();
                        break;

                    case 'navBarStudents':
                        studentDiv.show();
                        break;

                    case 'navBarSynonyms':
                        synonymsDiv.show();
                        break;

                    default:
                        console.log(this.id);
                        throw 'navBar click, id not found'

                }

            });

        }

        function loadStoredSynonymData() {

            resourceController.retrieveSynonymData(function (error, resource) {

                if (error != undefined) {

                    console.log('error loading synyonym data');

                } else if (resource) {

                    var synonymContent = resource.content.synonyms;

                    resourceController.synonymData = synonymContent;

                    for (var i = 0; i < synonymContent.length; i++) {

                        var synonymCloneDiv = $('#synonymTemplateDiv').clone(true, true);
                        synonymCloneDiv.removeAttr('style');
                        synonymCloneDiv.removeAttr('id');
                        synonymCloneDiv.find('.synonymGenTermHeader').append(synonymContent[i].genericTerm);

                        var table = synonymCloneDiv.find('table');
                        table.addClass('synonymTable');


                        for (var x = 0; x < synonymContent[i].synonyms.length; x++) {

                            var synonymTerm = synonymContent[i].synonyms[x];
                            var inputTermRow = table.find('.inputTermRowT');

                            var clonedInputRow = inputTermRow.clone(true, true);
                            clonedInputRow.removeAttr('style');
                            clonedInputRow.removeClass('inputTermRowT');
                            clonedInputRow.addClass('inputTermRow');
                            inputTermRow.before(clonedInputRow);

                            clonedInputRow.find('div').replaceWith(synonymTerm);
                            clonedInputRow.removeClass('inputTermRow');
                            clonedInputRow.addClass('termRow');

                        }

                        $('#synonymTableContainer').append(synonymCloneDiv);

                    }

                } else {
                    console.log('no stored snyonym data');

                }

            });
        }

        function setSynonymDivActionListeners() {

            $('#showConceptAggregationSynBtn').click(function () {

                var conAggPackage = resourceController.assembleConceptAggregationDataPackage();

                resourceController.sendConceptAggregationRequest(conAggPackage, function onError(error) {

                    starterApp.errorDisplay.show('Error requesting concept aggregation');

                }, function onSuccess(result) {

                    showConceptsDialog(result.conceptAggregationList)


                });

                function showConceptsDialog(conceptList) {

                    var multiUseDialog = $('#multiUseDialog');
                    var multiUseDialogHeader = multiUseDialog.find('.modal-header').empty();
                    var multiUseDialogBody = multiUseDialog.find('.modal-body').empty();

                    multiUseDialogHeader.append(headerContent());
                    multiUseDialogBody.append(bodyContent());

                    multiUseDialog.modal('show');

                    function headerContent() {

                        return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Concept Aggregation</h4>';

                    }

                    function bodyContent() {

                        var dialogDiv = $('<div></div>')
                            .append(aggregatedConceptsDiv());

                        return dialogDiv;

                        function aggregatedConceptsDiv() {

                            return $('<div></div>')
                                .append('<h4>Concepts of selected artifacts and students: <span class="badge">' + conceptList.length + '</span></h4>')
                                .append('<div>' + conceptList.sort().toString().split(',').join(', ') + '</div>');

                        }


                    }

                }

            });

            $('#synonymAddTableBtn').click(function () {

                var synonymGenTerm = $('#synonymAddInput').val().trim();

                if (checkInput()) {

                    addSynonymTable();
                    storeSynonyms();
                    updateSelectionSummary();
                }

                function addSynonymTable() {

                    var synonymCloneDiv = $('#synonymTemplateDiv').clone(true, true);
                    synonymCloneDiv.removeAttr('style');
                    synonymCloneDiv.removeAttr('id');
                    synonymCloneDiv.find('.synonymGenTermHeader').append(synonymGenTerm);
                    synonymCloneDiv.find('table').addClass('synonymTable');

                    $('#synonymTableContainer').append(synonymCloneDiv);

                }

                function checkInput() {

                    if (synonymGenTerm.length === 0 || !synonymGenTerm.trim()) {
                        starterApp.errorDisplay.show(languageHandler.getMessage('termMustNotBeEmpty'));
                        $('#synonymAddInputDiv').addClass('has-error');
                        $('#synonymAddInput').val('');
                        return false;
                    } else {

                        if (checkForBeingUnique()) {

                            $('#synonymAddInputDiv').removeClass('has-error');
                            return true;
                        } else {

                            starterApp.errorDisplay.show(languageHandler.getMessage('tableSynonymExists') + ' ' + synonymGenTerm);
                            $('#synonymAddInputDiv').addClass('has-error');
                            $('#synonymAddInput').val('');
                            return false;

                        }
                    }

                    function checkForBeingUnique() {

                        var isUnique = true;

                        $('.synonymGenTermHeader').each(function () {

                            if ($(this).text().trim().toLowerCase() == synonymGenTerm.toLowerCase())
                                isUnique = false;
                        });

                        return isUnique;
                    }

                }

            });

            $('.addTermBtn').click(function () {

                var inputTermRow = $(this).closest('.addButtonRow').prevAll('.inputTermRowT');
                var clonedInputRow = inputTermRow.clone(true, true);
                clonedInputRow.removeAttr('style');
                clonedInputRow.removeClass('inputTermRowT');
                clonedInputRow.addClass('inputTermRow');
                inputTermRow.before(clonedInputRow);

                $(this).closest('.addButtonRow').hide();

                $(this).closest('.addButtonRow').nextAll('.confirmBtnRow').show();

            });

            $('.confirmTermBtn').click(function () {

                var confirmBtnRow = $(this).closest('.confirmBtnRow');
                var inputTermRow = confirmBtnRow.prevAll('.inputTermRow');
                var input = inputTermRow.find('input');
                var inputValue = input.val().trim();

                if (checkInput()) {
                    inputTermRow.find('div').replaceWith(inputValue);
                    inputTermRow.removeClass('inputTermRow');
                    inputTermRow.addClass('termRow');
                    confirmBtnRow.hide();
                    confirmBtnRow.prev('.addButtonRow').show();
                    storeSynonyms();
                    updateSelectionSummary();
                }

                function checkInput() {

                    if (inputValue.length === 0 || !inputValue.trim()) {
                        starterApp.errorDisplay.show(languageHandler.getMessage('termMustNotBeEmpty'));
                        $(inputTermRow.find('div')).addClass('has-error');
                        $(input).val('');
                        return false;
                    } else {

                        if (checkForBeingUnique()) {

                            $(inputTermRow.find('div')).removeClass('has-error');
                            return true;
                        } else {

                            starterApp.errorDisplay.show(languageHandler.getMessage('entryExistsInSynonymTable') + ' ' + inputValue);
                            $(inputTermRow.find('div')).addClass('has-error');
                            input.val('');
                            return false;

                        }

                    }

                    function checkForBeingUnique() {

                        var isUnique = true;

                        confirmBtnRow.siblings('.termRow').find('.termData').each(function () {

                            $(this).each(function () {
                                if ($(this).text().trim().toLowerCase() == inputValue.toLowerCase())
                                    isUnique = false;
                            });

                        });

                        return isUnique;
                    }

                }

            });

            $('.cancelTermBtn').click(function () {

                var confirmRow = $(this).closest('.confirmBtnRow');
                var addButtonRow = confirmRow.prevAll('.addButtonRow');
                var inputTermRow = confirmRow.prevAll('.inputTermRow');
                confirmRow.hide();
                inputTermRow.remove();
                addButtonRow.show();
            });

            $('.editModeBtn').click(function () {

                var table = $(this).closest('table');
                table.find('.editColumn').show();
                table.find('.addButtonRow').hide();
            });

            $('.stopEditBtn').click(function () {

                var table = $(this).closest('table');
                table.find('.editColumn').hide();
                table.find('.addButtonRow').show();
            });

            $('.editGenTermBtn').click(function () {

                var table = $(this).closest('table');
                table.find('.editColumn').hide();

                var genTermRow = $(this).closest('.genTermRow');
                var oldGenTermValue = genTermRow.find('.termData').text();
                genTermRow.hide();

                var rnGenTermRow = genTermRow.next('.rnGenTermRow');
                rnGenTermRow.find('input').val(oldGenTermValue);
                rnGenTermRow.show();
            });

            $('.rmGenTableBtn').click(function () {
                $(this).closest('.synonymTableDiv').remove();
                storeSynonyms();
                updateSelectionSummary();
            });

            $('.confirmRnGTermBtn').click(function () {

                var rnGenTermRow = $(this).closest('.rnGenTermRow');
                var genTermRow = rnGenTermRow.prevAll('.genTermRow');
                var input = rnGenTermRow.find('input');
                var inputValue = input.val().trim();

                if (checkInput()) {
                    genTermRow.find('.termData').text(inputValue);
                    rnGenTermRow.hide();
                    genTermRow.show();
                    var table = $(this).closest('table');
                    table.find('.editColumn').show();
                    storeSynonyms();
                    updateSelectionSummary();
                }

                function checkInput() {

                    if (inputValue.length === 0 || !inputValue.trim()) {
                        starterApp.errorDisplay.show(languageHandler.getMessage('termMustNotBeEmpty'));
                        $(rnGenTermRow.find('div')).addClass('has-error');
                        $(input).val('');
                        return false;
                    } else {

                        if (checkForBeingUnique()) {

                            $(rnGenTermRow.find('div')).removeClass('has-error');
                            return true;
                        } else {

                            starterApp.errorDisplay.show(languageHandler.getMessage('tableSynonymExists') + ' ' + inputValue);
                            $(rnGenTermRow.find('div')).addClass('has-error');
                            input.val('');
                            return false;

                        }

                    }

                    function checkForBeingUnique() {

                        var isUnique = true;

                        $('.synonymGenTermHeader').each(function () {

                            if ($(this).text().trim().toLowerCase() == inputValue.toLowerCase())
                                isUnique = false;
                        });

                        return isUnique;
                    }

                }


            });

            $('.cancelRnGTermBtn').click(function () {

                var rnGenTermRow = $(this).closest('.rnGenTermRow');
                rnGenTermRow.prevAll('.genTermRow').show();
                rnGenTermRow.hide();
                rnGenTermRow.find('div').removeClass('has-error');

                var table = $(this).closest('table');
                table.find('.editColumn').show();

            });

            $('.editTermBtn').click(function () {
                var table = $(this).closest('table');
                table.find('.editColumn').hide();

                var inputTermRow = $(this).closest('.termRow');
                var oldTermRowValue = inputTermRow.find('.termData').text().trim();
                inputTermRow.hide();

                var rnTermRow = inputTermRow.nextAll('.rnTermRow');
                rnTermRow.find('input').val(oldTermRowValue);
                inputTermRow.after(rnTermRow);
                rnTermRow.show();
            });

            $('.confirmRnTermBtn').click(function () {

                var rnTermRow = $(this).closest('.rnTermRow');
                var termRow = rnTermRow.prev('.termRow');
                var input = rnTermRow.find('input');
                var inputValue = input.val().trim();
                var addButtonRow = termRow.nextAll('.addButtonRow');

                if (checkInput()) {
                    termRow.find('.termData').text(inputValue);
                    rnTermRow.hide();
                    addButtonRow.before(rnTermRow);
                    termRow.show();
                    var table = $(this).closest('table');
                    table.find('.editColumn').show();
                    storeSynonyms();
                    updateSelectionSummary();
                }

                function checkInput() {

                    if (inputValue.length === 0 || !inputValue.trim()) {
                        starterApp.errorDisplay.show(languageHandler.getMessage('termMustNotBeEmpty'));
                        $(rnTermRow.find('div')).addClass('has-error');
                        $(input).val('');
                        return false;
                    } else {

                        if (checkForBeingUnique()) {

                            $(rnTermRow.find('div')).removeClass('has-error');
                            return true;
                        } else {

                            starterApp.errorDisplay.show(languageHandler.getMessage('entryExistsInSynonymTable') + ' ' + inputValue);
                            $(rnTermRow.find('div')).addClass('has-error');
                            input.val('');
                            return false;

                        }

                    }

                    function checkForBeingUnique() {

                        var isUnique = true;

                        rnTermRow.siblings('.termRow').find('.termData').each(function () {

                            $(this).each(function () {
                                if ($(this).text().trim().toLowerCase() == inputValue.toLowerCase())
                                    isUnique = false;
                            });

                        });

                        return isUnique;
                    }

                }

            });

            $('.cancelRnTermBtn').click(function () {

                var rnTermRow = $(this).closest('.rnTermRow');
                rnTermRow.prevAll('.termRow').show();
                rnTermRow.hide();
                rnTermRow.find('div').removeClass('has-error');

                var table = $(this).closest('table');
                table.find('.editColumn').show();

            });

            $('.rmTermBtn').click(function () {
                $(this).closest('tr').remove();
                storeSynonyms();
                updateSelectionSummary();
            });

            $('#showExampleBtn').click(function () {
                $('#sExampleTableDiv').show();
                $('#showExampleBtn').hide();
                $('#hideExampleBtn').show();
            });

            $('#hideExampleBtn').click(function () {
                $('#sExampleTableDiv').hide();
                $('#showExampleBtn').show();
                $('#hideExampleBtn').hide();
            });

            function storeSynonyms() {

                var content = {};

                prepareData();
                storeData();

                function prepareData() {

                    content.synonyms = [];

                    $('.synonymTable').each(function () {

                        var synonymObj = {};
                        synonymObj.genericTerm = $(this).find('.synonymGenTermHeader').text().trim();
                        synonymObj.synonyms = [];

                        $(this).find('.termRow').each(function () {

                            synonymObj.synonyms.push($(this).text().trim());

                        });

                        content.synonyms.push(synonymObj);

                    });
                }

                function storeData() {
                    starterApp.content = content;
                    console.log(JSON.stringify(content));
                    resourceController.storeSynonyms();

                }
            }
        }

        function openConfig() {
            configDialog.show();
        }

        function refresh() {

            groupFormation.refreshArtifactData(onGroupFormationResourceRefresh);

        }

        function onGroupFormationResourceRefresh() {

            artifactDiv();
            studentDiv();
            setCalculationDiv();
            onNumSelectedStudentsChange();
            devElements();
            updateShowConceptAggregationBtnState();

            starterApp.loadingIndicator.hide();

            function setCalculationDiv() {

                var calculationDiv = $('#calculationDiv');
                groupFormation.numOfGroupSelectedValue = 0;
                groupFormation.groupSizesValue = 0;

                groupSizeDiv();
                startCalculationDiv();
                actionListeners();

                function groupSizeDiv() {

                    var groupSizeDiv = calculationDiv.find('#groupSizeDiv').empty();
                    groupSizeDiv.append('<h4>' + languageHandler.getMessage('selectGroupSize') + '</h4>');

                    var tableDiv = $('<div style="display: table; border-collapse: separate; border-spacing: 10px"></div>');

                    var cntSelectedStudentsDiv = $('<div style="display: table-row;"></div>')
                        .append('<div style="display: table-cell text-align:right""><label style="display:inline">' + languageHandler.getMessage('selectedStudents:') + '</label></div>')
                        .append('<div style="display: table-cell"><span id="numSelStudentsBadge" class="badge">' + groupFormation.numSelectedStudents + '</span></div>');

                    var numGroups = $('<div style="display: table-row;"></div>')
                        .append('<div style="display: table-cell text-align:right""><label style="display:inline">' + languageHandler.getMessage('numberOfGroups:') + '</label></div>')
                        .append($('<div style="display: table-cell" "></div>')
                            .append(groupSizeDropDown()));

                    var groupSizes = $('<div style="display: table-row;"></div>')
                        .append('<div style="display: table-cell; text-align:right"><label style="display:inline">' + languageHandler.getMessage('groupSizes:') + '</label></div>')
                        .append('<div style="display: table-cell" "><span  id="groupSizesBadge" class="badge groupSizesBadge">0</span></div>');

                    tableDiv.append(cntSelectedStudentsDiv)
                        .append(numGroups)
                        .append(groupSizes);

                    groupSizeDiv.append(tableDiv);


                    function groupSizeDropDown() {

                        return $('<div id="groupSizeDropDown" class="dropdown"></div>')
                            .append($('<button class="btn btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></button>')
                                .append('<span id="selNumberOfGroupsSpan">0</span><span class="caret"></span>'))
                            .append($('<ul class="dropdown-menu"></ul>'));


                    }


                }

                function startCalculationDiv() {
                    var startCalculationDiv = calculationDiv.find('#startCalculationDiv').empty()
                        .append('<h4>' + languageHandler.getMessage('calculation') + '</h4>')
                        .append('<button type="button" id="startGroupFormationBtn" disabled class="btn btn-default">' + languageHandler.getMessage('startGroupFormation') + '</button>');

                }

                function actionListeners() {

                    $('#numSelStudentsBadge').click(function () {
                        $('#navBarStudents').trigger('click');
                        scrollBackToTop();
                    }).hover(function () {
                        $(this).prop('style', 'cursor:pointer');
                    });

                    $('#startGroupFormationBtn').click(function () {

                        startGroupFormation();

                    });

                }

            }

            function startGroupFormation() {

                starterApp.loadingIndicator.show();

                groupFormation.clearCalculationData();
                var dataPackage = resourceController.assembleGroupFormationDataPackage();

                $('#navBarResult').hide();
                resourceController.sendGroupFormationRequest(dataPackage, onFailedCalculationRequest, processCalculationResult);

            }

            function onFailedCalculationRequest(error) {

                starterApp.errorDisplay.show(languageHandler.getMessage('failureOnRequestTryAgain'));
                starterApp.loadingIndicator.hide();
            }

            function processCalculationResult(result) {

                console.log('success');
                var refOptionSelected = result.refSolutionOptionSelected;
                groupFormation.setCalculationData(result);

                showGroupsListViewDiv();
                showGroupsTableViewDiv();
                refOptionElements();
                conceptCloudsDiv();
                actionListeners();
                devElements();

                $('#navBarResult').show().trigger('click');

                if (groupFormation.calculatedGroupData.length <= 4)
                    $('#listViewLink').trigger('click');
                else
                    $('#tableViewLink').trigger('click');

                starterApp.loadingIndicator.hide();

                function refOptionElements() {

                    console.log(refOptionSelected);
                    if (refOptionSelected) {

                        $('.refOptionSelected').each(function () {
                            $(this).show();
                        });

                        $('.refOptionSelectedRow').prop('style', 'display:table-row');
                    }
                }

                function showGroupsListViewDiv() {

                    var showGroupsDiv = $('#showGroupsListViewDiv').empty();

                    for (var i = 0; i < groupFormation.calculatedGroupData.length; i++) {

                        var memberNamesList = getGroupMemberNames(groupFormation.calculatedGroupData[i].groupMemberIds);

                        var groupItem = $('<a class="list-group-item"></a>')
                            .append('<h3 class="list-group-item-heading">' + languageHandler.getMessage('group:') + ' ' + (i + 1) + '</h3>')
                            .append(groupInformationTable(memberNamesList, groupFormation.calculatedGroupData[i], i));

                        showGroupsDiv.append(groupItem);


                        function groupInformationTable(memberNamesList, groupData, position) {

                            var tableDiv = $('<div style="display: table; border-collapse: separate; border-spacing: 10px"></div>');

                            var groupMemberDiv = $('<div style="display: table-row;"></div>')
                                .append('<div style="display: table-cell;"><label style="display:inline">' + languageHandler.getMessage('groupMembers:') + '</label></div>')
                                .append($('<div class="groupMemberCell" style="display: table-cell"></div>'));


                            for (var i = 0; i < memberNamesList.length; i++) {

                                if (i < memberNamesList.length - 1)
                                    groupMemberDiv.find('.groupMemberCell').append('<label>' + memberNamesList[i] + ',</label> ');
                                else
                                    groupMemberDiv.find('.groupMemberCell').append('<label>' + memberNamesList[i] + '</label>');
                            }


                            var totalConceptsDiv = $('<div class="tableRow" style="display: table-row;"></div>')
                                .append('<div style="display: table-cell;"><label style="display:inline">' + languageHandler.getMessage('totalConcepts:') + '</label></div>')
                                .append('<div style="display: table-cell"><span class="groupConceptsBadgeListView badge">' + groupData.aggregatedConceptList.length + '</span></div>');

                            var distinctConceptsDiv = $('<div class="tableRow" style="display: table-row;"></div>')
                                .append('<div style="display: table-cell;"><label style="display:inline">' + languageHandler.getMessage('uniqueCohortConcepts:') + '</label></div>')
                                .append('<div style="display: table-cell"><span class="groupConceptsBadgeListView badge">' + groupData.uniqueConceptsInCohort.length + '</span> <span class="groupConceptsBadgeListView badge">' + groupData.uniqueConceptsProcentual + ' %</span></div>');

                            var refConceptsDiv = $('<div class="tableRow refOptionSelectedRow" style="display: none"></div>')
                                .append('<div style="display: table-cell;"><label style="display:inline">' + languageHandler.getMessage('sharedReferenceConcepts:') + '</label></div>')
                                .append('<div style="display: table-cell"><span class="groupConceptsBadgeListView badge">' + groupData.sharedReferenceConcepts.length + '</span> <span class="groupConceptsBadgeListView badge">' + groupData.referenceConceptsOverlap + ' %</span></div>');

                            var scoreDiv = $('<div class="tableRow devMode" style="display: table-row;"></div>')
                                .append('<div style="display: table-cell;"><label style="display:inline">' + languageHandler.getMessage('score:') + '</label></div>')
                                .append('<div style="display: table-cell"><span class="scoreBadgeListView badge">' + groupData.subScore + '</span></div>');


                            tableDiv.append(groupMemberDiv)
                                .append(totalConceptsDiv)
                                .append(distinctConceptsDiv)
                                .append(refConceptsDiv)
                                .append(scoreDiv)
                                .append('<span class="positionSpan" style="display:none">' + position + '</span>');

                            return tableDiv;

                        }

                        function getGroupMemberNames(actorIdList) {

                            return actorIdList.map(function (actorId) {

                                return groupFormation.getActorById(actorId).displayName;

                            });

                        }

                    }

                }

                function showGroupsTableViewDiv() {

                    var showGroupsTablePanel = $('#showGroupsTableViewDiv').empty();

                    showGroupsTablePanel.append(heading())
                        .append(showGroupsTable());

                    actionListeners();

                    function heading() {

                        return '<h4>Calculated Groups</h4>';
                    }

                    function showGroupsTable() {

                        return showGroupsTable = $('<table id="showGroupsTable" class="table table-hover"></table>')
                            .append(tableHeading())
                            .append(tableBody());

                        function tableHeading() {

                            return $('<thead></thead>')
                                .append($('<tr></tr>')
                                    .append('<th>Group Nr</th>')
                                    .append('<th>Member</th>')
                                    .append('<th>Total Concepts</th>')
                                    .append('<th>Unique Conepts in Cohort</th>')
                                    .append('<th style="display:none" class="refOptionSelected">Shared Reference Concepts</th>')
                                    .append('<th class="devMode">Score</th>')
                                    .append('<th style="display:none">Pos</th>')
                                );

                        }

                        function tableBody() {

                            var tBody = $('<tbody></tbody>');

                            for (var s = 0; s < groupFormation.calculatedGroupData.length; s++) {

                                var groupData = groupFormation.calculatedGroupData[s];
                                var memberNamesList = getGroupMemberNames(groupData.groupMemberIds);

                                tBody.append($('<tr></tr>')
                                    .append('<td>' + s + '</td>')
                                    .append('<td>' + memberNamesList.toString() + '</td>')
                                    .append('<td><span class="groupConceptsBadgeTableView badge">' + groupData.aggregatedConceptList.length + '</span></td>')
                                    .append('<td><span class="groupConceptsBadgeTableView badge">' + groupData.uniqueConceptsInCohort.length + '</span> <span class="groupConceptsBadgeTableView badge">' + groupData.uniqueConceptsProcentual + ' %</span></td>')
                                    .append('<td style="display:none" class="refOptionSelected"><span class="groupConceptsBadgeTableView badge">' + groupData.sharedReferenceConcepts.length + '</span> <span class="groupConceptsBadgeTableView badge">' + groupData.referenceConceptsOverlap + ' %</span></td>')
                                    .append('<td class="devMode"><span class="scoreBadgeTableView badge">' + groupData.subScore + '</span></td>')
                                    .append('<td class="posTd" style="display: none;">' + s + '</td>'));

                                function getGroupMemberNames(actorIdList) {

                                    return actorIdList.map(function (actorId) {

                                        return groupFormation.getActorById(actorId).displayName;

                                    });

                                }

                            }


                            return tBody;

                        }


                    }

                    function actionListeners() {

                        $('.groupConceptsBadgeListView').click(function () {

                            showConceptsDialog($(this).closest('.tableRow').nextAll('.positionSpan').text());

                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.groupConceptsBadgeTableView').click(function () {

                            showConceptsDialog($(this).parent().nextAll('.posTd').text());

                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        function showConceptsDialog(arrPositionOfGroup) {

                            var groupData = groupFormation.getGroupDataByPosition(arrPositionOfGroup);
                            var multiUseDialog = $('#multiUseDialog');
                            var multiUseDialogHeader = multiUseDialog.find('.modal-header').empty();
                            var multiUseDialogBody = multiUseDialog.find('.modal-body').empty();

                            multiUseDialogHeader.append(headerContent());
                            multiUseDialogBody.append(bodyContent());

                            multiUseDialog.modal('show');

                            function headerContent() {

                                return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Conceptdistribution</h4>';

                            }

                            function bodyContent() {

                                var dialogDiv = $('<div></div>')
                                    .append(aggregatedConceptsDiv())
                                    .append('<hr>')
                                    .append(uniqueConceptsInCohortDiv());

                                if (refOptionSelected) {
                                    dialogDiv.append('<hr>')
                                        .append(sharedReferenceConceptsDiv());
                                }

                                return dialogDiv;

                                function aggregatedConceptsDiv() {

                                    return $('<div></div>')
                                        .append('<h4>Concepts of Group: <span class="badge">' + groupData.aggregatedConceptList.length + '</span></h4>')
                                        .append('<div>' + groupData.aggregatedConceptList.toString().split(',').join(', ') + '</div>');

                                }

                                function uniqueConceptsInCohortDiv() {

                                    return $('<div></div>')
                                        .append('<h4>Unique Concepts in Cohort: <span class="badge">' + groupData.uniqueConceptsInCohort.length + '</span></h4>')
                                        .append('<div>' + groupData.uniqueConceptsInCohort.toString().split(',').join(', ') + '</div>');
                                }

                                function sharedReferenceConceptsDiv() {

                                    return $('<div></div>')
                                        .append('<h4>Shared Reference Concepts: <span class="badge">' + groupData.sharedReferenceConcepts.length + '</span></h4>')
                                        .append('<div>' + groupData.sharedReferenceConcepts.toString().split(',').join(', ') + '</div>');

                                }


                            }

                        }

                    }

                }


                function conceptCloudsDiv() {

                    var conceptCloudDpUl = $('#conceptCloudByGroupDpUl').empty();

                    for (var i = 0; i < groupFormation.calculatedGroupData.length; i++) {

                        conceptCloudDpUl.append('<li class="conceptCloudByGroupLink"><a href="#">' + languageHandler.getMessage('group:') + ' <span>' + (i + 1) + '</span></a></li>');
                        groupFormation.prepareVisualisationData(i);

                    }
                }

                function actionListeners() {

                    $('#listViewLink').click(function () {

                        hideAllResultDivs();
                        enableAllConceptCloudLinks();
                        $(this).closest('li').addClass('disabled');
                        $('#tableViewLink').closest('li').removeClass('disabled');
                        $('#showGroupsListViewDiv').show();

                    });

                    $('#tableViewLink').click(function () {

                        hideAllResultDivs();
                        enableAllConceptCloudLinks();
                        $(this).closest('li').addClass('disabled');
                        $('#listViewLink').closest('li').removeClass('disabled');
                        $('#showGroupsTableViewDiv').show();

                    });

                    $('.conceptCloudByGroupLink').click(function () {

                        var groupPosition = $(this).find('span').text() - 1;

                        visualizeGoupByPosition(groupPosition);

                    });

                    function hideAllResultDivs() {

                        $('#resultNavBarContentDiv').children().each(function () {
                            $(this).hide();
                        });

                    }

                    function enableAllConceptCloudLinks() {

                        $('#conceptGloudByGroupDpUl').children().each(function () {
                            $(this).removeClass('disabled');
                        });

                    }

                    function visualizeGoupByPosition(groupPosition) {

                        var groupData = groupFormation.getGroupDataByPosition(groupPosition);
                        visualizeFromJSONModal(groupData.network, groupData.data, groupData.groupConcepts, (groupPosition + 1));

                    }

                }

            }

            function artifactDiv() {

                panelHeading();
                panelBody();


                function panelHeading() {

                    $('#artifactDiv').find('.panel-heading').empty().append('<h3 class="panel-title"><span class="glyphicon glyphicon-file" aria-hidden="true"></span>' + ' ' + languageHandler.getMessage('artifactDivHeading') + ':</h3>');
                }

                function panelBody() {

                    var artifactPanelBody = $('#artifactPanelBody').empty();

                    if (groupFormation.artifactSources.length > 1) {
                        artifactPanelBody.append(optionCheckboxTable())
                            .append('<hr class="hrWithoutMarginTop">');

                        function optionCheckboxTable() {

                            return $('<table style="width: auto; margin: 0px" class="table table-hover table-borderless"></table>')
                                .append(heading());

                            function heading() {
                                var tHead = $('<thead></thead>');
                                var headingRow = $('<tr></tr>')
                                    .append('<th>' + languageHandler.getMessage('selectAllArtifacts') + ' ' + '<input id="selectAllSourcesCb" checked="checked" type="checkbox"/></th>')
                                    .append('<th>' + languageHandler.getMessage('selectReferenceSolution') + ' ' + '<input id="selectReferenceSolutionCb" type="checkbox"/></th>');

                                tHead.append(headingRow);
                                return tHead;
                            }
                        }
                    }

                    if (groupFormation.artifactSources.length > 0) {

                        artifactPanelBody.append(artifactSelectionTable());
                        actionListeners();

                        function artifactSelectionTable() {

                            return $('<table id="artifactTable" class="table table-hover"></table>')
                                .append(heading())
                                .append(sourceSelectionBody());

                            function heading() {
                                var tHead = $('<thead></thead>');
                                var headingRow = $('<tr></tr>')
                                    .append('<th>' + languageHandler.getMessage('thPhase') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thPhaseName') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thApp') + '</th>')
                                    .append('<th class="devMode">' + languageHandler.getMessage('thGeneratorId') + '</th>')
                                    .append('<th style="display:none" class="refSolutionCbChecked">' + languageHandler.getMessage('thReferenceModel') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thSelected') + '</th>');
                                tHead.append(headingRow);
                                return tHead;
                            }

                            function sourceSelectionBody() {

                                var tBody = $('<tbody></tbody>');

                                groupFormation.artifactSources.forEach(function (artifactSource) {

                                    var artifactSourceRow = $('<tr></tr>')
                                        .append('<td class="phaseTd">' + languageHandler.getMessage(artifactSource.metadata.provider.inquiryPhase) + '</td>')
                                        .append('<td class="phaseNameTd">' + artifactSource.metadata.provider.inquiryPhaseName + '</td>')
                                        .append('<td class="appNameTd">' + artifactSource.metadata.generator.displayName + '</td>')
                                        .append('<td class="idTd devMode">' + artifactSource.metadata.generator.id + '</td>');

                                    var selectRefBtn = $('<button type="button" class="selectRefModelBtn btn btn-default"></button>');

                                    var countSelectedRefs = artifactSource.refModelActorIds.length;

                                    if (countSelectedRefs > 0)
                                        selectRefBtn.append('<span class="badge">' + countSelectedRefs + '</span>' + ' ' + languageHandler.getMessage('selected'));
                                    else
                                        selectRefBtn.append(languageHandler.getMessage('select'));

                                    var buttonTd = $('<td style="display:none" class="refSolutionCbChecked"></td>')
                                        .append(selectRefBtn);

                                    artifactSourceRow.append(buttonTd);

                                    var checkbox = $('<input class="includeSourceCb" />').attr({
                                        'type': 'checkbox',
                                        'checked': 'true'
                                    });

                                    var checkboxTd = $('<td></td>')
                                        .append(checkbox);

                                    artifactSourceRow.append(checkboxTd);
                                    tBody.append(artifactSourceRow);

                                });

                                return tBody;

                            }
                        }

                        function actionListeners() {

                            $('.selectRefModelBtn').click(function () {

                                var selectRefModelBtn = $(this);
                                var modalDialog = $('#refModelSelectionDialog');

                                modalHeader();
                                modalBody();
                                actionListeners();

                                devElements();

                                modalDialog.modal('show');

                                function modalHeader() {

                                    var modalHeader = modalDialog.find('.modal-header').empty();

                                    modalHeader.append(headerContent());

                                    function headerContent() {

                                        return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button> <h4 class="modal-title">' + languageHandler.getMessage('selectReferenceModel') + '</h4>';

                                    }

                                }

                                function modalBody() {

                                    var modalBody = modalDialog.find('.modal-body').empty();

                                    modalBody.append(sourceDescription())
                                        .append('<hr/>')
                                        .append(refSelection());

                                    function sourceDescription() {

                                        var sourceDescriptionDiv = $('<div class="sourceDesc"></div>')
                                            .append('<p><b>Source description: </b></p>');

                                        var sourceDescriptionTable = $('<table id="sourceDescTable" class="table table-hover">')
                                            .append($('<thead></thead>')
                                                .append($('<tr></tr>')
                                                    .append('<th>' + languageHandler.getMessage('thPhase') + '</th>')
                                                    .append('<th>' + languageHandler.getMessage('thPhaseName') + '</th>')
                                                    .append('<th>' + languageHandler.getMessage('thApp') + '</th>')
                                                    .append('<th class="devMode">' + languageHandler.getMessage('thGeneratorId') + '</th>')))
                                            .append('<tbody></tbody>')
                                            .append('<td>' + selectRefModelBtn.parent().prevAll('.phaseTd').text() + '</td>')
                                            .append('<td>' + selectRefModelBtn.parent().prevAll('.phaseNameTd').text() + '</td>')
                                            .append('<td>' + selectRefModelBtn.parent().prevAll('.appNameTd').text() + '</td>')
                                            .append('<td id="sourceDescTd" class="devMode">' + selectRefModelBtn.parent().prevAll('.idTd').text() + '</td>');

                                        sourceDescriptionDiv.append(sourceDescriptionTable);
                                        return sourceDescriptionDiv;

                                    }

                                    function refSelection() {

                                        var refSelectionDiv = $('<div></div>')
                                            .append(aggregationWarning())
                                            .append('<hr/>')
                                            .append(includeAllRefSelectionCb())
                                            .append(refSelectionTable());

                                        setSelectAllRefsCb();

                                        return refSelectionDiv;


                                        function setSelectAllRefsCb() {

                                            var selectAllCheckBox = refSelectionDiv.find('#selectAllRefCb');
                                            selectAllCheckBox.prop('checked', true);

                                            var allIncludeRefsCbs = refSelectionDiv.find('.includeRefCb');

                                            allIncludeRefsCbs.each(function () {

                                                if (!$(this).prop('checked'))
                                                    selectAllCheckBox.prop('checked', false);

                                            });

                                        }

                                        function aggregationWarning() {

                                            return $('<p><span class="label label-info">' + ' ' + languageHandler.getMessage('info') + '</span>' + ' ' + languageHandler.getMessage('selectMoreThenOneRefModelInfo') + '</p>');

                                        }

                                        function includeAllRefSelectionCb() {

                                            return languageHandler.getMessage('selectAll') + ' ' + '<input id="selectAllRefCb" type="checkbox"/>';

                                        }

                                        function refSelectionTable() {

                                            return $('<table id="refSelectionTable" class="table table-hover"></table>')
                                                .append(heading())
                                                .append(tableBody());


                                            function heading() {

                                                return $('<thead></thead>')
                                                    .append($('<tr></tr>')
                                                        .append('<th>' + languageHandler.getMessage('thNickname') + '</th>')
                                                        .append('<th class="devMode">' + languageHandler.getMessage('thActorId') + '</th>')
                                                        .append('<th>' + languageHandler.getMessage('thRole') + '</th>')
                                                        .append('<th class="devMode">' + languageHandler.getMessage('thTargetId') + '</th>')
                                                        .append('<th>' + languageHandler.getMessage('thResourceType') + '</th>')
                                                        .append('<th>' + languageHandler.getMessage('thSelected') + '</th>'));
                                            }

                                            function tableBody() {

                                                var tBody = $('<tbody></tbody>');

                                                var generatorId = selectRefModelBtn.parent().prevAll('.idTd').text();
                                                var artifactList = groupFormation.getArtifactListByGenId(generatorId);

                                                artifactList.sort(function (a, b) {

                                                    var aActorNick = a.metadata.actor.displayName.toLowerCase();
                                                    var bActorNick = b.metadata.actor.displayName.toLowerCase();

                                                    return ((aActorNick < bActorNick) ? -1 : ((aActorNick > bActorNick) ? 1 : 0));

                                                });

                                                artifactList.forEach(function (artifact) {

                                                    var refSelectionRow = $('<tr></tr>')
                                                        .append('<td>' + artifact.metadata.actor.displayName + '</td>')
                                                        .append('<td class="actorIdTd devMode">' + artifact.metadata.actor.id + '</td>')
                                                        .append('<td>' + languageHandler.getMessage(artifact.metadata.actor.objectType) + '</td>')
                                                        .append('<td class="resourceIdTd devMode">' + artifact.metadata.target.id + '</td>')
                                                        .append('<td>' + artifact.metadata.target.objectType + '</td>');

                                                    var actorId = artifact.metadata.actor.id;

                                                    var includeRefCheckbox = $('<input class="includeRefCb" />').attr({
                                                        'type': 'checkbox'
                                                    });

                                                    if (groupFormation.artifactSourceReferencingActor(generatorId, actorId))
                                                        includeRefCheckbox.prop('checked', true);

                                                    refSelectionRow.append($('<td></td>').append(includeRefCheckbox));

                                                    tBody.append(refSelectionRow);

                                                });

                                                return tBody;

                                            }

                                        }

                                    }

                                }

                                function actionListeners() {

                                    $('#selectAllRefCb').click(function () {

                                        var isChecked = $(this).prop('checked');
                                        var generatorId = $('#sourceDescTd').text();

                                        var artifactSource = groupFormation.getArtifactSourceById(generatorId);

                                        $('#refSelectionTable').find('.includeRefCb').each(function () {

                                            var actorId = $(this).parent().prevAll('.actorIdTd').text();

                                            if (isChecked) {

                                                $(this).prop('checked', true);

                                                if (artifactSource.refModelActorIds.indexOf(actorId) == -1)
                                                    artifactSource.refModelActorIds.push(actorId);

                                            } else {

                                                $(this).prop('checked', false);

                                                artifactSource.refModelActorIds = artifactSource.refModelActorIds.filter(function (idToCheck) {

                                                    return idToCheck != actorId;

                                                });
                                            }
                                        });

                                        setSelectedBtnBadge();
                                        onRefModelSelectionChange();
                                    });

                                    $('.includeRefCb').click(function () {

                                        var actorId = $(this).parent().prevAll('.actorIdTd').text();
                                        var sourceId = $('#sourceDescTd').text();
                                        var artifactSource = groupFormation.getArtifactSourceById(sourceId);

                                        if ($(this).prop('checked')) {

                                            if (artifactSource.refModelActorIds.indexOf(actorId) == -1)
                                                artifactSource.refModelActorIds.push(actorId);

                                        } else {

                                            artifactSource.refModelActorIds = artifactSource.refModelActorIds.filter(function (idToCHeck) {

                                                return idToCHeck != actorId;

                                            });
                                        }

                                        var allIncludeCheckboxes = $('#refSelectionTable').find('.includeRefCb');
                                        var allChecked = true;

                                        allIncludeCheckboxes.each(function () {

                                            if (!$(this).prop('checked'))
                                                allChecked = false;
                                        });

                                        $('#selectAllRefCb').prop('checked', allChecked);

                                        setSelectedBtnBadge();
                                        onRefModelSelectionChange();
                                    });

                                    function setSelectedBtnBadge() {

                                        var sourceId = $('#sourceDescTd').text().trim();
                                        var refSelectionTable = $('#refSelectionTable');
                                        var artifactSource = groupFormation.getArtifactSourceById(sourceId);
                                        var countSelectedRefs = artifactSource.refModelActorIds.length;

                                        selectRefModelBtn.empty();

                                        if (countSelectedRefs > 0)
                                            selectRefModelBtn.append('<span class="badge">' + countSelectedRefs + '</span>' + ' ' + languageHandler.getMessage('selected'));
                                        else
                                            selectRefModelBtn.append(languageHandler.getMessage('select'));

                                    }

                                }

                            });

                            $('.includeSourceCb').click(function () {

                                var sourceId = $(this).parent().prevAll('.idTd').text();
                                var artifactSource = groupFormation.getArtifactSourceById(sourceId);
                                artifactSource.includeSource = $(this).prop('checked');

                                var allIncludeCheckboxes = $('#artifactTable').find('.includeSourceCb');
                                var allChecked = true;

                                allIncludeCheckboxes.each(function () {

                                    if (!$(this).prop('checked'))
                                        allChecked = false;

                                });

                                $('#selectAllSourcesCb').prop('checked', allChecked);

                                onArtifactSelectionChange();
                            });

                            $('#selectAllSourcesCb').click(function () {

                                var isChecked = $(this).prop('checked');
                                console.log('firing1');
                                groupFormation.includeAllSources(isChecked);

                                $('#artifactTable').find('.includeSourceCb').each(function () {

                                    $(this).prop('checked', isChecked);
                                    console.log('firing');

                                });

                                onArtifactSelectionChange();
                            });

                            $('#selectReferenceSolutionCb').click(function () {

                                var isChecked = $(this).prop('checked');

                                groupFormation.selectRefSolutionOption(isChecked);

                                $('.refSolutionCbChecked').each(function () {

                                    if (isChecked) {

                                        $(this).show();

                                    } else {

                                        $(this).hide();

                                    }

                                });

                            });

                        }
                    }

                }

            }

            function studentDiv() {

                panelHeading();
                panelBody();

                function panelHeading() {

                    $('#studentDiv').find('.panel-heading').empty().append('<h3 class="panel-title"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' + ' ' + languageHandler.getMessage('studentDivHeading') + ':</h3>');
                }

                function panelBody() {

                    var studentPanelBody = $('#studentPanelBody');
                    studentPanelBody.empty();

                    if (groupFormation.actorList.length > 1) {

                        studentPanelBody.append(optionCheckboxTable())
                            .append('<hr class="hrWithoutMarginTop">');

                        function optionCheckboxTable() {

                            return $('<table style="width: auto; margin: 0px" class="table table-hover table-borderless"></table>')
                                .append(heading());

                            function heading() {
                                var tHead = $('<thead></thead>');
                                var headingRow = $('<tr></tr>')
                                    .append('<th>' + languageHandler.getMessage('selectAllStudents') + ' <input id="selectAllStudentsCb" checked="checked" type="checkbox"/></th>');

                                tHead.append(headingRow);
                                return tHead;
                            }
                        }
                    }

                    if (groupFormation.actorList.length > 0) {

                        studentPanelBody.append(studentSelectionTable());
                        actionListeners();

                        function studentSelectionTable() {

                            return $('<table id="studentTable" class="table table-hover"></table>')
                                .append(heading())
                                .append(studentSelectionBody());

                            function heading() {

                                var tHead = $('<thead></thead>');
                                var headingRow = $('<tr></tr>')
                                    .append('<th>' + languageHandler.getMessage('thNickname') + '</th>')
                                    .append('<th class="devMode">' + languageHandler.getMessage('thActorId') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thRole') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thSelected') + '</th>');
                                tHead.append(headingRow);
                                return tHead;

                            }

                            function studentSelectionBody() {

                                var tBody = $('<tbody></tbody>');

                                var studentList = groupFormation.getAllStudents();

                                studentList.forEach(function (student) {

                                    var studentRow = $('<tr></tr>');
                                    studentRow.append('<td>' + student.displayName + '</td>');
                                    studentRow.append('<td class="idTd devMode">' + student.id + '</td>');
                                    studentRow.append('<td>' + languageHandler.getMessage('student') + '</td>');

                                    var checkbox = $('<input class="includeStudentCb"/>').attr({
                                        'type': 'checkbox',
                                        'checked': 'true'
                                    });

                                    var checkboxTd = $('<td></td>')
                                        .append(checkbox);

                                    studentRow.append(checkboxTd);
                                    tBody.append(studentRow);

                                });

                                return tBody;
                            }

                        }
                    }

                    function actionListeners() {

                        $('.includeStudentCb').click(function () {

                            var actorId = $(this).parent().prevAll('.idTd').text();

                            var actor = groupFormation.getActorById(actorId);
                            actor.includeActor = $(this).prop('checked');

                            var allIncludeCheckboxes = $('#studentTable').find('.includeStudentCb');
                            var allChecked = true;

                            allIncludeCheckboxes.each(function () {

                                if (!$(this).prop('checked'))
                                    allChecked = false;

                            });

                            $('#selectAllStudentsCb').prop('checked', allChecked);

                            onNumSelectedStudentsChange();
                        });

                        $('#selectAllStudentsCb').click(function () {

                            var isChecked = $(this).prop('checked');

                            groupFormation.includeAllStudents(isChecked);

                            $('#studentTable').find('.includeStudentCb').each(function () {

                                $(this).prop('checked', isChecked);
                            });

                            onNumSelectedStudentsChange();
                        });

                    }

                }

            }

            function onRefModelSelectionChange() {

                updateCalculationSummary();
                updateStartGroupFormationBtnState();
            }

            function onNumSelectedStudentsChange() {

                updateCalculationSummary();
                updateGroupSizeSelection();
                updateStartGroupFormationBtnState();
            }

            function onArtifactSelectionChange() {

                updateCalculationSummary();
                updateStartGroupFormationBtnState();
                updateShowConceptAggregationBtnState();
            }

            function updateShowConceptAggregationBtnState() {

                if (groupFormation.numSelectedArtifacts > 0)
                    $('#showConceptAggregationSynBtn').prop('disabled', false);
                else
                    $('#showConceptAggregationSynBtn').prop('disabled', true);
            }

            function updateStartGroupFormationBtnState() {

                var startCalcBtn = $('#startGroupFormationBtn');

                startCalcBtn.prevAll('p').each(function () {
                    $(this).remove();
                });

                if (groupFormation.numSelectedArtifacts && groupFormation.numSelectedStudents && groupFormation.numOfGroupSelectedValue && (groupFormation.isRefSolutionOptionSelected() ? groupFormation.refModelSelectedForEverySelectedArtifact() : true)) {
                    startCalcBtn.removeClass('btn-default');
                    startCalcBtn.addClass('btn-success');
                    startCalcBtn.prop('disabled', false);
                }
                else {
                    startCalcBtn.prop('disabled', true);
                    startCalcBtn.removeClass('btn-success');
                    startCalcBtn.addClass('btn-default');

                    if (!groupFormation.numSelectedArtifacts || !groupFormation.numSelectedStudents || (groupFormation.isRefSolutionOptionSelected() && !groupFormation.refModelSelectedForEverySelectedArtifact()))
                        startCalcBtn.before('<p><span  class="label label-danger">' + languageHandler.getMessage('lookSatisfyingRequirements') + '</span></p>');

                    if (groupFormation.numSelectedStudents && !groupFormation.numOfGroupSelectedValue)
                        startCalcBtn.before('<p><span  class="label label-danger">' + languageHandler.getMessage('selectNumberOfGroups') + '</span></p>');
                }


            }

            function updateGroupSizeSelection() {

                var numSelectedStudents = groupFormation.numSelectedStudents;

                setSelectedStudentsBadge();
                setDropDownValues();
                groupFormation.numOfGroupSelectedValue = 0;
                $('#groupSizesBadge').text('0');
                $('#selNumberOfGroupsSpan').text('0');

                function setGroupSizeBadge() {

                    var numOfGroupSelValue = $('#selNumberOfGroupsSpan').text();
                    groupFormation.numOfGroupSelectedValue = numOfGroupSelValue;

                    if (numOfGroupSelValue > 0) {

                        var groups = groupFormation.numSelectedStudents / numOfGroupSelValue;
                        var ceil = Math.ceil(groups);
                        var floor = Math.floor(groups);
                        if (ceil != floor) {
                            $('#groupSizesBadge').text(floor + " to " + ceil);
                        } else {
                            $('#groupSizesBadge').text(floor);
                        }

                    } else {

                        $('#groupSizesBadge').text('0');

                    }

                    updateSelectionSummary();

                }

                function setSelectedStudentsBadge() {

                    $('#numSelStudentsBadge').text(numSelectedStudents);

                }

                function setDropDownValues() {

                    var numOfGroupsDropDown = $('#groupSizeDropDown');
                    var dpUl = numOfGroupsDropDown.find('ul').empty();

                    for (var i = 1; i <= numSelectedStudents; i++) {

                        if (Math.floor(numSelectedStudents / i) >= 2) {

                            var li = $('<li><a href="#">' + i + '</a></li>');

                            li.click(function () {

                                var selValue = $(this).find('a').text();
                                $('#selNumberOfGroupsSpan').text(selValue);

                                setGroupSizeBadge();
                                updateStartGroupFormationBtnState();

                            });

                            dpUl.append(li);

                        }

                    }

                }

            }

            function updateCalculationSummary() {

                updateSelectionSummary();
                var isOneStudentSelected = (groupFormation.numSelectedStudents > 0);
                var isOneArtifactSelected = (groupFormation.numSelectedArtifacts > 0);
                var participationIssueExisting = groupFormation.checkParticipation();


                calculationBasisTable();
                treatParticipationIssues();

                devElements();

                function treatParticipationIssues() {

                    var participationDiv = $('#participationDiv');
                    panelHeading();

                    var panelBody = participationDiv.find('.panel-body').empty();

                    if (isOneArtifactSelected && isOneStudentSelected && !participationIssueExisting) {

                        panelBody.append($('<p><span class="label label-success">' + languageHandler.getMessage('success') + '</span>' + ' ' + languageHandler.getMessage('allStudentsHaveResources') + '</p>'));

                    } else if (isOneArtifactSelected && isOneStudentSelected && participationIssueExisting) {

                        panelBody
                            .append('<h4><span  class="label label-info">' + languageHandler.getMessage('info') + '</span>' + ' ' + languageHandler.getMessage('missingResources') + '</h4>')
                            .append('<p>' + languageHandler.getMessage('sourcesSelectedStudentsNoArtifacts') + '</p>')
                            .append('<p>' + languageHandler.getMessage('clickOnBadge') + ' ' + '<span id="exampleBadge" class="badge">1</span>' + ' ' + languageHandler.getMessage('toViewMissingResources') + '</p>')
                            .append('<hr>')
                            .append(participationIssueTable());

                    } else {

                        if (!isOneArtifactSelected)
                            panelBody.append('<p><span class="noSourcesSelectedParticipationSpan label label-danger">' + languageHandler.getMessage('noSourcesSelected') + '</span></p>');

                        if (!isOneStudentSelected)
                            panelBody.append('<p><span class="noStudentsSelectedParticipationSpan label label-danger">' + languageHandler.getMessage('noStudentsSelected') + '</span></p>');

                    }

                    actionListeners();

                    function participationIssueTable() {

                        return $('<table id="participationIssueTable" class="table table-hover"></table>')
                            .append(tableHeading())
                            .append(participationIssueTableBody());


                        function tableHeading() {

                            return $('<thead></thead>')
                                .append($('<tr></tr>')
                                    .append('<th>' + languageHandler.getMessage('thNickname') + '</th>')
                                    .append('<th class="devMode">' + languageHandler.getMessage('thActorId') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thMissingResources') + '</th>')
                                );
                        }

                        function participationIssueTableBody() {

                            var tBody = $('<tbody></tbody>');

                            var distinctNoParticipationActorList = groupFormation.getDistinctNoParticipationActorList();

                            distinctNoParticipationActorList.sort(function (a, b) {

                                var aActorNick = a.displayName.toLowerCase();
                                var bActorNick = b.displayName.toLowerCase();

                                return ((aActorNick < bActorNick) ? -1 : ((aActorNick > bActorNick) ? 1 : 0));

                            });

                            distinctNoParticipationActorList.forEach(function (actor) {

                                var row = $('<tr class="warning"></tr>')
                                    .append('<td>' + actor.displayName + '</td>')
                                    .append('<td class="idTd devMode">' + actor.id + '</td>');

                                var missingResourceTd = $('<td></td>').append('<span class="badge missingResourcesCntBadge">' + groupFormation.getCntMissingResourcesByActorId(actor.id) + '</span>');

                                row.append(missingResourceTd);

                                tBody.append(row);

                            });

                            return tBody;
                        }

                    }

                    function panelHeading() {

                        participationDiv.find('.panel-heading').empty().append('<h3 class="panel-title"><span class="glyphicon glyphicon-plane" aria-hidden="true"></span>' + ' ' + languageHandler.getMessage('participationDivHeading') + ':</h3>');
                    }

                    function actionListeners() {

                        $('#exampleBadge').hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.noSourcesSelectedParticipationSpan').click(function () {
                            $('#navBarArtifacts').trigger('click');
                            scrollBackToTop();
                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.noStudentsSelectedParticipationSpan').click(function () {
                            $('#navBarStudents').trigger('click');
                            scrollBackToTop();
                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.missingResourcesCntBadge').click(function () {

                            var actorId = $(this).parent().prevAll('.idTd').text();
                            var actor = groupFormation.getActorById(actorId);
                            var multiUseDialog = $('#multiUseDialog');
                            var modalHeader = multiUseDialog.find('.modal-header');
                            modalHeader.empty();
                            var modalBody = multiUseDialog.find('.modal-body');
                            modalBody.empty();

                            modalHeader.append(heading());
                            modalBody.append(missingResourcesTable());

                            devElements();
                            multiUseDialog.modal('show');


                            function heading() {
                                return $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span></button> <h4 class="modal-title">' + languageHandler.getMessage('thMissingResources') + '</h4>');
                            }

                            function missingResourcesTable() {

                                return $('<table class="table table-hover"></table>')
                                    .append(tableHeading())
                                    .append(missingResourcesTableBody());


                                function tableHeading() {
                                    return $('<thead></thead>')
                                        .append($('<tr></tr>')
                                            .append('<th>' + languageHandler.getMessage('thPhase') + '</th>')
                                            .append('<th>' + languageHandler.getMessage('thPhaseName') + '</th>')
                                            .append('<th class="devMode">' + languageHandler.getMessage('thGeneratorId') + '</th>')
                                            .append('<th>' + languageHandler.getMessage('thApp') + '</th>')
                                        );
                                }

                                function missingResourcesTableBody() {

                                    var tBody = $('<tbody></tbody>');

                                    actor.missingResourcesIds.forEach(function (missingResourceId) {

                                        var artifactSource = groupFormation.getArtifactSourceById(missingResourceId);

                                        tBody.append($('<tr></tr>')
                                            .append('<td>' + artifactSource.metadata.provider.inquiryPhase + '</td>')
                                            .append('<td>' + artifactSource.metadata.provider.inquiryPhaseName + '</td>')
                                            .append('<td class="idTd devMode">' + artifactSource.metadata.generator.id + '</td>')
                                            .append('<td>' + artifactSource.metadata.generator.displayName + '</td>'))

                                    });

                                    return tBody;

                                }

                            }

                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                    }

                }

                function calculationBasisTable() {

                    var calculationBasisPanelBody = $('#calculationBasisPanelBody').empty();
                    calculationBasisPanelBody.append('<h4>' + languageHandler.getMessage('basisForCalculation') + '</h4>');

                    if (isOneArtifactSelected) {

                        calculationBasisPanelBody.append(selectedSourcesCalcTable());

                        if ($('#selectReferenceSolutionCb').prop('checked')) {
                            $('.refSolutionCbChecked').each(function () {
                                $(this).show();
                            });
                        } else {
                            $('.refSolutionCbChecked').each(function () {
                                $(this).hide();
                            });
                        }

                        if (isOneStudentSelected && participationIssueExisting) {

                            var participationBtn = $('<button id="participationNavBtn" type="button" class="btn btn-default">' + languageHandler.getMessage('participation') + '</button>');

                            calculationBasisPanelBody
                                .append('<hr>')
                                .append('<p><span class="label label-warning">' + languageHandler.getMessage('warning') + '</span>' + ' ' + languageHandler.getMessage('sourcesSelectedStudentsNoArtifacts') + '</p>');

                        }

                    }

                    if (isOneArtifactSelected && isOneStudentSelected && !participationIssueExisting)
                        calculationBasisPanelBody.append($('<p><span class="label label-success">Success</span>' + ' ' + languageHandler.getMessage('allStudentsHaveResources') + '</p>'));

                    if (!isOneArtifactSelected)
                        calculationBasisPanelBody.append('<p><span class="noSourcesSelectedCalcBasisSpan label label-danger">' + languageHandler.getMessage('noSourcesSelected') + '</span></p>');

                    if (!isOneStudentSelected)
                        calculationBasisPanelBody.append('<p><span class="noStudentsSelectedCalcBasisSpan label label-danger">' + languageHandler.getMessage('noStudentsSelected') + '</span></p>');

                    actionListeners();

                    function selectedSourcesCalcTable() {

                        return $('<table id="selectedSourcesTable" class="table table-hover"></table>')
                            .append(heading())
                            .append(sourceRows());

                        function heading() {

                            return $('<thead></thead>')
                                .append($('<tr></tr>')
                                    .append('<th>' + languageHandler.getMessage('thPhase') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thPhaseName') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thApp') + '</th>')
                                    .append('<th class="devMode">' + languageHandler.getMessage('thGeneratorId') + '</th>')
                                    .append('<th class="refSolutionCbChecked">' + languageHandler.getMessage('thReferenceModel') + '</th>')
                                    .append('<th>' + languageHandler.getMessage('thParticipation') + '</th>'));
                        }

                        function sourceRows() {

                            var tBody = $('<tbody></tbody>');

                            groupFormation.artifactSources.filter(function (artifactSource) {
                                return artifactSource.includeSource;
                            }).forEach(function (artifactSource) {

                                var sourceRow = $('<tr></tr>')
                                    .append('<td class="phaseTd">' + languageHandler.getMessage(artifactSource.metadata.provider.inquiryPhase) + '</td>')
                                    .append('<td class="phaseNameTd">' + artifactSource.metadata.provider.inquiryPhaseName + '</td>')
                                    .append('<td class="appNameTd">' + artifactSource.metadata.generator.displayName + '</td>')
                                    .append('<td class="idTd devMode">' + artifactSource.metadata.generator.id + '</td>')
                                    .append($('<td class="refModelTd refSolutionCbChecked"></td>'))
                                    .append($('<td class="participationTd"></td>'));


                                if ((artifactSource.noParticipationActorList.length > 0) || (groupFormation.numSelectedStudents <= 0))
                                    sourceRow.addClass('warning');
                                else
                                    sourceRow.addClass('success');

                                if (artifactSource.refModelActorIds.length <= 0) {
                                    sourceRow.find('.refModelTd').append('<span class="label label-danger noRefModelSelectedSpan">' + languageHandler.getMessage('notSelected') + '</span>');

                                } else if (artifactSource.refModelActorIds.length == 1) {
                                    sourceRow.find('.refModelTd').append('<span class="badge numRefModelBadge">1</span> ' + groupFormation.getActorById(artifactSource.refModelActorIds[0]).displayName);

                                } else
                                    sourceRow.find('.refModelTd').append('<span class="badge numRefModelBadge">' + artifactSource.refModelActorIds.length + '</span> <span>aggregated</span>');

                                var cntParticipation = groupFormation.getCntParticipationBySourceId(artifactSource.metadata.generator.id);

                                if (groupFormation.numSelectedStudents > 0)
                                    var proc = Math.floor((cntParticipation / groupFormation.numSelectedStudents * 100));
                                else
                                    proc = 0;

                                sourceRow.find('.participationTd').append('<span class="badge participationBadge">' + cntParticipation + '/' + groupFormation.numSelectedStudents + '</span> <span class="badge participationBadge">' + proc + ' %' + '</span>');

                                tBody.append(sourceRow);

                            });

                            return tBody;

                        }
                    }

                    function actionListeners() {

                        $('.participationBadge').click(function () {

                            var dialogBody = $('#participationDialogBody').empty();

                            var generatorId = $(this).parent().prevAll('.idTd').text();

                            var cntParticipation = groupFormation.getCntParticipationBySourceId(generatorId);

                            dialogBody.append(sourceDescription())
                                .append('<hr>');

                            dialogBody.append('<div class="container-fluid"><div class="row"></div></div>');

                            var participationDiv = $('<div class="col-xs-6"></div>')
                                .append('<h4>Students with resource <span class="badge">' + cntParticipation + '</span></h4>')
                                .append(participationTable());

                            var missingParticipationDiv = $('<div class="col-xs-6"></div>')
                                .append('<h4>Students without resource <span class="badge">' + (groupFormation.numSelectedStudents - cntParticipation) + '</span></h4>')
                                .append(missingParticipationTable());


                            dialogBody.find('.row').append(participationDiv)
                                .append(missingParticipationDiv);

                            devElements();

                            $('#participationDialog').modal('show');

                            function sourceDescription() {

                                var sourceDescriptionDiv = $('<div></div>')
                                    .append('<p><b>Source description: </b></p>');

                                var artifact = groupFormation.getArtifactSourceById(generatorId);

                                var sourceDescriptionTable = $('<table class="table table-hover">')
                                    .append($('<thead></thead>')
                                        .append($('<tr></tr>')
                                            .append('<th>' + languageHandler.getMessage('thPhase') + '</th>')
                                            .append('<th>' + languageHandler.getMessage('thPhaseName') + '</th>')
                                            .append('<th>' + languageHandler.getMessage('thApp') + '</th>')
                                            .append('<th class="devMode">' + languageHandler.getMessage('thGeneratorId') + '</th>')))
                                    .append('<tbody></tbody>')
                                    .append('<td>' + artifact.metadata.provider.inquiryPhase + '</td>')
                                    .append('<td>' + artifact.metadata.provider.inquiryPhaseName + '</td>')
                                    .append('<td>' + artifact.metadata.generator.displayName + '</td>')
                                    .append('<td class="devMode">' + artifact.metadata.generator.id + '</td>');

                                sourceDescriptionDiv.append(sourceDescriptionTable);
                                return sourceDescriptionDiv;

                            }

                            function participationTable() {

                                var participationTable = $('<table class="table table-hover"></table>');
                                addHeadingRow();
                                addParticipationRows();
                                return participationTable;

                                function addHeadingRow() {
                                    var tHead = $('<thead></thead>');
                                    var headingRow = $('<tr></tr>')
                                        .append($('<th>Nickname</th>'));
                                    tHead.append(headingRow);
                                    participationTable.append(tHead);
                                }

                                function addParticipationRows() {

                                    var tBody = $('<tbody></tbody>');

                                    var actorParticipationList = groupFormation.getActorParticipationListBySourceId(generatorId);
                                    actorParticipationList.sort(function (a, b) {

                                        var aActorNick = a.displayName.toLowerCase();
                                        var bActorNick = b.displayName.toLowerCase();

                                        return ((aActorNick < bActorNick) ? -1 : ((aActorNick > bActorNick) ? 1 : 0));

                                    });

                                    actorParticipationList.forEach(function (participatingActor) {

                                        tBody.append($('<tr></tr>').append('<td>' + participatingActor.displayName + '</td>'));

                                    });

                                    participationTable.append(tBody);
                                }

                            }

                            function missingParticipationTable() {

                                var missingParticipationTable = $('<table class="table table-hover"></table>');
                                addHeadingRow();
                                addMissingParticipationRows();
                                return missingParticipationTable;

                                function addHeadingRow() {
                                    var tHead = $('<thead></thead>');
                                    var headingRow = $('<tr></tr>')
                                        .append($('<th>Nickname</th>'));
                                    tHead.append(headingRow);
                                    missingParticipationTable.append(tHead);
                                }

                                function addMissingParticipationRows() {

                                    var tBody = $('<tbody></tbody>');

                                    var actorMissingParticipationList = groupFormation.getActorMissingParticipationListBySourceId(generatorId);
                                    actorMissingParticipationList.sort(function (a, b) {

                                        var aActorNick = a.displayName.toLowerCase();
                                        var bActorNick = b.displayName.toLowerCase();

                                        return ((aActorNick < bActorNick) ? -1 : ((aActorNick > bActorNick) ? 1 : 0));

                                    });

                                    actorMissingParticipationList.forEach(function (missingParticipationActor) {

                                        tBody.append($('<tr></tr>').append('<td>' + missingParticipationActor.displayName + '</td>'));

                                    });

                                    missingParticipationTable.append(tBody);

                                }

                            }


                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.numRefModelBadge').click(function () {

                            var generatorIdClickedBadge = $(this).parent().prevAll('.idTd').text();

                            $('#artifactTable').find('.selectRefModelBtn').each(function () {

                                var selectRefModelBtn = $(this);
                                var generatorId = selectRefModelBtn.parent().prevAll('.idTd').text();

                                if (generatorIdClickedBadge == generatorId)
                                    selectRefModelBtn.trigger('click');

                            });

                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.noRefModelSelectedSpan').click(function () {

                            var generatorIdClickedBadge = $(this).parent().prevAll('.idTd').text();

                            $('#artifactTable').find('.selectRefModelBtn').each(function () {

                                var selectRefModelBtn = $(this);
                                var generatorId = selectRefModelBtn.parent().prevAll('.idTd').text();

                                if (generatorIdClickedBadge == generatorId)
                                    selectRefModelBtn.trigger('click');

                            });

                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('#participationNavBtn').click(function () {
                            $('#navBarParticipation').trigger('click');
                            scrollBackToTop();
                        });

                        $('.noSourcesSelectedCalcBasisSpan').click(function () {
                            $('#navBarArtifacts').trigger('click');
                            scrollBackToTop();
                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });

                        $('.noStudentsSelectedCalcBasisSpan').click(function () {
                            $('#navBarStudents').trigger('click');
                            scrollBackToTop();
                        }).hover(function () {
                            $(this).prop('style', 'cursor:pointer');
                        });
                    }

                }
            }
        }

        function updateSelectionSummary() {

            setSelectionNumberDetails();
            updateSummaryTable();
            actionListeners();

            function updateSummaryTable() {

                var selectionSummaryTable = $('#selectionSummaryTable').empty();

                selectionSummaryTable.append($('<thead></thead>')
                    .append($('<tr></tr>')
                        .append('<th>' + participationInfo() + '</th>')
                        .append('<th>' + selectedSourceInfo() + '</th>')
                        .append('<th>' + selectedStudentsInfo() + '</th>')
                        .append('<th>' + synonymsInfo() + '</th>')));

                function participationInfo() {

                    var proc = 0;

                    if (groupFormation.numSelectedArtifacts > 0 && groupFormation.numSelectedStudents > 0) {

                        var participationSum = 0;

                        groupFormation.artifactSources.filter(function (artifactSource) {
                            return artifactSource.includeSource;
                        }).forEach(function (artifactSource) {
                            participationSum += groupFormation.getCntParticipationBySourceId(artifactSource.metadata.generator.id);
                        });

                        proc = Math.floor((participationSum / (groupFormation.numSelectedStudents * groupFormation.numSelectedArtifacts) * 100));
                    }

                    return '<span>Participation </span><span class="badge summaryParticipationBadge">' + proc + ' %' + '</span>';
                }

                function selectedSourceInfo() {
                    return '<span>Sources </span><span class="badge summarySourcesBadge">' + groupFormation.numSelectedArtifacts + '/' + groupFormation.artifactSources.length + '</span>';
                }

                function selectedStudentsInfo() {
                    return '<span>Students </span><span class="badge summaryStudentsBadge">' + groupFormation.numSelectedStudents + '/' + groupFormation.numStudents() + '</span>';
                }

                function synonymsInfo() {
                    return '<span>Synonyms </span><span class="badge summarySynonymsBadge">' + groupFormation.numSynonymTables + '</span>';
                }

            }

            function setSelectionNumberDetails() {

                groupFormation.numSelectedStudents = groupFormation.actorList.filter(function (actor) {

                    return actor.objectType == 'graasp_student' && actor.includeActor;

                }).length;

                groupFormation.numSelectedArtifacts = groupFormation.artifactSources.filter(function (artifactSource) {

                    return artifactSource.includeSource;

                }).length;

                groupFormation.numSynonymTables = $('.synonymTable').length;
            }

            function actionListeners() {

                $('.summarySourcesBadge').click(function () {
                    $('#navBarArtifacts').trigger('click');
                    scrollBackToTop();
                }).hover(function () {
                    $(this).prop('style', 'cursor:pointer');
                });

                $('.summaryStudentsBadge').click(function () {
                    $('#navBarStudents').trigger('click');
                    scrollBackToTop();
                }).hover(function () {
                    $(this).prop('style', 'cursor:pointer');
                });

                $('.summarySynonymsBadge').click(function () {
                    $('#navBarSynonyms').trigger('click');
                    scrollBackToTop();
                }).hover(function () {
                    $(this).prop('style', 'cursor:pointer');
                });

                $('.summaryNumbOfGroupsBadge').click(function () {
                    $('#navBarCalculation').trigger('click');
                    scrollBackToTop();
                }).hover(function () {
                    $(this).prop('style', 'cursor:pointer');
                });

                $('.summaryGroupSizeBadge').click(function () {
                    $('#navBarCalculation').trigger('click');
                    scrollBackToTop();
                }).hover(function () {
                    $(this).prop('style', 'cursor:pointer');
                });

            }

        }

        function setGroupFormation(groupFormationParam) {
            groupFormation = groupFormationParam
        }

        function scrollBackToTop() {

            $('body,html').animate({
                scrollTop: 0

            }, 300);

        }

        function devElements() {

            if (!starterApp.devFlag)
                $('.devMode').hide();

        }
    }

})(golab.tools.starterApp);
