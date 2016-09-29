golab = golab || {};
golab.tools = golab.tools || {};
golab.tools.configuration = golab.tools.configuration || {};

golab.tools.configuration.starterApp = {

    artifactSources: {
        value: [
            {
                appName: 'Conceptmapper',
                displayName: 'conceptmapper',
                extractors: ['Concept Map Extractor'],
                preferred : 0
            },
            {
                appName: 'Hypothesis Scratchpad',
                displayName: 'hypothesis scratchpad',
                extractors: ['Hypothesis Scratchpad Extractor'],
                preferred : 0
            },
            {
                appName: 'Wiki App',
                displayName: 'collide wiki',
                extractors: ['AlchemyAPI Extractor', 'DBpedia Spotlight Extractor'],
                preferred: 1
            }
        ]
    }


};





