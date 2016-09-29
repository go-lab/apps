(function (conceptCloud) {
    conceptCloud.ConceptModels = ConceptModels;

    var reflectionQuestions = {};
    var questions = {
        "setR1": [
            "Wie ist dieses Konzept zu verstehen?",
            "Wie kannst du dieses Konzept besser verstehen?",
            "Warum hast du das bereits erklärte Konzept nicht aufgegriffen?",
            "Wie hängt dieses Konzept möglicherweise mit anderen zusammen, die du bereits verwendet hast?",
            "Ist dieses Konzept neu für dich? In welchem Zusammenhang steht dieses Konzept mit dir bereits Bekannten in Zusammenhang?"
        ],
        "setR2": [
            "Warum hast du das Konzept wieder verworfen?",
            "Überlege noch einmal welche Inhalte durch die Ausarbeitung ausgebaut und verfestigt wurden!",
            "Scheint dir der Sinn des Konzeptes schlüssig? Wenn nein, welche Phase könnte dir helfen, das Konzept besser zu verstehen?",
            "Wo kannst du das Konzept als erstes aufgreifen? Wo macht es als erstes Sinn?",
            "Was hilft dir dabei, das Konzept anzuwenden? Geh nochmal zurück, um dir den Inhalt anzusehen.",
            "Ist dir etwas nicht klar geworden? Wenn ja, überlege welche Inhalte dir helfen könnten, das Konzept besser zu verstehen."
        ],
        "setY1": [
            "Warum hast du das Konzept nur teilweise verwendet?",
            "War die Aufgabe für dich eindeutig gestellt?",
            "Welche Fragen wurden nicht geklärt?",
            "Wie hast du dir bei Unklarheiten Hilfe verschafft?",
            "An welchen Stellen hast du noch Probleme oder Fragen bezüglich des Konzeptes?",
            "Welche Querverbindung kannst du zu anderen Konzepten herstellen?",
            "Warst du bei der Verwendung des Konzeptes unsicher? Wenn ja, warum?"
        ],
        "setY2": [
            "Warum hast du das Konzept zwischenzeitlich verworfen?"
        ],
        "setG": [
            "Wie könntest du deine Annahmen anders formulieren?",
            "Was würdest du das nächste Mal beim Formulieren deiner Annahmen anders machen?",
            "Kannst du dieses Konzept mit den anderen verbinden? Lassen sich dadurch eventuell neue Schlüsse ziehen?",
            "Kannst du das Konzept mit eigenen Worten erklären?",
            "Mit wievielen anderen Konzepten lässt sich dieses Konzept in Verbindung bringen?",
            "Würdest du dieses Konzept als besonders wichtig einschätzen? Wenn ja, warum?",
            "Ist es dir leichter gefallen, dieses Konzept zu verstehen, als andere? Woran kann das liegen?",
            "Würdest du bei einer wiederholten Bearbeitung dieses Konzept wieder verwenden? Warum?",
            "Welche Themenbereiche sind dir aufgefallen, die zum aktuellen Konzept dazugehören bzw. eng damit verknüpft sind?",
            "Wie würdest du vorgehen, wenn du anderen Schülern den Inhalt des Konzeptes vermitteln müsstest?"
        ]
    };

    var uniqueRandoms = [];
    var numRandoms;

    function ConceptModels() {

        return {
            buildUserModel : buildUserModel,
            buildGeneralModel : buildGeneralModel,
            buildGeneralConcepts : buildGeneralConcepts,
            buildReflectionQuestions : buildReflectionQuestions,
            returnQuestions : returnQuestions
        };



        function buildUserModel(data, global){
            return new Promise(function(fulfill, reject){

                var metadataHandler = conceptCloud.retrieverMetadataHandler;
                var userModel = global ? conceptCloud.userModel = {} : {};
                var userData = data.data.user;

                conceptCloud.timestamp = data.metadata.timestamp;

                console.log("[ConceptCloud] ActorId: " + metadataHandler.getActor().id);
                console.log("[ConceptCloud] DisplayName: " + metadataHandler.getActor().displayName);
                console.log("[ConceptCloud] building UserModel");

                // console.log("aggregatedView: " +  conceptCloud.aggregatedView);

                if(conceptCloud.aggregatedView){
                    console.log("...aggregated");
                    for(var i in userData){
                        var userName = i.split('@')[0];
                        userModel[userName] = {};
                        userModel[userName].data = {};
                        userModel[userName].metadata = jQuery.extend(true, {}, userData[i].metacontent);

                        for (var j in userData[i].content) {
                            var conceptName = j.substring(1, j.length);
                            userModel[userName].data[conceptName] = userData[i].content[j];
                        }
                    }
                } else {

                    console.log("...!aggregated")

                    if (metadataHandler._context === "preview") {

                        console.log("...conceptModels -> preview");


                        var userName = metadataHandler.getActor().displayName.split('@')[0];
                        var identifier = metadataHandler.getActor().displayName + "@" + metadataHandler.getActor().id;

                        userModel[userName] = {};
                        userModel[userName].data = {};
                        userModel[userName].metadata = jQuery.extend(true, {}, userData[identifier].metacontent);

                        for (var i in userData[identifier].content) {
                            var conceptName = i.substring(1, i.length);
                            userModel[userName].data[conceptName] = userData[identifier].content[i];
                        }


                    } else if (metadataHandler._context === "standalone") {

                        console.log("...conceptModels -> standalone");

                        var userIdentifier = metadataHandler.getActor().id;

                        if (userModel.data === undefined) {
                            userModel.data = {};
                        }

                        for (var i in userData[userIdentifier].content) {
                            var conceptName = i.substring(1, i.length);
                            userModel.data[conceptName] = userData[userIdentifier].content[i];
                        }

                    } else {

                        console.log("...conceptModels -> ils");

                        var userIdentifier = metadataHandler.getActor().displayName + "@" + metadataHandler.getActor().id;

                        if (userModel.data === undefined) {
                            userModel.data = {};
                        }

                        // console.log(userData);

                        if(userData[userIdentifier] != undefined) {
                            for (var i in userData[userIdentifier].content) {
                                var conceptName = i.substring(1, i.length);
                                userModel.data[conceptName] = userData[userIdentifier].content[i];
                            }
                        }

                    }

                }

                // console.log(userModel);

                fulfill(userModel);
            })
        }

        function buildGeneralModel(data, global){
            return new Promise(function(fulfill, reject){

                console.log("[ConceptCloud] building GeneralModel");

                var generalModel = global ? conceptCloud.generalModel = {} : {};
                generalModel.data = {};
                generalModel.metadata = {};
                generalModel.metadata.phases = {};

                for (var i in data) {
                    var conceptName = global ? i.substring(1, i.length) : i;
                    generalModel.data[conceptName] = data[i];
                }

                fulfill(generalModel);
            });
        }

        function buildGeneralConcepts(userModel, generalModel) {
            return new Promise(function(fulfill, reject){
                var words = [];
                for (var i in generalModel.data) {
                    words.push({name: i, frequency: generalModel.data[i].frequency});
                }

                conceptCloud.loggingInterface.conceptState(words);
                conceptCloud.tagCloud.transferConcepts(words);
                fulfill();

            });
        }

        function buildReflectionQuestions(data){

            for(var j in conceptCloud.generalModel.data){

                var conceptName = j;
                var conceptColor = conceptCloud.tagCloud.color(conceptCloud.userModel, conceptName);

                reflectionQuestions[conceptName] = [];
                uniqueRandoms = [];

                switch(conceptColor) {

                    case 'green':
                        // questions for green tags
                        numRandoms = questions.setG.length;
                        for (var m = 0; m < 4; m++) {
                            reflectionQuestions[conceptName].push(questions.setG[uniqueRandom()]);
                        }
                        break;

                    case 'yellow':

                        // questions for yellow tags
                        numRandoms = questions.setY1.length;
                        for (var m = 0; m < 4; m++) {
                            reflectionQuestions[conceptName].push(questions.setY1[uniqueRandom()]);
                        }
                        break;

                    case 'red':

                        // questions for red tags
                        if(Object.keys(data).indexOf(conceptName) != -1) {
                            if(data[conceptName]) {
                                // Konzept wurde schon einmal genutzt und wieder gelöscht
                                numRandoms = questions.setR2.length;
                                for (var m = 0; m < 4; m++) {
                                    reflectionQuestions[conceptName].push(questions.setR2[uniqueRandom()]);
                                }
                            } else {
                                // konzept wurde noch nie benutzt
                                numRandoms = questions.setR1.length;
                                for (var m = 0; m < 4; m++) {
                                    reflectionQuestions[conceptName].push(questions.setR1[uniqueRandom()]);
                                }
                            }
                        } else {
                            //
                        }
                        break;
                    default:
                        // console.log(conceptColor);

                }
            }

            conceptCloud.loggingInterface.initialize("reflectionModel", reflectionQuestions);
            console.log("[ConceptCloud] questions for reflection ready...");
        }

        function returnQuestions() {
            return reflectionQuestions;
        }

        function uniqueRandom() {
            // refill the array if needed
            if (!uniqueRandoms.length) {
                for (var i = 0; i < numRandoms; i++) {
                    uniqueRandoms.push(i);
                }
            }
            var index = Math.floor(Math.random() * uniqueRandoms.length);
            var val = uniqueRandoms[index];

            // now remove that value from the array
            uniqueRandoms.splice(index, 1);

            return val;

        }

    }

})(golab.tools.conceptCloud);