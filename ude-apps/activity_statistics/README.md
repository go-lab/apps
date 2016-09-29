# Activity Statistics

A Golab app for visualising activity in an ILS in realtime.

The specific activities that are visualised are:

- access to phases at a specific time
- access to apps at a specific time

These activities are dependent on each other, since every access to an app is
preceded by access to a phase.


## Architecture

The app is bootstrapped and configured in `app/run.js`, where the main
application function, to be found in `app/app.js` is called.

The app state is represented by an
[immutable](https://facebook.github.io/immutable-js/) data structure, which is
initiated and updated by functions to be found in `app/update.js`, with the help
of `app/state.js`. The state is rendered using
[React](https://facebook.github.io/react/), with the top level component being
`app/view/view.js`. Updates are triggered by user interaction or activity
provider events.

The app connects over websockets to a vert.x server that processes logs
forwarded from the learning analytics server. The server interactions and data
processing can be found in `app/activity_provider.js`.


## Tooling

Run `npm install` and then `gulp` to create the `gadget.xml` that is required
for use as an OpenSocial gadget, and to compile the JS sources written in ES6
into ES5-compatible code. Use `gulp watch` to continually rebuild files whenever
you make a change.


## Credits

This app builds on work done by Adrian Hubacsek.
