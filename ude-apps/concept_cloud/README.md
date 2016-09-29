gulp# Go-Lab App Starter App

This is a example app serving as a starting point to build apps for Go-Lab, as
well as a reference for interaction with GoLab components. It demonstrates GoLab
functionality such as

- persisting resources,
- storing action logs,
- receiving notifications,
- handling different app environments (contexts),
- introspecting the ils phases,
- translating messages (configurable with the
  [AppComposer](http://composer.golabz.eu),
- and configuring the application (either in the app itself or using the
  AppComposer).

Additionally, some components relevant to most (golab) applications are set up:

- A toolbar,
- a user facing error display and
- a loading indicator.

The app can be run directly in the browser as a standalone application, or as an
OpenSocial gadget.

These features are demonstrated by way of a sample application where you can
create and edit posts, which are simple pieces of data with a title and content.

## Getting started

- Install the build tools.
    - Install [Node.js](http://nodejs.org).
    - Run `npm install --global gulp` on a command line to install the task
      runner.
    - Run `npm install` with the current directory of the command line set to the
      app directory (where this README is located).
- Copy this app into `/client/tools` or `/client/labs`, depending on the
  intended use, and rename the folder to the name of your tool.
- Start the learning analytics server, which can be found at
  `[GoLab repository root]/server/la-server/`. This app requires the file server
  as well as the notifications and logging service to be running. In turn, these
  server components require a running instance of the
  [SQLSpaces](http://projects.collide.info/projects/sqlspaces) database. Refer
  to server documentation to learn about running the server (Running `npm
  install` and then `node server.js` in the server directory should do it).
- Open
  [http://localhost:3090/client/tools/starter_app/index.html?storageServer=local&notificationServer=http://localhost:3090/&loggingTarget=http://localhost:3090/activity/](http://localhost:3090/client/tools/starter_app/index.html?storageServer=local&notificationServer=http://localhost:3090/&loggingTarget=http://localhost:3090/activity/)
  in the browser, which loads the app with components configured for the local
  environment. You may have to alter the url for non-default server
  configurations.


## Running as an OpenSocial gadget

OpenSocial gadgets are contained in xml files containing metadata as well as the
application document. Since our app document is contained in another file
(`index.html`), we have to compile the gadget file first. This is done by
running `gulp compile-gadget` on the command line, which produces the
`gadget.xml` file. To change the structure and metadata of the resulting file,
edit `gadget_template.xml`.

You can add the gadget to OpenSocial-based applications by referencing the
generated `gadget.xml`. For OpenSocial applications not running locally, you
have to make the gadget accessible on the web first, for example by putting it
up on a web server.

To automatically compile the gadget file whenever `index.html` changes, run
`gulp watch`.


## Program structure

The main application document is contained in `index.html`. Here, the initial
page structure and resources and scripts to be loaded are defined. Together with
the application resources, the libraries [JQuery](http://jquery.com) for easier
DOM manipulation and [Bootstrap](http://getbootstrap.js) for some default
styling and components are included. Third party libraries are managed with
[Bower](http://bower.io), and are located under `bower_components/`.

In `app/run.js` the app is bootstrapped, which includes following steps:

- Instantiating loading indicator and error display components,
- instantiating and configuring the environment handlers,
- calling the main app function and
- catching errors that may occur at each step. Note that this does not handle
  errors in your application that happen asynchronously, e.g. errors in code
  that executes as a response to user interaction. You have to handle possible
  errors in these code paths yourself.

The main application function is contained in `app/app.js`. It is called when
the app is loaded, and receives GoLab specific components called environment
handlers, as well as components for showing error messages and showing a
loading indicator to the user.

All the scripts wrap their contents in a function that is called right away
([IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)).
This is to avoid polluting the global environment, ie. variables and functions
defined inside this top level function are not reachable outside of this
function, as long as they are not added to a global variable. The function
receives the namespace (a simple object) that components should be added to to
be used by other components. The namespace for this app is
`golab.tools.conceptCloud`.

Build tasks are contained in `gulpfile.js`, and are used via
[Gulp](http://gulpjs.com).

`PostStorage` is the component that interacts with the `storageHandler`
compoment to persist resources, and can be found in `app/post_storage.js`.

Translation of messages is handled by the `languageHandler`. The language is
set to a default language in `run.js`, but is overridden with user choice in an
OpenSocial environment. The messages are defined in xml files, located under
`languages/`.

This app provides two methods of configuration. The basis is configuration
through simple JavaScript-Objects. A configuration definition
(`app/configuration_definition.js`) specifies which configuration options there
are, with descriptions and default values. The actual values used in the app
instance need to be set in another file (`app/configuration_default.js`). The
[AppComposer](http://composer.golabz.eu) uses these configuration files and
allows to create a version of the application with custom configuration.

The second method is configuration inside of the app itself, accessible through
the user interface. Configuration using this method overrides any values set by
the configuration file, and is persisted across sessions. The
`configurationHandler` component integrates both configuration methods, and is
used to load, persist, and reset the configuration.

There is special behaviour when the app is deployed in an ILS through
[Graasp](http://graasp.eu). Here, configuration through the ui is only
accessible for the creator of the space, ie. when the app is previewed inside of
Graasp. A configuration adapted this way applies to all instances of the app in
the ILS.


## Developing your application

Adapt the application files to the needs of your application. Use what you need
from the existing structure and code and throw away the rest. Make sure you
read through and understand the components that you do end up using.

Be sure to change the name of your application in the gadget specification
(`gadget_template.xml`), and to modify the name of the application (`TOOL_NAME`)
and document type your app deals with (`DOCUMENT_TYPE`) in `run.js`. These are
used for the metadata that accompanies resources and logs your app produces.

Change all the namespace references (`golab.tools.conceptCloud`) to be specific to
your app (eg. `golab.labs.myLab`), including the definition of the namespace in
`app/namespace.js`.

For repetitive tasks needed to modify and compile the application, change and
add to `gulpfile.js`. Please reference tasks that are needed to compile the
application in the declaration of the default task, so the application can be
put into a functional state just by running `gulp` in the root of your
application.

To add another language, add another file under `languages/`, named with the
appropriate language and country tag (`[language | ALL]_[country | ALL].xml`).
Don't forget to add the locale option to the gadget specification
(`gadget_template.xml`).

For usage of the GoLab components reference the interaction with the components
in this app. For some components, there is
[documentation](https://github.com/go-lab/ils/wiki) as well.
