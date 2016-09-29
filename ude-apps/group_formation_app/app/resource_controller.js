/**
 * Created by richard on 16.01.16.
 */

(function (starterApp) {
    starterApp.ResourceController = ResourceController;

    var storageHandler;
    var serviceUrls;
    var groupFormation;

    function ResourceController() {

        initialize();

        return {
            retrieveArtifacts: retrieveArtifacts,
            getTestData : getTestData,
            storeSynonyms : storeSynonyms,
            retrieveSynonymData : retrieveSynonymData,
            assembleGroupFormationDataPackage: assembleGroupFormationDataPackage,
            assembleConceptAggregationDataPackage: assembleConceptAggregationDataPackage,
            setGroupFormation : setGroupFormation,
            sendGroupFormationRequest: sendGroupFormationRequest,
            sendConceptAggregationRequest: sendConceptAggregationRequest
        };

        function initialize() {

            storageHandler  = starterApp.storageHandler;

            /*serviceUrls = starterApp.serviceUrls = {
                applyGroupFormation: "http://localhost:3090/groupformation/applyGroupFormation",
                conceptAggregation: "http://localhost:3090/groupformation/getConceptAggregation"
            };*/

            serviceUrls = starterApp.serviceUrls = {
                applyGroupFormation: "http://golab.collide.info/groupformation/applyGroupFormation",
                conceptAggregation: "http://golab.collide.info/groupformation/getConceptAggregation"
            };
        }

        function getTestData() {

            return [{
                "id": "56706578755d56ec579f8434",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "190eb0d5-4467-415e-b8c8-14b8d6255cf1",
                        "displayName": "unnamed collide wiki config",
                        "objectType": "collide wiki config"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_CC_Kopie2",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56706543755d56ec579f82f2", "displayName": "B21", "objectType": "graasp_student"},
                    "published": "2015-12-15T19:09:44.081Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56706578755d56ec579f8434"
                },
                "content": {"collaborative": {"value": "false"}}
            }, {
                "id": "56706578755d56ec579f843d",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "3799ae96-8285-4302-a217-c948aa5e3dfa",
                        "displayName": "Hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_CC_Kopie2",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56706543755d56ec579f82f2", "displayName": "B21", "objectType": "graasp_student"},
                    "published": "2015-12-15T19:09:44.317Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56706578755d56ec579f843d"
                },
                "content": [{
                    "id": "8be31dc0-ca58-4407-a1bf-792082d4345a",
                    "elements": [],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50
                }]
            }, {
                "id": "56706578755d56ec579f843d",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "3799ae96-8285-4302-a217-c948aa5e3dfa",
                        "displayName": "Hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_CC_Kopie2",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56706543755d56ec579f82f2s", "displayName": "B10", "objectType": "graasp_student"},
                    "published": "2015-12-15T19:09:44.317Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56706578755d56ec579f843d"
                },
                "content": [{
                    "id": "8be31dc0-ca58-4407-a1bf-792082d4345a",
                    "elements": [],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50
                }]
            }, {
                "id": "5670659f755d56ec579f8635",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "fbb53769-9326-4866-9aa6-a49db70507d6",
                        "displayName": "unnamed ConceptCloud configuration",
                        "objectType": "ConceptCloud configuration"
                    },
                    "generator": {
                        "id": "5670647b755d56ec579f808f",
                        "displayName": "ConceptCloud",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/concept_cloud/gadget.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_CC_Kopie2",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56706543755d56ec579f82f2", "displayName": "B21", "objectType": "graasp_student"},
                    "published": "2015-12-15T19:10:23.071Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5670659f755d56ec579f8635"
                },
                "content": {"defaultTitle": {"value": "Unnamed post"}}
            }, {
                "id": "567065ad755d56ec579f86ea",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "544103a5-8f87-4234-e341-d8e1c267cd06",
                        "displayName": "Concept map",
                        "objectType": "conceptMap"
                    },
                    "generator": {
                        "id": "567064c0755d56ec579f8209",
                        "displayName": "conceptmapper",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "5. Diskussion",
                        "inquiryPhase": "Discussion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c75",
                        "displayName": "Kyrptographie_CC_Kopie2",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56706543755d56ec579f82f2", "displayName": "B21", "objectType": "graasp_student"},
                    "published": "2015-12-15T19:10:37.578Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "567065ad755d56ec579f86ea"
                },
                "content": {"concepts": [], "relations": []}
            }, {
                "id": "567256da6aa58ec425fe8460",
                "metadata": {
                    "id": "567256da6aa58ec425fe8460",
                    "storageType": "folder",
                    "target": {
                        "id": "23f2927e-ada0-466c-8362-2bf919e21ea3",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567256826aa58ec425fe82fc", "displayName": "B20", "objectType": "graasp_student"},
                    "published": "2015-12-17T06:33:03.847Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Alphabet",
                        "type": "variable"
                    }, {"text": "größer", "type": "free"}, {"text": "DANN", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "Versuche", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "5672575d6aa58ec425fe8516",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567256826aa58ec425fe82fc", "displayName": "B20", "objectType": "graasp_student"},
                    "published": "2015-12-17T06:34:05.108Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672575d6aa58ec425fe8516"
                },
                "content": {
                    "title": "Test",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Wenn das Alphabet mehr Buchstaben umfasst, dann benötigt man bei Brute Force Verfahren mehr Versuche",
                        "author": "B20",
                        "timestamp": "Thu Dec 17 2015 07:34:05 GMT+0100 (CET)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Wenn das Alphabet mehr Buchstaben umfasst, dann benötigt man bei Brute Force Verfahren mehr Versuche",
                        "author": "B20",
                        "timestamp": "Thu Dec 17 2015 07:34:05 GMT+0100 (CET)"
                    }],
                    "author": "B20"
                }
            }, {
                "id": "56729a345716cfd9c4a669b3",
                "metadata": {
                    "id": "56729a345716cfd9c4a669b3",
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296665716cfd9c4a64305", "displayName": "B02", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:15:13.131Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": {
                    "title": "Caeser-Verschlüsselung",
                    "isIndex": true,
                    "currentRevision": {
                        "author": "B02",
                        "content": "Caeser-Verschlüsselung:\nDurch diese Verschlüsselung, soll man den Klartext, den man an eine bestimmte Person schicken möchte nicht erkennen. Dies geschieht durch ein die Verschiebung des Alphabetes um x-Reihen. Der Empfänger muss so herausfinden um wie viele Reihen das Alphabet verschoben worden ist.\n\nIch weis nicht wie man es knacken könnte, aber wenn man das häufiger gemacht hat könnte man sich die Reihenfolge besser merken und im Schaubild kann man erkennen, dass häufiger die Reihenfolge auf Vokale verschoben wird. (a,e,i,o,u)\n\nc) Ich habe keine Ahnung. \n\n\n",
                        "timestamp": "Thu Dec 17 2015 12:15:13 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    },
                    "revisions": [{
                        "author": "B02",
                        "content": "Caeser-Verschlüsselung:\nDurch diese Verschlüsselung, soll man den Klartext, den man an eine bestimmte Person schicken möchte nicht erkennen. Dies geschieht durch ein die Verschiebung des Alphabetes um x-Reihen. Der Empfänger muss so herausfinden um wie viele Reihen das Alphabet verschoben worden ist.\n\nIch weis nicht wie man es knacken könnte, aber wenn man das häufiger gemacht hat könnte man sich die Reihenfolge besser merken und im Schaubild kann man erkennen, dass häufiger die Reihenfolge auf Vokale verschoben wird. (a,e,i,o,u)\n\nc) Ich habe keine Ahnung. \n\n\n",
                        "timestamp": "Thu Dec 17 2015 12:15:13 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    }, {"id": "0", "content": "", "author": "B02", "timestamp": "2015-12-17T11:06:30.000Z"}],
                    "author": "B02",
                    "id": "56729a345716cfd9c4a669b3"
                }
            }, {
                "id": "56729a4b5716cfd9c4a669c0",
                "metadata": {
                    "id": "56729a4b5716cfd9c4a669c0",
                    "storageType": "folder",
                    "target": {
                        "id": "0a399a11-a2f9-4f61-d134-e15db8578a16",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296665716cfd9c4a64305", "displayName": "B02", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:21:21.044Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{"text": "Es ist aufdauer", "type": "free"}, {
                        "text": "schwieriger",
                        "type": "conditional"
                    }],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "b8483952-3430-4005-8d3a-eaa36c6e9fc9",
                    "elements": [{"text": "mehr Sicherheit", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "7b038246-9232-43af-a3c4-b10c82707c56",
                    "elements": [{"text": "Buchstaben ", "type": "free"}, {"text": "tauschen", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729a505716cfd9c4a669d7",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f85", "displayName": "Waldemar", "objectType": "teacher"},
                    "published": "2015-12-17T11:06:58.366Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729a505716cfd9c4a669d7"
                },
                "content": {
                    "title": "Aufgaben",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "a)\nDer Klartext soll vom sender zum Empfänger gelangen,wobei nur die beide wissen welcher Verschlüsselungsgrad vorliegt\n\nb)\nes ist natürlich klar ,dass man an häufigen vorkommen sehen kann was die Vokale sind da sie in jedem Wort vorkommen\nc)\nhöchstens 24\nnein",
                        "author": "Waldemar",
                        "timestamp": "Thu Dec 17 2015 12:06:58 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "a)\nDer Klartext soll vom sender zum Empfänger gelangen,wobei nur die beide wissen welcher Verschlüsselungsgrad vorliegt\n\nb)\nes ist natürlich klar ,dass man an häufigen vorkommen sehen kann was die Vokale sind da sie in jedem Wort vorkommen\nc)\nhöchstens 24\nnein",
                        "author": "Waldemar",
                        "timestamp": "Thu Dec 17 2015 12:06:58 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "Waldemar"
                }
            }, {
                "id": "56729aac5716cfd9c4a66cf4",
                "metadata": {
                    "id": "56729aac5716cfd9c4a66cf4",
                    "storageType": "folder",
                    "target": {
                        "id": "63f82138-ed31-4e2d-c329-70e0a537f9fa",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f85", "displayName": "Waldemar", "objectType": "teacher"},
                    "published": "2015-12-17T11:13:14.824Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{
                        "text": "wenig Mögliche Arten zum Verschlüsseln",
                        "type": "free"
                    }, {"text": "machen es", "type": "free"}, {"text": "anfälliger", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "2d3e451c-6109-46b8-f60e-e65da271609e",
                    "elements": [{"text": "so länger der Text,so einfacher die entschlüsselung", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "1587e18b-705e-4977-9a81-6e56e7dde319",
                    "elements": [{
                        "text": "Es gäb viele verschiedene Möglichkeiten. z.B. durch wegnehmen der Vokale dafür einen anderen ersatz oder mehrmals die art wechseln d.h. jedes wort anders verschlüsseln ",
                        "type": "free"
                    }],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729b165716cfd9c4a66f23",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f83", "displayName": "B18", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:10:12.705Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729b165716cfd9c4a66f23"
                },
                "content": {
                    "title": "Caesar-Verschlüsselung",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "a. Die Caesar-Verschlüsselung basiert auf einer Verschiebung des Alphabets anhand der Variablen x. Um einen Text lesbar zu machen, muss man also dieses x kennen, und das Alphabet dann um diesen Wert verschieben.\n\nb. Man kann bei langen Texten eine Häufigkeitsanalyse durchaus durchführen, vorausgesetzt man kennt die Sprache, in der der Text verfasst wurde, und die, dieser Sprache zugrunde liegende, Häufigkeitsanalyse, da man mit diesem Verfahren eine Buchstaben mit relativ hoher Wahrscheinlichkeit bestimmen kann.\n\nc. Man braucht maximal 25 Versuche, die 26 Möglichkeiten, wobei man die richtige (a=a) ausschließen kann, vorrausgesetzt wir befinden uns im Bereich des lateinischen Alphabets. Der Begriff monoalphabetisch könnte bedeuten, dass der Text im gleichen Format verfasst wurde, wenn nämlich dies auf kyrillisch oder arabisch verfasst wäre, hätten wir auch durchaus mehr als 25 Möglichkeiten.",
                        "author": "B18",
                        "timestamp": "Thu Dec 17 2015 12:10:12 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "a. Die Caesar-Verschlüsselung basiert auf einer Verschiebung des Alphabets anhand der Variablen x. Um einen Text lesbar zu machen, muss man also dieses x kennen, und das Alphabet dann um diesen Wert verschieben.\n\nb. Man kann bei langen Texten eine Häufigkeitsanalyse durchaus durchführen, vorausgesetzt man kennt die Sprache, in der der Text verfasst wurde, und die, dieser Sprache zugrunde liegende, Häufigkeitsanalyse, da man mit diesem Verfahren eine Buchstaben mit relativ hoher Wahrscheinlichkeit bestimmen kann.\n\nc. Man braucht maximal 25 Versuche, die 26 Möglichkeiten, wobei man die richtige (a=a) ausschließen kann, vorrausgesetzt wir befinden uns im Bereich des lateinischen Alphabets. Der Begriff monoalphabetisch könnte bedeuten, dass der Text im gleichen Format verfasst wurde, wenn nämlich dies auf kyrillisch oder arabisch verfasst wäre, hätten wir auch durchaus mehr als 25 Möglichkeiten.",
                        "author": "B18",
                        "timestamp": "Thu Dec 17 2015 12:10:12 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B18"
                }
            }, {
                "id": "56729b5d5716cfd9c4a6702b",
                "metadata": {
                    "id": "56729b5d5716cfd9c4a6702b",
                    "storageType": "folder",
                    "target": {
                        "id": "3b7ca3e7-a8e7-48b9-eec9-a9013d3a5046",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f83", "displayName": "B18", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:16:12.381Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "poly-",
                        "type": "variable"
                    }, {"text": "Alphabet", "type": "variable"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "schwieriger", "type": "conditional"}, {"text": "Schlüsselsuche", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "dc11a690-05e2-4f95-a693-51cc20aaba3b",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "längerer",
                        "type": "free"
                    }, {"text": "Text", "type": "free"}, {"text": "DANN", "type": "conditional"}, {
                        "text": "anfälliger",
                        "type": "conditional"
                    }, {"text": "gegen", "type": "free"}, {"text": "Häufigkeitsanalyse", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "cdaa03d7-ae5e-4606-e5a0-12e7e3c886c4",
                    "elements": [{"text": "längerer", "type": "free"}, {
                        "text": "Schlüssel",
                        "type": "free"
                    }, {"text": "DANN", "type": "conditional"}, {
                        "text": "schwieriger",
                        "type": "conditional"
                    }, {"text": "Schlüsselsuche", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729b965716cfd9c4a67086",
                "metadata": {
                    "id": "56729b965716cfd9c4a67086",
                    "storageType": "folder",
                    "target": {
                        "id": "c4cd5fae-fb0e-4a79-95a5-f12508d2ee4f",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296435716cfd9c4a63f38", "displayName": "B13", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:17:37.259Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{"text": "mono-", "type": "variable"}, {
                        "text": "Alphabet",
                        "type": "variable"
                    }, {"text": "unsicherer", "type": "conditional"}, {
                        "text": "anfälliger",
                        "type": "conditional"
                    }, {"text": "Versuche", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "ff12dd82-ae45-4d80-a719-568bfc53d0fe",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "DANN", "type": "conditional"}, {
                        "text": "unsicherer",
                        "type": "conditional"
                    }, {"text": "WENN", "type": "conditional"}, {
                        "text": "weniger",
                        "type": "conditional"
                    }, {"text": "DANN", "type": "conditional"}, {"text": "sicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "a7819414-cd56-453a-9a89-e676587f1da2",
                    "elements": [{"text": "schwieriger", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "Substitution", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729bdb5716cfd9c4a6714c",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296435716cfd9c4a63f38", "displayName": "B13", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:13:29.131Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729bdb5716cfd9c4a6714c"
                },
                "content": {
                    "title": "Fragen beantworten",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "a) Die Caesar-Verschlüsselung besteht aus einem Substitutionsverfahren, zu dem jeder Buchstabe ein anderer Buchstabe zugeordnet ist.\nDer Sender braucht dazu einen bestimmten Schlüssel, um den Klartext in die verschlüsselte Schrift umzuwandeln.\nDer Empfänger braucht wiederum den gleichen Schlüssel, um die verschlüsselte Schrift in Klartext umwandeln zu können.\n\nb)Die Häufigkeitsanalyse kann eine sehr große Rolle spielen, da wiederkehrende Buchstaben sehr leicht als die im deutschen Alphabet häufig vorkommenden Buchstaben identifiziert werden können.\nSomit können Buchstaben, die häufig vorkommen, sofort identifiziert werden, während Buchstaben, die sehr selten vorkommen, fast garnicht in der Caesar-Verschlüsselung vorkommen.\n\nc)Man braucht maximal 25 Versuche um die Verschlüsselung zu knacken. Monoalphabetisch könnte in diesem Kontext bedeuten, dass mehrere Buchstaben mehrmals vorkommen und somit leichter identifiziert werden können.",
                        "author": "B13",
                        "timestamp": "Thu Dec 17 2015 12:13:29 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "a) Die Caesar-Verschlüsselung besteht aus einem Substitutionsverfahren, zu dem jeder Buchstabe ein anderer Buchstabe zugeordnet ist.\nDer Sender braucht dazu einen bestimmten Schlüssel, um den Klartext in die verschlüsselte Schrift umzuwandeln.\nDer Empfänger braucht wiederum den gleichen Schlüssel, um die verschlüsselte Schrift in Klartext umwandeln zu können.\n\nb)Die Häufigkeitsanalyse kann eine sehr große Rolle spielen, da wiederkehrende Buchstaben sehr leicht als die im deutschen Alphabet häufig vorkommenden Buchstaben identifiziert werden können.\nSomit können Buchstaben, die häufig vorkommen, sofort identifiziert werden, während Buchstaben, die sehr selten vorkommen, fast garnicht in der Caesar-Verschlüsselung vorkommen.\n\nc)Man braucht maximal 25 Versuche um die Verschlüsselung zu knacken. Monoalphabetisch könnte in diesem Kontext bedeuten, dass mehrere Buchstaben mehrmals vorkommen und somit leichter identifiziert werden können.",
                        "author": "B13",
                        "timestamp": "Thu Dec 17 2015 12:13:29 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B13"
                }
            }, {
                "id": "56729c5e5716cfd9c4a67458",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e15716cfd9c4a64d55", "displayName": "B08", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:15:39.151Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729c5e5716cfd9c4a67458"
                },
                "content": {
                    "title": "Nr.1",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "a) Auf der Scheibe ist in zwei reihen das Alphabet aufgelistet. Man braucht um eine Nachricht zu entschlüsseln immer einen Schlüssel, damit man die Scheibe um die gewünschte Anzahl an Ziffern verschieben kann. Der Sender chiffriert die Nachricht mit einem Schlüssel und der Empfänger nutzt dann den Schlüssel und die Nachricht zu dechiffrieren.\n\nb) Da die Buchstaben im deutschen Alphabet unterschiedlich häufig genutzt werden kann man, wenn man sich die Nachricht anschaut auch dort Häufigkeiten von verschiedenen Buchstaben finden. Man schaut welches Zeichen am häufigsten ist und das ist dann mit relativ hoher Wahrscheinlichkeit der Buchstabe e.\n\nc)25 Versuche",
                        "author": "B08",
                        "timestamp": "Thu Dec 17 2015 12:15:39 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "a) Auf der Scheibe ist in zwei reihen das Alphabet aufgelistet. Man braucht um eine Nachricht zu entschlüsseln immer einen Schlüssel, damit man die Scheibe um die gewünschte Anzahl an Ziffern verschieben kann. Der Sender chiffriert die Nachricht mit einem Schlüssel und der Empfänger nutzt dann den Schlüssel und die Nachricht zu dechiffrieren.\n\nb) Da die Buchstaben im deutschen Alphabet unterschiedlich häufig genutzt werden kann man, wenn man sich die Nachricht anschaut auch dort Häufigkeiten von verschiedenen Buchstaben finden. Man schaut welches Zeichen am häufigsten ist und das ist dann mit relativ hoher Wahrscheinlichkeit der Buchstabe e.\n\nc)25 Versuche",
                        "author": "B08",
                        "timestamp": "Thu Dec 17 2015 12:15:39 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B08"
                }
            }, {
                "id": "56729cb65716cfd9c4a6784a",
                "metadata": {
                    "id": "56729cb65716cfd9c4a6784a",
                    "storageType": "folder",
                    "target": {
                        "id": "6002992a-c404-4b88-bebb-3cc30e0dee23",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e15716cfd9c4a64d55", "displayName": "B08", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:24:55.693Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "5c0333dc-092e-4826-8839-9b7976f610da",
                    "elements": [{
                        "text": "1. Man kann relativ einfach durch ausprobieren schlüssel herausfinden",
                        "type": "free"
                    }, {
                        "text": "2. Keine",
                        "type": "free"
                    }, {"text": "3. Es wird schwieriger, wenn man andere Zeichen verwendet.", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729cef5716cfd9c4a67b97",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296b55716cfd9c4a648c0", "displayName": "B06", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:18:03.273Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729cef5716cfd9c4a67b97"
                },
                "content": {
                    "title": "Caesar-Verschlüsselung",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "A. Der Caeser-Verschlüsselungscode verschiebt Buchstaben miteinander, um aus dem Klartext den chiffrierten Text zu machen. Dazu wird jeder Buchstabe durch einen anderen ersetzt, der um eine bestimmte Zahl weiter im Alphabet liegt. Diese Zahl ist der Schlüssel, denn wenn man die Buchstaben der Botschaft um die Zahl des Schlüssels zurückverschiebt, erhält man den Klartext.\n\nB. Mit einer Häufigkeitsanalyse könnte man herausfinden, welcher Buchstabe im chiffrierten Text welchen Buchstaben im Klartext darstellt, wenn man schaut, welcher Buchstabe am Häufigsten vorkommt.\nAuf diese Weise kann man rein statistisch den Code eventuell knacken.\n\nC. Man braucht maximal 25 Versuche, wenn man jeden Schlüssel einmal ausprobiert. \nMonoalphabetisch könnte heißen, dass die Buchstaben nur einmal verschoben werden anstatt mehrfach hintereinander.",
                        "author": "B06",
                        "timestamp": "Thu Dec 17 2015 12:18:03 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "A. Der Caeser-Verschlüsselungscode verschiebt Buchstaben miteinander, um aus dem Klartext den chiffrierten Text zu machen. Dazu wird jeder Buchstabe durch einen anderen ersetzt, der um eine bestimmte Zahl weiter im Alphabet liegt. Diese Zahl ist der Schlüssel, denn wenn man die Buchstaben der Botschaft um die Zahl des Schlüssels zurückverschiebt, erhält man den Klartext.\n\nB. Mit einer Häufigkeitsanalyse könnte man herausfinden, welcher Buchstabe im chiffrierten Text welchen Buchstaben im Klartext darstellt, wenn man schaut, welcher Buchstabe am Häufigsten vorkommt.\nAuf diese Weise kann man rein statistisch den Code eventuell knacken.\n\nC. Man braucht maximal 25 Versuche, wenn man jeden Schlüssel einmal ausprobiert. \nMonoalphabetisch könnte heißen, dass die Buchstaben nur einmal verschoben werden anstatt mehrfach hintereinander.",
                        "author": "B06",
                        "timestamp": "Thu Dec 17 2015 12:18:03 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B06"
                }
            }, {
                "id": "56729d3c5716cfd9c4a6819d",
                "metadata": {
                    "id": "56729d3c5716cfd9c4a6819d",
                    "storageType": "folder",
                    "target": {
                        "id": "c6a045b7-247c-460c-d56e-b0721c534896",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296675716cfd9c4a64360", "displayName": "B17", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:28:18.427Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "einfacher", "type": "conditional"}, {"text": "ist", "type": "free"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "ist", "type": "free"}, {"text": "das", "type": "free"}, {
                        "text": "System",
                        "type": "free"
                    }, {"text": "unsicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "8fd2f2af-dcb0-4286-c893-3b54832bc0e3",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "das",
                        "type": "free"
                    }, {"text": "Alphabet", "type": "variable"}, {
                        "text": "mono-",
                        "type": "variable"
                    }, {"text": "Alphabet", "type": "variable"}, {"text": "ist", "type": "free"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "ist", "type": "free"}, {"text": "die ", "type": "free"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "einfacher", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "7c15b5d3-b465-4e37-f1df-406e5171e275",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "weniger",
                        "type": "conditional"
                    }, {"text": "möglichkeiten ", "type": "free"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "unsicherer", "type": "conditional"}, {
                        "text": "einfacher",
                        "type": "conditional"
                    }, {"text": "anfälliger", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "40156fdf-709b-493d-e430-c25e95695acb",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "Buchstaben ", "type": "free"}, {"text": "ODER ", "type": "free"}, {
                        "text": "poly-",
                        "type": "variable"
                    }, {"text": "Alphabet", "type": "variable"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "erhöht", "type": "conditional"}, {"text": "sicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729d4f5716cfd9c4a6829e",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56729cff5716cfd9c4a67c3a", "displayName": "B07", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:19:39.579Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729d4f5716cfd9c4a6829e"
                },
                "content": {
                    "title": "Caesar-Verschlüsselung",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "A. Der Caeser-Verschlüsselungscode verschiebt Buchstaben miteinander, um aus dem Klartext den chiffrierten Text zu machen. Dazu wird jeder Buchstabe durch einen anderen ersetzt, der um eine bestimmte Zahl weiter im Alphabet liegt. Diese Zahl ist der Schlüssel, denn wenn man die Buchstaben der Botschaft um die Zahl des Schlüssels zurückverschiebt, erhält man den Klartext.\n\nB. Mit einer Häufigkeitsanalyse könnte man herausfinden, welcher Buchstabe im chiffrierten Text welchen Buchstaben im Klartext darstellt, wenn man schaut, welcher Buchstabe am Häufigsten vorkommt. Auf diese Weise kann man rein statistisch den Code eventuell knacken.\n\nC. Man braucht maximal 25 Versuche, wenn man jeden Schlüssel einmal ausprobiert. Monoalphabetisch könnte heißen, dass die Buchstaben nur einmal verschoben werden anstatt mehrfach hintereinander.",
                        "author": "B07",
                        "timestamp": "Thu Dec 17 2015 12:19:39 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "A. Der Caeser-Verschlüsselungscode verschiebt Buchstaben miteinander, um aus dem Klartext den chiffrierten Text zu machen. Dazu wird jeder Buchstabe durch einen anderen ersetzt, der um eine bestimmte Zahl weiter im Alphabet liegt. Diese Zahl ist der Schlüssel, denn wenn man die Buchstaben der Botschaft um die Zahl des Schlüssels zurückverschiebt, erhält man den Klartext.\n\nB. Mit einer Häufigkeitsanalyse könnte man herausfinden, welcher Buchstabe im chiffrierten Text welchen Buchstaben im Klartext darstellt, wenn man schaut, welcher Buchstabe am Häufigsten vorkommt. Auf diese Weise kann man rein statistisch den Code eventuell knacken.\n\nC. Man braucht maximal 25 Versuche, wenn man jeden Schlüssel einmal ausprobiert. Monoalphabetisch könnte heißen, dass die Buchstaben nur einmal verschoben werden anstatt mehrfach hintereinander.",
                        "author": "B07",
                        "timestamp": "Thu Dec 17 2015 12:19:39 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B07"
                }
            }, {
                "id": "56729d655716cfd9c4a68351",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296625716cfd9c4a641d7", "displayName": "B14", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:20:01.337Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729d655716cfd9c4a68351"
                },
                "content": {
                    "title": "Info",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "a) die Caesar Verschlüsselung funktioniert so das man die Buchstaben aus dem Alphabet um eine beliebige zahl zur Seite verschiebt. Die worte werden dann von den Sender so mit den Buchstaben aufgeschrieben, die von der Verschiebung angezeigt werden. Der Empfänger muss die Verschiebung wissen um die Botschaft zu entschlüsseln. \n\nb) Die Häufigkeitsverteilung kann helfen, indem man dann in die Botschaft guckt, welche Buchstaben am Häufigsten vorkommen. Die Häufigsten Buchstaben werden mit der Verschiebung zu dem Buchstaben e angegeben, da e der häufigste Buchstabe in der Deutschen Sprache ist und dann versucht man die Nachricht zu entschlüsseln.\n \nc) Man braucht um die Caesar Verschlüsslung zu entschlüsseln maximal 25 Versuche. Da das Alphabet 26 Buchstaben hat. Aber man nur 25 zur Seite verschieben kann. Da das a bleibt wenn man für a ein a einsetzt",
                        "author": "B14",
                        "timestamp": "Thu Dec 17 2015 12:20:01 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "a) die Caesar Verschlüsselung funktioniert so das man die Buchstaben aus dem Alphabet um eine beliebige zahl zur Seite verschiebt. Die worte werden dann von den Sender so mit den Buchstaben aufgeschrieben, die von der Verschiebung angezeigt werden. Der Empfänger muss die Verschiebung wissen um die Botschaft zu entschlüsseln. \n\nb) Die Häufigkeitsverteilung kann helfen, indem man dann in die Botschaft guckt, welche Buchstaben am Häufigsten vorkommen. Die Häufigsten Buchstaben werden mit der Verschiebung zu dem Buchstaben e angegeben, da e der häufigste Buchstabe in der Deutschen Sprache ist und dann versucht man die Nachricht zu entschlüsseln.\n \nc) Man braucht um die Caesar Verschlüsslung zu entschlüsseln maximal 25 Versuche. Da das Alphabet 26 Buchstaben hat. Aber man nur 25 zur Seite verschieben kann. Da das a bleibt wenn man für a ein a einsetzt",
                        "author": "B14",
                        "timestamp": "Thu Dec 17 2015 12:20:01 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B14"
                }
            }, {
                "id": "56729d715716cfd9c4a683a5",
                "metadata": {
                    "id": "56729d715716cfd9c4a683a5",
                    "storageType": "folder",
                    "target": {
                        "id": "5b184532-2f72-46a7-f38b-66334400cbc9",
                        "initialContent": [{
                            "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                            "approved": false,
                            "state": "unclear",
                            "showConfidenceMeter": true,
                            "confidence": 50,
                            "tested": false,
                            "elements": []
                        }],
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296485716cfd9c4a63f5d", "displayName": "B05", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:34:29.361Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "6e3d71fc-c38e-4429-ee87-4070567123bd",
                    "elements": [{"text": "Schlüsselsuche", "type": "variable"}, {
                        "text": "einfacher",
                        "type": "conditional"
                    }, {"text": "weniger", "type": "conditional"}, {
                        "text": "mono-",
                        "type": "variable"
                    }, {"text": "Substitution", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "8025feb5-59eb-40fe-d328-174dd86c8eeb",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "schwieriger", "type": "conditional"}, {
                        "text": "sicherer",
                        "type": "conditional"
                    }, {"text": "mehr", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "c848d5ef-9903-4306-8af3-2f015f5bdb4b",
                    "elements": [{"text": "DANN", "type": "conditional"}, {
                        "text": "sicherer",
                        "type": "conditional"
                    }, {"text": "WENN", "type": "conditional"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "schwieriger", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "mono-", "type": "variable"}, {"text": "Alphabet", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729d795716cfd9c4a683be",
                "metadata": {
                    "id": "56729d795716cfd9c4a683be",
                    "storageType": "folder",
                    "target": {
                        "id": "90aba48c-48c8-4707-c393-9fb78dd9cc90",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672965d5716cfd9c4a64185", "displayName": "B01", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:25:45.205Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "8bacbb88-ba1a-49e7-9995-3f5083f54a32",
                    "elements": [{"text": "durch", "type": "free"}, {
                        "text": "häufigkeitsanalyse",
                        "type": "free"
                    }, {"text": "unsicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 90,
                    "showConfidenceMeter": true
                }, {
                    "id": "3ac20bfa-aef5-478b-f6bc-7bb75619d411",
                    "elements": [{"text": "schwieriger", "type": "conditional"}, {
                        "text": "WENN",
                        "type": "conditional"
                    }, {"text": "poly-", "type": "variable"}, {
                        "text": "Alphabet",
                        "type": "variable"
                    }, {"text": "benutzt wird", "type": "free"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "sicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 70,
                    "showConfidenceMeter": true
                }, {
                    "id": "60cb4767-02dc-4459-c67e-6213cd21f6a6",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "text",
                        "type": "free"
                    }, {"text": "lang", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729d855716cfd9c4a68458",
                "metadata": {
                    "id": "56729d855716cfd9c4a68458",
                    "storageType": "folder",
                    "target": {
                        "id": "044517ec-3a17-4629-d775-c309fb344b1c",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56729cff5716cfd9c4a67c3a", "displayName": "B07", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:36:11.638Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3e627c68-e6a4-4d6e-de3e-2160dd6a6a46",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "Versuche", "type": "variable"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "unsicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "847fe226-10cc-4ec2-dfdb-391f876181b4",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mehr",
                        "type": "conditional"
                    }, {"text": "Schlüssel", "type": "free"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "schwieriger", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "2b09e4ed-085f-4573-90ef-31182ea1cb5e",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "häüfigere",
                        "type": "free"
                    }, {"text": "Substitution", "type": "variable"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "sicherer", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729df25716cfd9c4a68858",
                "metadata": {
                    "id": "56729df25716cfd9c4a68858",
                    "storageType": "folder",
                    "target": {
                        "id": "0c912578-a060-4359-9d26-5487e0cebdb3",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296625716cfd9c4a641d7", "displayName": "B14", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:27:43.207Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "dbf24bd2-ab83-42c2-9333-752f5104a38e",
                    "elements": [{
                        "text": "1. Man kann relativ einfach durch ausprobieren Schlüssel herausfinden",
                        "type": "free"
                    }, {"text": "2. keine", "type": "free"}, {
                        "text": "3. Indem man andere Zeichen noch einfügt",
                        "type": "free"
                    }],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 100,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "56729f3edc1f784c4d2fd9fa",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e75716cfd9c4a64dac", "displayName": "B09", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:27:54.266Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "56729f3edc1f784c4d2fd9fa"
                },
                "content": {
                    "title": "Wissenstest",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Aufgabe 1: Fragen beantworten\na.\nJeder Buchstabe im Alphabet wird einer Zahl zugeordnet.Dem Buchstaben A wird zum Beispiel die 1 zugeordnet und dem Buchstaben Z wird die 24 zugeordnet.Dann wird eine Zahl ausgesucht um wie viel man die Buchstaben verschiebt.\nb. \nMan kann durch ausprobieren den Code knacken und dadurch die Verschiebung erfahren,außer wenn jeder Buchstabe anders verschoben wird.Dann müsste man aber den Zahlencode \nmitsenden.\nc.\nMan muss mindestens zweimal Versuchen die Caesar-Verschlüsselung zu entschlüsseln.Da die Verschiebung bei den Buchstaben gleich bleibt.",
                        "author": "B09",
                        "timestamp": "Thu Dec 17 2015 12:27:54 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Aufgabe 1: Fragen beantworten\na.\nJeder Buchstabe im Alphabet wird einer Zahl zugeordnet.Dem Buchstaben A wird zum Beispiel die 1 zugeordnet und dem Buchstaben Z wird die 24 zugeordnet.Dann wird eine Zahl ausgesucht um wie viel man die Buchstaben verschiebt.\nb. \nMan kann durch ausprobieren den Code knacken und dadurch die Verschiebung erfahren,außer wenn jeder Buchstabe anders verschoben wird.Dann müsste man aber den Zahlencode \nmitsenden.\nc.\nMan muss mindestens zweimal Versuchen die Caesar-Verschlüsselung zu entschlüsseln.Da die Verschiebung bei den Buchstaben gleich bleibt.",
                        "author": "B09",
                        "timestamp": "Thu Dec 17 2015 12:27:54 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B09"
                }
            }, {
                "id": "56729f63dc1f784c4d2fdb99",
                "metadata": {
                    "id": "56729f63dc1f784c4d2fdb99",
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296435716cfd9c4a63f38", "displayName": "B13", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:33:51.571Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": {
                    "title": "Edward Snow",
                    "isIndex": true,
                    "currentRevision": {
                        "author": "B13",
                        "content": "ich weiß über cäsar verfahren und vignete verfahren bescheid.\nvor 2000 jahren spielten die verschlüsselung eine genauso große rolle wie heute, denn niemandsoll nachrichten mitlesen können. es ist sehr wichtig daten zu verschlüsseln weil es zur privatsphäre gehört. das cäsar verfahren ist mit einer häufigkeitsanalyse sehr leicht zu knacken. das vignete verfahren ist auch leicht knackbar, bestimmt, aber ich weiß nicht wie. man könnte zahlen und sonerzeichen mit reinmischen.",
                        "timestamp": "Thu Dec 17 2015 12:33:51 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    },
                    "revisions": [{
                        "author": "B13",
                        "content": "ich weiß über cäsar verfahren und vignete verfahren bescheid.\nvor 2000 jahren spielten die verschlüsselung eine genauso große rolle wie heute, denn niemandsoll nachrichten mitlesen können. es ist sehr wichtig daten zu verschlüsseln weil es zur privatsphäre gehört. das cäsar verfahren ist mit einer häufigkeitsanalyse sehr leicht zu knacken. das vignete verfahren ist auch leicht knackbar, bestimmt, aber ich weiß nicht wie. man könnte zahlen und sonerzeichen mit reinmischen.",
                        "timestamp": "Thu Dec 17 2015 12:33:51 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    }, {"id": "0", "content": "", "author": "B13", "timestamp": "2015-12-17T11:28:30.000Z"}],
                    "author": "B13",
                    "id": "56729f63dc1f784c4d2fdb99"
                }
            }, {
                "id": "56729f7ddc1f784c4d2fdcf8",
                "metadata": {
                    "id": "56729f7ddc1f784c4d2fdcf8",
                    "storageType": "folder",
                    "target": {
                        "id": "91e5ee34-9749-41d2-81f1-d4d7a5b40d7a",
                        "initialContent": [{
                            "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                            "approved": false,
                            "state": "unclear",
                            "showConfidenceMeter": true,
                            "confidence": 50,
                            "tested": false,
                            "elements": []
                        }],
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e75716cfd9c4a64dac", "displayName": "B09", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:36:18.792Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "3bcbc627-76b8-4bc9-d26d-84162345aff8",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Verschlüsselung",
                        "type": "free"
                    }, {"text": "gleich", "type": "free"}, {"text": "DANN", "type": "conditional"}, {
                        "text": "weniger",
                        "type": "conditional"
                    }, {"text": "Versuche", "type": "variable"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "d9757417-d48d-487f-b15f-96f5f84208c5",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "weniger",
                        "type": "conditional"
                    }, {"text": "lang", "type": "free"}, {"text": "DANN", "type": "conditional"}, {
                        "text": "anfälliger",
                        "type": "conditional"
                    }],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "235c15f9-80b1-475d-9ff7-b94e0e7a5201",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Verschiebung",
                        "type": "free"
                    }, {"text": "unterschiedlich", "type": "free"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "verringert", "type": "conditional"}, {
                        "text": "Chance",
                        "type": "free"
                    }, {"text": "entschlüsselt zu werden", "type": "free"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "5672a000dc1f784c4d2fe503",
                "metadata": {
                    "id": "5672a000dc1f784c4d2fe503",
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672968e5716cfd9c4a6461e", "displayName": "B11", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:38:49.888Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": {
                    "title": "Die Caesar- Verschlüsselung",
                    "isIndex": true,
                    "currentRevision": {
                        "author": "B11",
                        "content": "a) Die Caesar- Verschlüsselung basiert auf der Verschiebung von den Buchstaben um x Stellen des deutschen Alphabets. Beim entschlüsseln des Ciphertext, kann einem das sogenannte \"Caesar Cipher\" helfen. So kannst du es ganz einfach in den Klartext übersetzten.\n\nb) Früher war der Schlüssel hinter dem ganzen, nicht die Verschlüsselung selbst, sonder das Geheimnis hinter dem Konzept. Die Häufigkeitsanalyse hilft soweit, weil in der deutschen Sprache zum Beispiel verhäuft das \"e\" verwendet wird. Wenn dann beispielsweise ganz oft das \"a\" in einem Wort vorkommt, kann man mit hoher Wahrscheinlichkeit sagen, dass das \"a\" in der Ceasar- Verschlüsselung das \"e\" in dem normalen Alphabet.\n\n\n\nc) Man hat max. 25 Versuche um die verschlüsselte Nachricht herauszubekommen, da das Alphabet 26 Buchstaben hat. So kann man jeden Buchstaben einzeln durchgehen.",
                        "timestamp": "Thu Dec 17 2015 12:38:49 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "2"
                    },
                    "revisions": [{
                        "author": "B11",
                        "content": "a) Die Caesar- Verschlüsselung basiert auf der Verschiebung von den Buchstaben um x Stellen des deutschen Alphabets. Beim entschlüsseln des Ciphertext, kann einem das sogenannte \"Caesar Cipher\" helfen. So kannst du es ganz einfach in den Klartext übersetzten.\n\nb) Früher war der Schlüssel hinter dem ganzen, nicht die Verschlüsselung selbst, sonder das Geheimnis hinter dem Konzept. Die Häufigkeitsanalyse hilft soweit, weil in der deutschen Sprache zum Beispiel verhäuft das \"e\" verwendet wird. Wenn dann beispielsweise ganz oft das \"a\" in einem Wort vorkommt, kann man mit hoher Wahrscheinlichkeit sagen, dass das \"a\" in der Ceasar- Verschlüsselung das \"e\" in dem normalen Alphabet.\n\n\n\nc) Man hat max. 25 Versuche um die verschlüsselte Nachricht herauszubekommen, da das Alphabet 26 Buchstaben hat. So kann man jeden Buchstaben einzeln durchgehen.",
                        "timestamp": "Thu Dec 17 2015 12:38:49 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "2"
                    }, {
                        "author": "B11",
                        "content": "a) Die Caesar- Verschlüsselung basiert auf der Verschiebung von den Buchstaben um x Stellen des deutschen Alphabets. Beim entschlüsseln des Ciphertext, kann einem das sogenannte \"Caesar Cipher\" helfen. So kannst du es ganz einfach in den Klartext übersetzten.\n\nb) Früher war der Schlüssel hinter dem ganzen, nicht die Verschlüsselung selbst, sonder das Geheimnis hinter dem Konzept. Die Häufigkeitsanalyse hilft soweit, weil in der deutschen Sprache zum Beispiel verhäuft das \"e\" verwendet wird. Wenn dann beispielsweise ganz oft das \"a\" in einem Wort vorkommt, kann man mit hoher Wahrscheinlichkeit sagen, dass das \"a\" in der Ceasar- Verschlüsselung das \"e\" in dem normalen Alphabet.\n\n\n\nc) Man hat max. 25 Versuche um die verschlüsselte Nachricht herauszubekommen, da das Alphabet 26 Buchstaben hat. So kann man jeden Buchstaben einzeln durchgehen.",
                        "timestamp": "2015-12-17T11:35:48.000Z",
                        "id": "1"
                    }, {
                        "id": "0",
                        "content": "a) Die Caesar- Verschlüsselung basiert auf der Verschiebung von den Buchstaben um x Stellen des deutschen Alphabets. Beim entschlüsseln des Ciphertext, kann einem das sogenannte \"Caesar Cipher\" helfen. So kannst du es ganz einfach in den Klartext übersetzten.\n\nb) Früher war der Schlüssel hinter dem ganzen, nicht die Verschlüsselung selbst, sonder das Geheimnis hinter dem Konzept. Durch die Häufigkeitsanalyse hilft soweit, weil in der deutschen Sprache zum Beispiel verhäuft das \"e\" verwendet wird. Wenn dann beispielsweise ganz oft das \"a\" in einem Wort vorkommt, kann man mit hoher Wahrscheinlichkeit sagen, dass das \"a\" in der Ceasar- Verschlüsselung das \"e\" in dem normalen Alphabet.\n\n\n\nc) Man hat max. 25 Versuche um die verschlüsselte Nachricht herauszubekommen, da das Alphabet 26 Buchstaben hat. So kann man jeden Buchstaben einzeln durchgehen.",
                        "author": "B11",
                        "timestamp": "2015-12-17T11:31:03.000Z"
                    }],
                    "author": "B11",
                    "id": "5672a000dc1f784c4d2fe503"
                }
            }, {
                "id": "5672a070dc1f784c4d2fe9aa",
                "metadata": {
                    "id": "5672a070dc1f784c4d2fe9aa",
                    "storageType": "folder",
                    "target": {
                        "id": "d654bac8-22c9-4098-c381-40c799cf780e",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672968e5716cfd9c4a6461e", "displayName": "B11", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:44:32.950Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "2aebf88c-ee40-4ec5-9248-ed2422f41009",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Versuche",
                        "type": "variable"
                    }, {"text": "erhöht", "type": "conditional"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "Schlüsselsuche", "type": "variable"}, {"text": "einfacher", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "84db9ad7-c62d-4041-c710-3a4d742d5b99",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mono-",
                        "type": "variable"
                    }, {"text": "Alphabet", "type": "variable"}, {
                        "text": "sicherer",
                        "type": "conditional"
                    }, {"text": "DANN", "type": "conditional"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "schwieriger", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "493d3945-ee99-4874-ff01-2f9a5b084591",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "einfacher", "type": "conditional"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "Versuche", "type": "variable"}, {"text": "verringert", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "5672a126dc1f784c4d2ff87f",
                "metadata": {
                    "id": "5672a126dc1f784c4d2ff87f",
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e15716cfd9c4a64d55", "displayName": "B08", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:43:04.647Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": {
                    "title": "3. Investigation Aufgabe 3",
                    "isIndex": true,
                    "currentRevision": {
                        "author": "B08",
                        "content": "Man muss sich für seinen Text ein Wort als Schlüssel ausdenken. Diesen wendet man dann an dem Quadrat mit dem Alphabet an und findet so die verschiedenen chiffrierten Buchstaben heraus.",
                        "timestamp": "Thu Dec 17 2015 12:43:04 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    },
                    "revisions": [{
                        "author": "B08",
                        "content": "Man muss sich für seinen Text ein Wort als Schlüssel ausdenken. Diesen wendet man dann an dem Quadrat mit dem Alphabet an und findet so die verschiedenen chiffrierten Buchstaben heraus.",
                        "timestamp": "Thu Dec 17 2015 12:43:04 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    }, {"id": "0", "content": "", "author": "B08", "timestamp": "2015-12-17T11:36:01.000Z"}],
                    "author": "B08",
                    "id": "5672a126dc1f784c4d2ff87f"
                }
            }, {
                "id": "5672a166dc1f784c4d2ffbcf",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f83", "displayName": "B18", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:37:05.377Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a166dc1f784c4d2ffbcf"
                },
                "content": {
                    "title": "Vigenere-Verschlüsselung und Datenverschlüsselung",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Vigenere-Verschlüsselung:\nDiese Verschlüsselung funktioniert mithilfe eines Codewortes. Dieses Codewort wird für den ganzen Text wiederholt, wobei jeder Buchstabe der Nachricht mithilfe der Caesar-Verschlüsselung entschlüsselt wird. Sie ist schwieriger, aber sicherer als die Caesar-Verschlüsselung.\n\nMotivationsschreiben:\nSehr geehrter Herr Snow,\nich würde ihrem Team gerne beitreten, da ich mich sehr für Verschlüsselungstechniken interessiere, um die Daten der Bevölkerung vor dem Zugriff von jeglichem Fremdzugriff zu schützen. Ich kenne bisher die Caesar- und Vigenere-Verschlüsselung. Wie sie sicherlich wissen, funktionieren diese beiden Techniken auf einem Buchstaben oder Codewort, um sie entschlüsseln zu können, indem man das Alphabet anhand dieses Buchstabens verschiebt. Sie sind beide jedoch nicht perfekt, deshalb würde ich gerne weitere kennenlernen, sie können schließlich beide ziemlich einfach entschlüsselt werden.",
                        "author": "B18",
                        "timestamp": "Thu Dec 17 2015 12:37:05 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Vigenere-Verschlüsselung:\nDiese Verschlüsselung funktioniert mithilfe eines Codewortes. Dieses Codewort wird für den ganzen Text wiederholt, wobei jeder Buchstabe der Nachricht mithilfe der Caesar-Verschlüsselung entschlüsselt wird. Sie ist schwieriger, aber sicherer als die Caesar-Verschlüsselung.\n\nMotivationsschreiben:\nSehr geehrter Herr Snow,\nich würde ihrem Team gerne beitreten, da ich mich sehr für Verschlüsselungstechniken interessiere, um die Daten der Bevölkerung vor dem Zugriff von jeglichem Fremdzugriff zu schützen. Ich kenne bisher die Caesar- und Vigenere-Verschlüsselung. Wie sie sicherlich wissen, funktionieren diese beiden Techniken auf einem Buchstaben oder Codewort, um sie entschlüsseln zu können, indem man das Alphabet anhand dieses Buchstabens verschiebt. Sie sind beide jedoch nicht perfekt, deshalb würde ich gerne weitere kennenlernen, sie können schließlich beide ziemlich einfach entschlüsselt werden.",
                        "author": "B18",
                        "timestamp": "Thu Dec 17 2015 12:37:05 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B18"
                }
            }, {
                "id": "5672a174dc1f784c4d2ffc99",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f85", "displayName": "Waldemar", "objectType": "teacher"},
                    "published": "2015-12-17T11:37:18.256Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a174dc1f784c4d2ffc99"
                },
                "content": {
                    "title": "Aufgaben1",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Über die cäser-verschlüsselung und die Vigenère-Verschlüsselung.bei der Cäser werden die Buchstaben einfach eine bestimmte anzahl weitergeschoben. bei der Vigenère-Verschlüsselung wird ein Wort genommen und von dem Wort wird dann abgeleitet welcher grad der Verschlüsselung grade dran ist.zum beispiel bei a gar nicht bei b um eine stelle bei c um 2 und so weiter.\nes ist wichtig etwas zu verschlüsseln da nicht alle Informationen frei zugänglich sein sollen das ist einfchach menschlich,niemand will all seine Geheimnisse frei für alle haben.Es ist und wird immer wichtig sein etwas zu verschlüsseln weil es immer Leute gibt die etwas damit anfangen können was dir nicht gefällt. die cäser Verschlüsselung ist sehr einfach gehalten.es gibt nur 24 verschiedene Möglichkeiten,und das ist sehr wenig.bei der Vigenère-Verschlüsselung ist es schon einiges besser aber auch dort gibt es eine begrenzte anzahl an Möglichkeiten auch wenn sie viel höher ist .Denoch kann ein Buchstabe bei der Vigenère-Verschlüsselung nur auf 24 Möglichkeiten verschlüsselt werden.eine Verschlüsselung die sich alle 5 sec(digital) ändert oder mit einer Verschlüsselung die auch zahlen und sonderzeichen benutzt oder mehrehre verschlüsselungen zum beispiel erst die Vigenère-Verschlüsselung und den Text meinetwegen mit der Cäser verschlüsselung nochmal verschlüsseln.Perfekt wäre es, wenn ein unsymetrisches Verschlüsselungsverfahren möglich wäre aber das ist nicht mehr zu entschlüsseln.",
                        "author": "Waldemar",
                        "timestamp": "Thu Dec 17 2015 12:37:18 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Über die cäser-verschlüsselung und die Vigenère-Verschlüsselung.bei der Cäser werden die Buchstaben einfach eine bestimmte anzahl weitergeschoben. bei der Vigenère-Verschlüsselung wird ein Wort genommen und von dem Wort wird dann abgeleitet welcher grad der Verschlüsselung grade dran ist.zum beispiel bei a gar nicht bei b um eine stelle bei c um 2 und so weiter.\nes ist wichtig etwas zu verschlüsseln da nicht alle Informationen frei zugänglich sein sollen das ist einfchach menschlich,niemand will all seine Geheimnisse frei für alle haben.Es ist und wird immer wichtig sein etwas zu verschlüsseln weil es immer Leute gibt die etwas damit anfangen können was dir nicht gefällt. die cäser Verschlüsselung ist sehr einfach gehalten.es gibt nur 24 verschiedene Möglichkeiten,und das ist sehr wenig.bei der Vigenère-Verschlüsselung ist es schon einiges besser aber auch dort gibt es eine begrenzte anzahl an Möglichkeiten auch wenn sie viel höher ist .Denoch kann ein Buchstabe bei der Vigenère-Verschlüsselung nur auf 24 Möglichkeiten verschlüsselt werden.eine Verschlüsselung die sich alle 5 sec(digital) ändert oder mit einer Verschlüsselung die auch zahlen und sonderzeichen benutzt oder mehrehre verschlüsselungen zum beispiel erst die Vigenère-Verschlüsselung und den Text meinetwegen mit der Cäser verschlüsselung nochmal verschlüsseln.Perfekt wäre es, wenn ein unsymetrisches Verschlüsselungsverfahren möglich wäre aber das ist nicht mehr zu entschlüsseln.",
                        "author": "Waldemar",
                        "timestamp": "Thu Dec 17 2015 12:37:18 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "Waldemar"
                }
            }, {
                "id": "5672a1dcdc1f784c4d3002bd",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672968b5716cfd9c4a645c7", "displayName": "B03", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:38:58.114Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a1dcdc1f784c4d3002bd"
                },
                "content": {
                    "title": "Die Caeser Verschlüsselung ",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "a)\n-dient dazu die Daten zu schützen \n-vom Kaiser Julius Caeser entwickelt\n-eines der ersten kryptographischen Verfahren\n-monoalphabetischen Substitution\n-jeder Buchstabe wird durch einen andere ersetzt, der um x Stellen versetzt wird \n\nb)\n-Ähnlichkeit mit der eigenen Sprache\n-kennen des Monoalphabets\n\nc)\n-maximal 25 Versuche, weil das Alphabet auch 25 Buchstaben hat\n",
                        "author": "B03",
                        "timestamp": "Thu Dec 17 2015 12:38:58 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "a)\n-dient dazu die Daten zu schützen \n-vom Kaiser Julius Caeser entwickelt\n-eines der ersten kryptographischen Verfahren\n-monoalphabetischen Substitution\n-jeder Buchstabe wird durch einen andere ersetzt, der um x Stellen versetzt wird \n\nb)\n-Ähnlichkeit mit der eigenen Sprache\n-kennen des Monoalphabets\n\nc)\n-maximal 25 Versuche, weil das Alphabet auch 25 Buchstaben hat\n",
                        "author": "B03",
                        "timestamp": "Thu Dec 17 2015 12:38:58 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B03"
                }
            }, {
                "id": "5672a22bdc1f784c4d3003f3",
                "metadata": {
                    "id": "5672a22bdc1f784c4d3003f3",
                    "storageType": "folder",
                    "target": {
                        "id": "41b07a20-b31b-4da8-9696-5c8857ec578b",
                        "displayName": "hypotheses",
                        "objectType": "hypotheses"
                    },
                    "generator": {
                        "id": "56706414755d56ec579f7eb6",
                        "displayName": "hypothesis scratchpad",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/hypothesis/build/hypothesis.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672968b5716cfd9c4a645c7", "displayName": "B03", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:44:22.789Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": [{
                    "id": "f11796b0-74c5-4463-dee3-5fd68ad9a18a",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Versuche",
                        "type": "variable"
                    }, {"text": "erhöht", "type": "conditional"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "Schlüsselsuche", "type": "variable"}, {"text": "einfacher", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "8502cfc1-78c3-4d0a-e0a2-53c186c7f60b",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "mono-",
                        "type": "variable"
                    }, {"text": "Alphabet", "type": "variable"}, {
                        "text": "sicherer",
                        "type": "conditional"
                    }, {"text": "DANN", "type": "conditional"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "verringert", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }, {
                    "id": "46c40998-8fa1-4e60-d343-11c1593bccd6",
                    "elements": [{"text": "WENN", "type": "conditional"}, {
                        "text": "Schlüsselsuche",
                        "type": "variable"
                    }, {"text": "einfacher", "type": "conditional"}, {
                        "text": "DANN",
                        "type": "conditional"
                    }, {"text": "Versuche", "type": "variable"}, {"text": "verringert", "type": "conditional"}],
                    "tested": false,
                    "approved": false,
                    "state": "unclear",
                    "confidence": 50,
                    "showConfidenceMeter": true
                }]
            }, {
                "id": "5672a263dc1f784c4d3006cc",
                "metadata": {
                    "id": "5672a263dc1f784c4d3006cc",
                    "storageType": "folder",
                    "target": {
                        "id": "7c52be67-bf35-46de-cbc3-fe0dc0a35ea9",
                        "displayName": "concept map",
                        "objectType": "conceptMap"
                    },
                    "generator": {
                        "id": "567064c0755d56ec579f8209",
                        "displayName": "conceptmapper",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "5. Diskussion",
                        "inquiryPhase": "Discussion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c75",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296435716cfd9c4a63f38", "displayName": "B13", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:44:22.576Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": {
                    "concepts": [{
                        "id": "0ced2fd1-f9d5-4c79-fa2c-32ed1a24cb17",
                        "content": "IREFPUYHRFFRYHAT",
                        "x": 438,
                        "y": 431.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_red"
                    }, {
                        "id": "577a224f-93ed-453b-dbba-9dfd2d61a714",
                        "content": "Verschlüsselung",
                        "x": 498,
                        "y": 182.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }],
                    "relations": [{
                        "id": "7427041f-64c8-4afb-f8f6-b74ef4f843dc",
                        "source": "0ced2fd1-f9d5-4c79-fa2c-32ed1a24cb17",
                        "target": "577a224f-93ed-453b-dbba-9dfd2d61a714",
                        "content": "is a"
                    }]
                }
            }, {
                "id": "5672a267dc1f784c4d30072c",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672965d5716cfd9c4a64185", "displayName": "B01", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:41:21.925Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a267dc1f784c4d30072c"
                },
                "content": {
                    "title": "konzept 2",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "aufg. 1a) es basiert auf einer monoalphabetischen substitution. der sender wandelt einen klartext mit einem schlüssel um. der schlüssel ist in diesem fall eine zahl und um diese einheit werden die buchstaben verschoben. der empfänger braucht den schlüssel um die nachricht zu verstehen.\n\n1b) man kann schauen welcher buchstabe am häufigsten vorkommt. wenn man den code nicht kennt muss man es erraten. \n\n1c) mit monoalphabetisch ist vielleicht gemeint das nur buchstaben für buchstaben stehen und das keine satzzeichen als buchstaben verwendet werden.",
                        "author": "B01",
                        "timestamp": "Thu Dec 17 2015 12:41:21 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "aufg. 1a) es basiert auf einer monoalphabetischen substitution. der sender wandelt einen klartext mit einem schlüssel um. der schlüssel ist in diesem fall eine zahl und um diese einheit werden die buchstaben verschoben. der empfänger braucht den schlüssel um die nachricht zu verstehen.\n\n1b) man kann schauen welcher buchstabe am häufigsten vorkommt. wenn man den code nicht kennt muss man es erraten. \n\n1c) mit monoalphabetisch ist vielleicht gemeint das nur buchstaben für buchstaben stehen und das keine satzzeichen als buchstaben verwendet werden.",
                        "author": "B01",
                        "timestamp": "Thu Dec 17 2015 12:41:21 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B01"
                }
            }, {
                "id": "5672a361dc1f784c4d3012bb",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "567063f2755d56ec579f7e98",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "2. Konzept",
                        "inquiryPhase": "Conceptualisation",
                        "inquiryPhaseId": "567062f3755d56ec579f7c66",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296485716cfd9c4a63f5d", "displayName": "B05", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:45:32.522Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a361dc1f784c4d3012bb"
                },
                "content": {
                    "title": "rr",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "1a. Durch Vertauschung der Buchstaben.\n1b. Helfen bei der Entschlüsseleung\n1c. Maximal 25 mal.",
                        "author": "B05",
                        "timestamp": "Thu Dec 17 2015 12:45:32 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "1a. Durch Vertauschung der Buchstaben.\n1b. Helfen bei der Entschlüsseleung\n1c. Maximal 25 mal.",
                        "author": "B05",
                        "timestamp": "Thu Dec 17 2015 12:45:32 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B05"
                }
            }, {
                "id": "5672a39adc1f784c4d30135e",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e15716cfd9c4a64d55", "displayName": "B08", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:46:28.355Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a39adc1f784c4d30135e"
                },
                "content": {
                    "title": "4. Schlussfolgerung Aufgabe 4",
                    "isIndex": false,
                    "currentRevision": {
                        "id": "0",
                        "content": "Ich kenne mittlerweile die Caesar-Chiffre und die Vingere-Chiffre. Man braucht Verschlüsselung um verschiedene Nachrichten zu verschlüsseln. Verschlüsselung ist wichtig, da nicht jeder die Nachrichten leses soll.",
                        "author": "B08",
                        "timestamp": "Thu Dec 17 2015 12:46:28 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Ich kenne mittlerweile die Caesar-Chiffre und die Vingere-Chiffre. Man braucht Verschlüsselung um verschiedene Nachrichten zu verschlüsseln. Verschlüsselung ist wichtig, da nicht jeder die Nachrichten leses soll.",
                        "author": "B08",
                        "timestamp": "Thu Dec 17 2015 12:46:28 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B08"
                }
            }, {
                "id": "5672a50adc1f784c4d30223e",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "ddb7a976-65a5-4bda-be54-3d2dc931d180",
                        "displayName": "concept map",
                        "objectType": "conceptMap"
                    },
                    "generator": {
                        "id": "567064c0755d56ec579f8209",
                        "displayName": "conceptmapper",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "5. Diskussion",
                        "inquiryPhase": "Discussion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c75",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296625716cfd9c4a641d7", "displayName": "B14", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:52:36.656Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a50adc1f784c4d30223e"
                },
                "content": {
                    "concepts": [{
                        "id": "b7bbf53c-aa58-416a-ece9-f79aba79cf06",
                        "content": "symmetrisch",
                        "x": 463,
                        "y": 547.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "4b7b6606-f5ef-4727-edf7-a7ae81cef2da",
                        "content": "Alphabet",
                        "x": 646,
                        "y": 224.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "bd2d7041-3094-41b8-e68e-b6d6476e5f4a",
                        "content": "Schlüsselsuche",
                        "x": 534,
                        "y": 153.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "a1850951-f4c3-4634-83b7-c580b6e90aa2",
                        "content": "polyalphabetisches Verfahren",
                        "x": 135,
                        "y": 267.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "e89a655f-28cd-4488-f956-381cc6f19a89",
                        "content": "Substitution",
                        "x": 661,
                        "y": 310.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "e16e5505-942a-4a9e-9ed3-82d17303e920",
                        "content": "Sicherheit",
                        "x": 674,
                        "y": 413.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "77c37de3-bb8d-41f5-d6be-4cd2740a07d1",
                        "content": "monoalphabetisches Verfahren",
                        "x": 50,
                        "y": 366.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "21f61923-eaca-4517-bc2c-119f2a7e1bcb",
                        "content": "Konzept",
                        "x": 543,
                        "y": 86.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "fec04215-982c-441b-9234-051098340644",
                        "content": "Caesar",
                        "x": 291,
                        "y": 144.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "e0f069b3-d3b5-40f3-ea69-6d5994b6b6bb",
                        "content": "Vigenere",
                        "x": 277,
                        "y": 487.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "Verschlüsselung",
                        "x": 424,
                        "y": 336.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_green"
                    }],
                    "relations": [{
                        "id": "484d0238-9d3d-4344-b78c-f463cb1a8a81",
                        "source": "fec04215-982c-441b-9234-051098340644",
                        "target": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "is a"
                    }, {
                        "id": "616e7476-34d5-48f5-db12-b43421e93dd5",
                        "source": "e16e5505-942a-4a9e-9ed3-82d17303e920",
                        "target": "fec04215-982c-441b-9234-051098340644",
                        "content": "is a"
                    }, {
                        "id": "f3294ca2-798d-4f93-8d99-6688b6e9071e",
                        "source": "e16e5505-942a-4a9e-9ed3-82d17303e920",
                        "target": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "is a"
                    }, {
                        "id": "13a4fc9c-7334-406f-96fd-80ca09a5d42d",
                        "source": "4b7b6606-f5ef-4727-edf7-a7ae81cef2da",
                        "target": "fec04215-982c-441b-9234-051098340644",
                        "content": "is a"
                    }, {
                        "id": "91f4c145-32f2-4e04-c651-55847e06e20b",
                        "source": "4b7b6606-f5ef-4727-edf7-a7ae81cef2da",
                        "target": "e0f069b3-d3b5-40f3-ea69-6d5994b6b6bb",
                        "content": "is a"
                    }, {
                        "id": "7fd5a305-e0a8-4397-e9cc-248ee2d5b508",
                        "source": "b7bbf53c-aa58-416a-ece9-f79aba79cf06",
                        "target": "fec04215-982c-441b-9234-051098340644",
                        "content": "is a"
                    }, {
                        "id": "b6e0b611-fac5-4030-cac8-eda60740bab0",
                        "source": "bd2d7041-3094-41b8-e68e-b6d6476e5f4a",
                        "target": "fec04215-982c-441b-9234-051098340644",
                        "content": "is a"
                    }, {
                        "id": "f0b8bb18-93bf-4728-d08c-844d2814e9e4",
                        "source": "77c37de3-bb8d-41f5-d6be-4cd2740a07d1",
                        "target": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "is a"
                    }, {
                        "id": "da799cb9-257e-406e-ac17-681b1670a364",
                        "source": "a1850951-f4c3-4634-83b7-c580b6e90aa2",
                        "target": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "is a"
                    }, {
                        "id": "95209c88-934b-4319-f33f-586c51a51566",
                        "source": "bd2d7041-3094-41b8-e68e-b6d6476e5f4a",
                        "target": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "is a"
                    }, {
                        "id": "de0d5896-aa29-40ba-d655-cbe3c68fc2d5",
                        "source": "b7bbf53c-aa58-416a-ece9-f79aba79cf06",
                        "target": "2e12881e-9cb6-46af-d764-62972f2403e5",
                        "content": "is a"
                    }, {
                        "id": "e3166bd9-a520-42bb-f3f4-79e8bc49b8e5",
                        "source": "e16e5505-942a-4a9e-9ed3-82d17303e920",
                        "target": "e0f069b3-d3b5-40f3-ea69-6d5994b6b6bb",
                        "content": "is a"
                    }]
                }
            }, {
                "id": "5672a51ddc1f784c4d30242e",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296665716cfd9c4a64305", "displayName": "B02", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:52:55.909Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a51ddc1f784c4d30242e"
                },
                "content": {
                    "title": "Motivationsschreiben",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Lieber Herr Snow. \nIch kann ihnen viel über symmetrische Verschlüsselung erzählen. \nIch kenne 2. Einmal die Caeser-Verschlüsselung. Die dient dazu, wie jede andere Verschlüsselung, dass man die Nachrichten von bestimmten Personen erst entschlüsseln muss bevor man sofort weis, was da steht. Dies funktioniert mit dem Alphabet das man um x-Stellen bewegen soll. dazu gibt es ein Rad, wo man nur die Stellen als Zahl hineinschreiben kann und somit wird das versucht zu entziffern.\nDann gibt es die Viegenere- Verschlüsselung, wo man mithilfe eines Alphabet-Quadrates die Verschlüsselte Nachricht lesen kann. Man nimmt dazu ein Wort und ein Schlüsselwort und versucht so den ersten Buchstaben von den 2 Wörtern in der Tabelle zu finden.\nEs ist wichtig Daten zu verschlüsseln, damit keine dritte Person das mitbekommt was er nicht wissen sollte.\n\nDiese sogenannten Verschlüsselungen könnte man verbessern, weil wenn man so ein Rad oder so ein Quadrat nicht zu Hause hat dann ist es unmöglich. Also es ist nur möglich sobald man alle Materialien hat oder halt zugängliches Internet, aber sonst hätte ich keine Verbesserungen. Flm shum :D\n\n",
                        "author": "B02",
                        "timestamp": "Thu Dec 17 2015 12:52:55 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Lieber Herr Snow. \nIch kann ihnen viel über symmetrische Verschlüsselung erzählen. \nIch kenne 2. Einmal die Caeser-Verschlüsselung. Die dient dazu, wie jede andere Verschlüsselung, dass man die Nachrichten von bestimmten Personen erst entschlüsseln muss bevor man sofort weis, was da steht. Dies funktioniert mit dem Alphabet das man um x-Stellen bewegen soll. dazu gibt es ein Rad, wo man nur die Stellen als Zahl hineinschreiben kann und somit wird das versucht zu entziffern.\nDann gibt es die Viegenere- Verschlüsselung, wo man mithilfe eines Alphabet-Quadrates die Verschlüsselte Nachricht lesen kann. Man nimmt dazu ein Wort und ein Schlüsselwort und versucht so den ersten Buchstaben von den 2 Wörtern in der Tabelle zu finden.\nEs ist wichtig Daten zu verschlüsseln, damit keine dritte Person das mitbekommt was er nicht wissen sollte.\n\nDiese sogenannten Verschlüsselungen könnte man verbessern, weil wenn man so ein Rad oder so ein Quadrat nicht zu Hause hat dann ist es unmöglich. Also es ist nur möglich sobald man alle Materialien hat oder halt zugängliches Internet, aber sonst hätte ich keine Verbesserungen. Flm shum :D\n\n",
                        "author": "B02",
                        "timestamp": "Thu Dec 17 2015 12:52:55 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B02"
                }
            }, {
                "id": "5672a52fdc1f784c4d302488",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "56729cff5716cfd9c4a67c3a", "displayName": "B07", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:53:13.514Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a52fdc1f784c4d302488"
                },
                "content": {
                    "title": "Motivation Pur",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Schon vor 2000 Jahren hatten die alten Römer unter Julius Cäsar mit der Verschlüsselung von Nachrichten dasselbe Ziel. Sie versuchten, Informationen zu verbergen. Bis heute hat sich aber die Dechiffriertechnik beachtlich weiterentwickelt. Um daher heute unsere Informationen und Daten vor dem Zugriff durch die falschen Leute zu schützen, halte ich es für sehr wichtig, die Entwicklung neuer Chiffriertechniken im Sinne der Gesellschaft voranzutreiben.\nIch möchte daher meine Dienste für ihr Team anbieten. Ich beherrsche die Grundformen der Chiffriertechnik wie die Cäsar- und die Vigeneretechnik. Da sie durch Buchstabenverschiebeung funktionieren, halte ich sie für angreifbar, da moderne Computer alle Möglichkeiten durchprobieren können.\nIch glaube man kann symmetrische Verschlüsselungstechniken durch neue raffiniertere Verschiebungen verbessern. Aus diesem Grund würde ich sehr gerne in ihrem Team arbeiten.",
                        "author": "B07",
                        "timestamp": "Thu Dec 17 2015 12:53:13 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Schon vor 2000 Jahren hatten die alten Römer unter Julius Cäsar mit der Verschlüsselung von Nachrichten dasselbe Ziel. Sie versuchten, Informationen zu verbergen. Bis heute hat sich aber die Dechiffriertechnik beachtlich weiterentwickelt. Um daher heute unsere Informationen und Daten vor dem Zugriff durch die falschen Leute zu schützen, halte ich es für sehr wichtig, die Entwicklung neuer Chiffriertechniken im Sinne der Gesellschaft voranzutreiben.\nIch möchte daher meine Dienste für ihr Team anbieten. Ich beherrsche die Grundformen der Chiffriertechnik wie die Cäsar- und die Vigeneretechnik. Da sie durch Buchstabenverschiebeung funktionieren, halte ich sie für angreifbar, da moderne Computer alle Möglichkeiten durchprobieren können.\nIch glaube man kann symmetrische Verschlüsselungstechniken durch neue raffiniertere Verschiebungen verbessern. Aus diesem Grund würde ich sehr gerne in ihrem Team arbeiten.",
                        "author": "B07",
                        "timestamp": "Thu Dec 17 2015 12:53:13 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B07"
                }
            }, {
                "id": "5672a53ddc1f784c4d3026ef",
                "metadata": {
                    "id": "5672a53ddc1f784c4d3026ef",
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296e75716cfd9c4a64dac", "displayName": "B09", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:57:18.641Z",
                    "storageId": "567062f3755d56ec579f7c7f"
                },
                "content": {
                    "title": "Motivationsschreiben",
                    "isIndex": true,
                    "currentRevision": {
                        "author": "B09",
                        "content": "Da ich nun über die Caesar Verschlüsselung und die Vigenere Verschlüsselung informiert wurde,weiß ich nun wie\nsie funktionieren.",
                        "timestamp": "Thu Dec 17 2015 12:57:18 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    },
                    "revisions": [{
                        "author": "B09",
                        "content": "Da ich nun über die Caesar Verschlüsselung und die Vigenere Verschlüsselung informiert wurde,weiß ich nun wie\nsie funktionieren.",
                        "timestamp": "Thu Dec 17 2015 12:57:18 GMT+0100 (Mitteleuropäische Zeit)",
                        "id": "1"
                    }, {"id": "0", "content": "", "author": "B09", "timestamp": "2015-12-17T11:53:27.000Z"}],
                    "author": "B09",
                    "id": "5672a53ddc1f784c4d3026ef"
                }
            }, {
                "id": "5672a557dc1f784c4d30275a",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "5672965d5716cfd9c4a64185", "displayName": "B01", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:53:53.468Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a557dc1f784c4d30275a"
                },
                "content": {
                    "title": "MOTIVATIONSSCHREIBEN",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "ich würde gut ins team passen weil ich nun über zwei chiffre arten bescheid weiss. sowohl wie sie funktionieren als auch wie man selbst einen code schreiben und auch fremde codes entschlüsseln kann. \ndas erste verschlüsselungsverfahren ist das caesar verfahren. hierbei werden die buchstaben im alphabet verschoben. \ndann gibt es die vigenere verschlüsselungsart da wird ein quadrat zur verschlüsselung verwendet. \nes ist wichtig daten zu verschlüsseln vorallem wenn es um persönliche daten geht wie die adresse. damit nicht alle zugang an diese daten haben. oder wenn es um ein geheimes thema geht dann kann man eine nachricht auch verschlüsseln. ",
                        "author": "B01",
                        "timestamp": "Thu Dec 17 2015 12:53:53 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "ich würde gut ins team passen weil ich nun über zwei chiffre arten bescheid weiss. sowohl wie sie funktionieren als auch wie man selbst einen code schreiben und auch fremde codes entschlüsseln kann. \ndas erste verschlüsselungsverfahren ist das caesar verfahren. hierbei werden die buchstaben im alphabet verschoben. \ndann gibt es die vigenere verschlüsselungsart da wird ein quadrat zur verschlüsselung verwendet. \nes ist wichtig daten zu verschlüsseln vorallem wenn es um persönliche daten geht wie die adresse. damit nicht alle zugang an diese daten haben. oder wenn es um ein geheimes thema geht dann kann man eine nachricht auch verschlüsseln. ",
                        "author": "B01",
                        "timestamp": "Thu Dec 17 2015 12:53:53 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B01"
                }
            }, {
                "id": "5672a57edc1f784c4d3029d7",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296485716cfd9c4a63f5d", "displayName": "B05", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:54:33.041Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a57edc1f784c4d3029d7"
                },
                "content": {
                    "title": "Motivation",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "Das Caesar Verfahren funktioniert durch Vertauschung der Buchstaben. Die Buchstaben werden anderen Buchstaben zugeordnet und anschließend erhält man das Lösungswort. Nach welchem Prinzip die Buchstaben ausgewählt wurden ist unbekannt. \n\nDas vigenere Verfahren funktioniert durch ein Quadrat in dem die Buchstaben ablesbar sind durch das Alphabet.\nEin ausgewähltes Wort wird dem Code angepasst und kann somit Verschlüsselt und wieder gelöst werden.\nSchwachstellen gibt es meiner Meinung nach nicht direkt, denn auch wenn die Idee hinter der Verschlüsselung einfach erscheint wäre es uns zunächst nicht möglich gewesen ohne Hinweise das Lösungswort zu erhalten.\n\nIch würde inzwischen gut in das Team passen weil ich über beiden Chiffre Varianten informiert bin. Ich habe es schnell gelernt und es war Interessant gestaltet.",
                        "author": "B05",
                        "timestamp": "Thu Dec 17 2015 12:54:33 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "Das Caesar Verfahren funktioniert durch Vertauschung der Buchstaben. Die Buchstaben werden anderen Buchstaben zugeordnet und anschließend erhält man das Lösungswort. Nach welchem Prinzip die Buchstaben ausgewählt wurden ist unbekannt. \n\nDas vigenere Verfahren funktioniert durch ein Quadrat in dem die Buchstaben ablesbar sind durch das Alphabet.\nEin ausgewähltes Wort wird dem Code angepasst und kann somit Verschlüsselt und wieder gelöst werden.\nSchwachstellen gibt es meiner Meinung nach nicht direkt, denn auch wenn die Idee hinter der Verschlüsselung einfach erscheint wäre es uns zunächst nicht möglich gewesen ohne Hinweise das Lösungswort zu erhalten.\n\nIch würde inzwischen gut in das Team passen weil ich über beiden Chiffre Varianten informiert bin. Ich habe es schnell gelernt und es war Interessant gestaltet.",
                        "author": "B05",
                        "timestamp": "Thu Dec 17 2015 12:54:33 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B05"
                }
            }, {
                "id": "5672a5cadc1f784c4d302b36",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "640744c5-8740-493f-c8ba-5dbbc4545d32",
                        "displayName": "concept map1",
                        "objectType": "conceptMap"
                    },
                    "generator": {
                        "id": "567064c0755d56ec579f8209",
                        "displayName": "conceptmapper",
                        "objectType": "application",
                        "url": "http://go-lab.gw.utwente.nl/production/conceptmapper/build/conceptmapper.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "5. Diskussion",
                        "inquiryPhase": "Discussion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c75",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296525716cfd9c4a63f85", "displayName": "Waldemar", "objectType": "teacher"},
                    "published": "2015-12-17T11:55:48.471Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a5cadc1f784c4d302b36"
                },
                "content": {
                    "concepts": [{
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "schwerer",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "symmetrisches_kryptosystem",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "internet",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "monoalphabetisches verfahren",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "schlüssel",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "polyalphabetische_substitution",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "polyalphabetisches verfahren",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "alphabet",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "verschlüsselung",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "empfangsgerät",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": "vigenere",
                        "x": 150,
                        "y": 247.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "38a2ce49-edde-4a22-bae9-1755ed71af23",
                        "content": "symmetrisch",
                        "x": 25,
                        "y": 105.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "8ca2cf49-9954-431a-d36a-07e6efd9ca5c",
                        "content": "Vigenere",
                        "x": 252,
                        "y": 372.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "c0c13478-96c1-49d3-b514-ed98db035bb0",
                        "content": "einfach",
                        "x": 19,
                        "y": 241.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "1d00e724-0523-4d19-e309-141562ceba26",
                        "content": "Caesar",
                        "x": 34,
                        "y": 409.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "717dfde4-b810-4a8d-e0d2-9335652db5bb",
                        "content": "Verschlüsselung",
                        "x": 13,
                        "y": 129.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "055c0eeb-c921-4a70-a816-794c2d173fde",
                        "content": "Sender",
                        "x": 527,
                        "y": 214.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "f3443327-da70-4210-b72e-4f0be96ca94b",
                        "content": "Verschlüsselter Text",
                        "x": 565,
                        "y": 323.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "8d0724bd-8ca6-4722-daf6-30839c9f5be8",
                        "content": "Feind",
                        "x": 766,
                        "y": 131.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "4a7643f8-aa18-4e28-98db-862cb438989f",
                        "content": "Empfänger",
                        "x": 510,
                        "y": 450.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "a872d108-d765-4b35-8709-ab2069e47a05",
                        "content": "Gleiches Verfahren",
                        "x": 290,
                        "y": 173.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "08d8718e-28c5-40f8-f99e-3bbe43f20a36",
                        "content": "bessere Verschlüsselung",
                        "x": 42,
                        "y": 564.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "befadd33-0da5-4372-faf9-ff4b8fe10cf6",
                        "content": "nicht nur Alphabet auch zahlen",
                        "x": 245,
                        "y": 629.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "0f7ed79d-b548-43aa-ebbe-63bbc9d8a41d",
                        "content": "sich durchgehen ändern",
                        "x": 275,
                        "y": 569.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "96c1582a-18e9-4889-c74e-786b91c0796d",
                        "content": "viel verschiedene Verschlüsselungen anwenden",
                        "x": 294,
                        "y": 517.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }, {
                        "id": "02fa3f8a-ad8c-41d5-afe1-d854adb37e27",
                        "content": "bessere Sicherheit",
                        "x": 598,
                        "y": 595.75,
                        "type": "ut_tools_conceptmapper_conceptSelector",
                        "colorClass": "ut_tools_conceptmapper_blue"
                    }],
                    "relations": [{
                        "id": "66acaec2-a4f2-4125-b1ec-d316f8ac2523",
                        "source": "055c0eeb-c921-4a70-a816-794c2d173fde",
                        "target": "f3443327-da70-4210-b72e-4f0be96ca94b",
                        "content": "verschikt"
                    }, {
                        "id": "a26d9159-1441-466e-974c-2eb7afaf62fa",
                        "source": "8d0724bd-8ca6-4722-daf6-30839c9f5be8",
                        "target": "f3443327-da70-4210-b72e-4f0be96ca94b",
                        "content": "will entschlüsseln"
                    }, {
                        "id": "5054f530-180f-4b2a-e00f-0db2fd4445d4",
                        "source": "4a7643f8-aa18-4e28-98db-862cb438989f",
                        "target": "f3443327-da70-4210-b72e-4f0be96ca94b",
                        "content": "entschlüsselt"
                    }, {
                        "id": "37f172b4-06bc-4754-df17-9c316cabdee6",
                        "source": "a872d108-d765-4b35-8709-ab2069e47a05",
                        "target": "055c0eeb-c921-4a70-a816-794c2d173fde",
                        "content": "hat"
                    }, {
                        "id": "b79073fe-7c55-46a1-b93a-f6febf05c39c",
                        "source": "a872d108-d765-4b35-8709-ab2069e47a05",
                        "target": "4a7643f8-aa18-4e28-98db-862cb438989f",
                        "content": "hat"
                    }, {
                        "id": "91caeb06-d3a4-419e-e48c-ec0ed225b96c",
                        "source": "c0c13478-96c1-49d3-b514-ed98db035bb0",
                        "target": "1d00e724-0523-4d19-e309-141562ceba26",
                        "content": "wenig möglichkeiten"
                    }, {
                        "id": "273c0e7e-cfa3-4878-cf74-60b3d55d487e",
                        "source": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "target": "8ca2cf49-9954-431a-d36a-07e6efd9ca5c",
                        "content": "mehr möglichkeiten"
                    }, {
                        "id": "788e043b-cddd-43eb-a008-7235d0c5b505",
                        "source": "a872d108-d765-4b35-8709-ab2069e47a05",
                        "target": "8d0724bd-8ca6-4722-daf6-30839c9f5be8",
                        "content": "versucht es zu bekommen"
                    }, {
                        "id": "c95e3174-c9eb-4bc2-9bea-66545b718001",
                        "source": "08d8718e-28c5-40f8-f99e-3bbe43f20a36",
                        "target": "96c1582a-18e9-4889-c74e-786b91c0796d",
                        "content": "z.b."
                    }, {
                        "id": "7f3d6486-04bf-48fb-bf07-64cb8b3bce2b",
                        "source": "08d8718e-28c5-40f8-f99e-3bbe43f20a36",
                        "target": "0f7ed79d-b548-43aa-ebbe-63bbc9d8a41d",
                        "content": "z.b."
                    }, {
                        "id": "3f61a57e-603b-4661-95c8-70a687f2ea20",
                        "source": "08d8718e-28c5-40f8-f99e-3bbe43f20a36",
                        "target": "befadd33-0da5-4372-faf9-ff4b8fe10cf6",
                        "content": "z.b."
                    }, {
                        "id": "1532dc9f-3223-4c64-84be-a87eba648286",
                        "source": "96c1582a-18e9-4889-c74e-786b91c0796d",
                        "target": "02fa3f8a-ad8c-41d5-afe1-d854adb37e27",
                        "content": "bringt"
                    }, {
                        "id": "8fd4f0ec-666a-4a30-8657-73f38a501d58",
                        "source": "0f7ed79d-b548-43aa-ebbe-63bbc9d8a41d",
                        "target": "02fa3f8a-ad8c-41d5-afe1-d854adb37e27",
                        "content": "bringt"
                    }, {
                        "id": "bfceca3b-51bb-4389-9f0a-8699df101214",
                        "source": "befadd33-0da5-4372-faf9-ff4b8fe10cf6",
                        "target": "02fa3f8a-ad8c-41d5-afe1-d854adb37e27",
                        "content": "bringt"
                    }, {
                        "id": "a024e457-a735-426d-937a-7b0ff7c75441",
                        "source": "38a2ce49-edde-4a22-bae9-1755ed71af23",
                        "target": "717dfde4-b810-4a8d-e0d2-9335652db5bb",
                        "content": ""
                    }, {
                        "id": "a58b860a-2433-4cca-c285-6b7cb7f4fcbe",
                        "source": "717dfde4-b810-4a8d-e0d2-9335652db5bb",
                        "target": "c0c13478-96c1-49d3-b514-ed98db035bb0",
                        "content": ""
                    }, {
                        "id": "4f7f6f28-a270-4ba6-c60c-5a6eff318328",
                        "source": "717dfde4-b810-4a8d-e0d2-9335652db5bb",
                        "target": "65c89f2c-ffa5-43d8-caee-c5b9caedec09",
                        "content": ""
                    }]
                }
            }, {
                "id": "5672a62bdc1f784c4d302eea",
                "metadata": {
                    "storageType": "folder",
                    "target": {
                        "id": "567062f2755d56ec579f7c55",
                        "displayName": "collide wiki in Kyrptographie_run3",
                        "objectType": "collide wiki"
                    },
                    "generator": {
                        "id": "5670649a755d56ec579f80a1",
                        "displayName": "collide wiki",
                        "objectType": "application",
                        "url": "http://golab.collide.info/client/tools/wiki/wiki.xml"
                    },
                    "provider": {
                        "id": "567062f2755d56ec579f7c55",
                        "inquiryPhaseName": "4. Schlussfolgerung",
                        "inquiryPhase": "Conclusion",
                        "inquiryPhaseId": "567062f3755d56ec579f7c70",
                        "displayName": "Kyrptographie_run3",
                        "objectType": "ils",
                        "url": "http://graasp.eu/spaces/567062f2755d56ec579f7c55"
                    },
                    "actor": {"id": "567296675716cfd9c4a64360", "displayName": "B17", "objectType": "graasp_student"},
                    "published": "2015-12-17T11:57:25.393Z",
                    "storageId": "567062f3755d56ec579f7c7f",
                    "id": "5672a62bdc1f784c4d302eea"
                },
                "content": {
                    "title": "axa",
                    "isIndex": true,
                    "currentRevision": {
                        "id": "0",
                        "content": "das verfahren mit dem quadrat kann mann ohne quadrat oder schlüssel nicht lösen das zu lösen ist besonders schwierig da die variablen viel größer sind .\ndadurch ist es viel sicherer.\nim gegensatz zu caesar ist das system komplexer und nicht mit jedermann lösbar. obwohl mann es auch mit dem häufigkeits verfahren lösen kann. \n\n\nlieber herr snow ich würde gerene ihrem team beitreten weil ich mehr zum Thema deschrifieren \nbzw kryptographie ich habe bereits etwas über die verschlüsselungs technik von cäsar gelernt die etwas einfacher ist da sie nur zwei alphabets zeilen verschiebtt und so der buchstabe für a a+-x buchstaben ist. \naußerdem haben wir etwas über die technik gelernt die von einem Franzosen erfunden \n\n",
                        "author": "B17",
                        "timestamp": "Thu Dec 17 2015 12:57:25 GMT+0100 (Mitteleuropäische Zeit)"
                    },
                    "revisions": [{
                        "id": "0",
                        "content": "das verfahren mit dem quadrat kann mann ohne quadrat oder schlüssel nicht lösen das zu lösen ist besonders schwierig da die variablen viel größer sind .\ndadurch ist es viel sicherer.\nim gegensatz zu caesar ist das system komplexer und nicht mit jedermann lösbar. obwohl mann es auch mit dem häufigkeits verfahren lösen kann. \n\n\nlieber herr snow ich würde gerene ihrem team beitreten weil ich mehr zum Thema deschrifieren \nbzw kryptographie ich habe bereits etwas über die verschlüsselungs technik von cäsar gelernt die etwas einfacher ist da sie nur zwei alphabets zeilen verschiebtt und so der buchstabe für a a+-x buchstaben ist. \naußerdem haben wir etwas über die technik gelernt die von einem Franzosen erfunden \n\n",
                        "author": "B17",
                        "timestamp": "Thu Dec 17 2015 12:57:25 GMT+0100 (Mitteleuropäische Zeit)"
                    }],
                    "author": "B17"
                }
            }];

        }

        function retrieveArtifacts(callback) {

            storageHandler.listResourceIds(function(error, ids) {

                var artifactList = [];

                if(error){
                    console.log("Error reading ressource ids with storageHandler");
                } else {

                    for (var i=0; i < ids.length; i++) {

                        var resourceId = ids[i];

                        storageHandler.readResource(resourceId, function (error, object) {

                            if (error) {
                                console.log("Error reading resource");
                            } else {
                                console.log(object);
                                artifactList.push(object);

                                var gotAllPosts = artifactList.length === ids.length;
                                if (gotAllPosts) {
                                    callback(artifactList);
                                }
                            }
                        });
                    }
                }

                return artifactList;

            });
        }


        function storeSynonyms(callback) {

            var metadataHandler = storageHandler.getMetadataHandler();

            var target = metadataHandler.getTarget();
            target.objectType = 'synonym map';
            target.displayName = 'only synonym map';

            metadataHandler.setTarget(target);

            var newStorageHandler = new golab.ils.storage.LocalStorageHandler(metadataHandler);

            var content = starterApp.content;

            newStorageHandler.readLatestResource('synonym map',function(error, resource) {

                if(error != undefined || !resource) {

                    newStorageHandler.createResource(content, function(error,resource) {

                        if(error != undefined){
                            console.log('Could not store synonym resource');
                        } else {
                            console.log('synonym resource stored!');
                            console.log(JSON.stringify(resource));
                        }
                    });


                } else {

                    newStorageHandler.updateResource(resource.metadata.id,content,function(error, resource) {

                        if(error != undefined){
                            console.log('updating snyonym resource failed');
                        } else{
                            console.log('updated synonym resource!');
                            console.log(JSON.stringify(resource));
                        }

                    });

                }

            });
        }

        function retrieveSynonymData(callback) {

            var metadataHandler = storageHandler.getMetadataHandler();

            var target = metadataHandler.getTarget();
            target.objectType = 'synonym map';
            target.displayName = 'only synonym map';

            metadataHandler.setTarget(target);

            var newStorageHandler = new golab.ils.storage.LocalStorageHandler(metadataHandler);

            newStorageHandler.readLatestResource('synonym map',function(error, resource) {

                callback(error,resource);


            })

        }

        function assembleGroupFormationDataPackage() {

            var dataPackage = {};

            dataPackage.artifactSources = groupFormation.getSelectedArtifactSources();
            dataPackage.students = groupFormation.getActorsForGF();
            dataPackage.artifactList = groupFormation.assembleCleanedArtifactList();
            dataPackage.artifactSourcesConfig = starterApp.configHandler.getEntry("artifactSources");
            dataPackage.numberOfGroups = groupFormation.numOfGroupSelectedValue;
            dataPackage.synonymData = getSynonymData();
            dataPackage.refSolutionOptionSelected = groupFormation.isRefSolutionOptionSelected();

            return dataPackage;

            function getSynonymData() {
                var synonyms = [];

                $('.synonymTable').each(function () {

                    var synonymObj = {};
                    synonymObj.genericTerm = $(this).find('.synonymGenTermHeader').text().trim();
                    synonymObj.synonyms = [];

                    $(this).find('.termRow').each(function () {

                        synonymObj.synonyms.push($(this).text().trim());

                    });

                    if(synonymObj.synonyms.length > 0)
                        synonyms.push(synonymObj);

                });

                return synonyms;
            }
        }

        function assembleConceptAggregationDataPackage() {

            var dataPackage = {};

            dataPackage.artifactSources = groupFormation.getSelectedArtifactSources();
            dataPackage.artifactList = groupFormation.assembleCleanedArtifactList();
            dataPackage.artifactSourcesConfig = starterApp.configHandler.getEntry("artifactSources");

            return dataPackage;
        }

        function setGroupFormation(groupFormationParam) {
            groupFormation = groupFormationParam;
        }

        function sendGroupFormationRequest(dataPackage, callbackErr, callBackSuccess) {

            $.ajax({
                url: serviceUrls.applyGroupFormation,
                type: "POST",
                encoding: "UTF-8",
                data: JSON.stringify(dataPackage),
                contentType : 'application/json',
                success: callBackSuccess,
                error: callbackErr
            });

        }

        function sendConceptAggregationRequest(dataPackage, callbackErr, callBackSuccess) {

            $.ajax({
                url: serviceUrls.conceptAggregation,
                type: "POST",
                encoding: "UTF-8",
                data: JSON.stringify(dataPackage),
                contentType: 'application/json',
                success: callBackSuccess,
                error: callbackErr
            });

        }
    }


})(golab.tools.starterApp);






