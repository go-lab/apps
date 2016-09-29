# Reflection poll

This is an app for creating and presenting polls. It can be used as a standalone
version (using `index.html`) or as an OpenSocial Gadget (using `gadget.xml`). It
is as part of the [Go-Lab Project](http://www.go-lab-project.eu/) and implements
logging, storage and configuration for usage inside of an ILS.

## Tooling

App files have to be compiled. [Gulp](http://gulpjs.com/) is used as the build
tool, and is dependent on [NPM](http://npmjs.org/). Install third party
dependencies with `npm install`, then run `gulp`. To continually watch source
files and compile on the fly, run `gulp watch`.


## Architecture

Build tasks are found in `gulpfile.js` and `build/tasks.js`.

`index.html` or `gadget.xml` are the entry point to the application. The latter
is compiled from the template in `build/gadget_template.xml` and from
`index.html`.

JavaScript and CSS sources are found in `app/`, are compiled into `build/app/`.

`app/run.js` bootstraps the application found in `app/app.js`, passing in some
general utility components as well as Go-Lab components.

The main application function initializes all the apps components such as the
toolbar, configuration view and poll view and loads poll and answer data. Then,
`start` is called, where the data is rendered out to the user, and events are
handled. For this tasks, `app/poll_view.js` and `app/config_view.js` are used
for rendering the poll and the poll configuration and handling user input.


## Data format

Data is persisted using the
[StorageHandler](https://github.com/go-lab/ils/wiki/StorageHandler).

### Poll configuration

The poll configuration determines the questions and predefined answers of the
poll. Here is some example data with every question type:

    {
      "appVersion": 1,
      "id": "aedf0ba9-a049-43d7-9124-27b4b53ca04b",
      "contentHash": "0uu6mycLr0FJDl4s4F8Ls0AIsuhyRy6ranR9Ft2AyhY=",
      "heading": "Rate your satisfaction",
      "items": [
        {
          "id": "3edf3abf-0291-4069-a22c-f2a2b2be7a51",
          "type": "multiple-choice",
          "question": "What?",
          "answers": [
            {
              "id": "abd095e6-5710-407f-b325-3cc3398bcfd9",
              "text": "Answer 1"
            },
            {
              "id": "8cac7789-8346-466f-b2cd-1e21de82279d",
              "text": "Answer 2"
            }
          ]
        },
        {
          "id": "ee0fa3fc-72ab-49dd-a8a6-97f9d8751154",
          "type": "smiley",
          "question": "How happy are you?"
        },
        {
          "id": "79fbd84a-6811-4acc-b7aa-2a2604e26d8b",
          "type": "single-choice",
          "question": "How many?",
          "answers": [
            {
              "id": "6ab29377-31c0-4c29-92d5-a36ce2331720",
              "text": "Five"
            },
            {
              "id": "8d70ca91-d608-4f7f-834e-b05e08d04940",
              "text": "Two"
            },
            {
              "id": "6f3196ea-fd8d-410a-bfbb-7c469e823da4",
              "text": "Thirteen"
            }
          ]
        },
        {
          "id": "5928ed5f-fe87-4e07-b62d-2c8d1041c90e",
          "type": "open",
          "question": "Tell me how you feel"
        }
      ]
    }

The `appVersion` is used to guard for incompatible data when a poll
configuration is imported. In case backwards incompatible changes to the poll
format are made, the indicator should be increased. When the user imports a
configuration where the app version is lower than the version the app currently
uses, a warning is issued to the user.

The `contentHash` is a hash of the poll contents, ignoring any ids. Two polls
that have the same content hash contain the same questions and answers.


### Poll answers

Example answer data based for the poll configuration above:

    {
      "id": "016ad8b5-d105-401a-c6e7-58a90ce3c3e2",
      "pollContentHash": "0uu6mycLr0FJDl4s4F8Ls0AIsuhyRy6ranR9Ft2AyhY=",
      "pollId": "aedf0ba9-a049-43d7-9124-27b4b53ca04b",
      "3edf3abf-0291-4069-a22c-f2a2b2be7a51": [
        "8cac7789-8346-466f-b2cd-1e21de82279d",
        "abd095e6-5710-407f-b325-3cc3398bcfd9"
      ],
      "ee0fa3fc-72ab-49dd-a8a6-97f9d8751154": "angry",
      "79fbd84a-6811-4acc-b7aa-2a2604e26d8b": "6f3196ea-fd8d-410a-bfbb-7c469e823da4",
      "5928ed5f-fe87-4e07-b62d-2c8d1041c90e": "Hi!"
    }

As you can see, the answer format is a map of `answer id => answer`, where the
shape of the answer is dependent on the question type.

- For single choice questions this is the answer id.
- For multiple choice question, this is an array of answer ids.
- For Smiley questions, this is the smiley value, which is one of `angry`,
  `disappointed`, `neutral`, `satisfied` and `happy`.
- A string for open questions.

If there is no entry for a specific question, the question was not answered and
the default answer is to be assumed.

`pollContentHash` and `pollId` refers to the poll configuration the answers
correspond to.


## Logs

The following data is logged using the
[ActionLogger](https://github.com/go-lab/ils/wiki/ActionLogger). Only the parts
that vary across logs are given. Note the two varying target types,
`reflection poll config` and `reflection poll answers`.

### Application start

    {
        verb: 'access',
        object: {
            objectType: 'application',
            id: 'reflection poll@ils',
        },
        target: {
            objectType: 'reflection poll answers',
        }
    }


### Poll is saved

The `content` value matches the storage format of a poll configuration.

    {
      "verb": "change",
      "object": {
        "objectType": "poll",
        "id": "aedf0ba9-a049-43d7-9124-27b4b53ca04b",
        "content": ... // see poll config format above
      },
      "target": {
        "objectType": "reflection poll config",
        "id": "4fad2f6a-3f03-446f-fdcf-0bbb2d010c3f",
        "displayName": "unnamed reflection poll config"
      },
    }


### An answer is given

    {
      "published": "2015-08-27T15:45:45.713Z",
      "actor": {
        "objectType": "person",
        "id": "dan@http://localhost:8899/",
        "displayName": "dan"
      },
      "verb": "change",
      "object": {
        "objectType": "answers",
        "id": "016ad8b5-d105-401a-c6e7-58a90ce3c3e2",
        "content": ... // see answers format above,
        "pollId": "aedf0ba9-a049-43d7-9124-27b4b53ca04b",
        "pollContentHash": "0uu6mycLr0FJDl4s4F8Ls0AIsuhyRy6ranR9Ft2AyhY="
      },
      "target": {
        "objectType": "reflection poll answers",
        "id": "da8f4c7a-8a2b-4e5d-ee48-189e341d8df9",
        "displayName": "unnamed reflection poll answers"
      },
    }
