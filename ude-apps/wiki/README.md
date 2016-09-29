# Wiki

A minimal wiki.

## Requirements

- Have a history of changes (revisions)
- Have variable persistence
  - local persistence
  - OpenSocial Persistence API
- Can be run standalone or as an OpenSocial Gadget
- (Have blocks of text you can navigate to)

## Domain

- **Wiki** - has an id and pages associated with it
- **Author** - a person that can edit and view pages and view the history.
  Multiple authors can edit the wiki.
- **Wiki Page** - has a title, revisions and `isIndex`, indicating if the page is the
  starting page of the wiki. There can only be one those.
- **Revision** - a particular version of a piece of content in one point in
  time. The latest revision of a page is the canonical version that gets
  displayed.

## GoLab

This wiki is intendend to have the ability to run in a GoLab context. It uses
the GoLab Storage Handler for persistence.

### Action Logging

This wiki supports action logging in activity stream format through go lab
libraries.

The actor of the logs is always the user, and the target is always the wiki. As
such, only the activity stream verb and object are changed. Note that a page
that the user created is referred to as 'wiki page', a page in the app such as
the index of pages, or the edit page is simply referred to as 'page'.

The verbs are chosen in accordance with [ActionLogger
Documentation](https://github.com/go-lab/ils/wiki/ActionLogger-Tutorial).

The following logs are created:


#### User accesses index page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'index',
    }
}`


#### User accesses view page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'view',
        wikiPageId: 'xxx'
    }
}`


#### User accesses edit page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'edit',
        wikiPageId: 'xxx'
    }
}`


#### User accesses new page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'new',
        wikiPageId: 'xxx'
    }
}`


### User accesses revisions page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'revisions',
        wikiPageId: 'xxx'
    }
}`


### User accesses revision comparison page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'revision_comparison',
        wikiPageId: 'xxx',
        revisionId: 'xxx'
    }
}`


### User accesses resource recommendations page

`{
    verb: 'access',
    object: {
        objectType: 'page',
        id: 'resource_recommendations',
        wikiPageId: 'xxx'
    }
}`


### User access a recommended resource

`{
    verb: 'access',
    object: {
        objectType: 'resource recommendation',
        url: 'http://the-url-of-the-resource.com',
        title: 'the title of the url',
    }
}`


### User creates a new wiki page

`{
    verb: 'add',
    object: {
        objectType: 'wiki page',
        title: 'title of the page',
        isIndex: true, // or false
        id: 'xxx',
    }
}`


### User changes wiki page

`{
    verb: 'change',
    object: {
        objectType: 'wiki page',
        id: 'xxx',
        revisionId: 'xxx',
        content: 'the new content',
    }
}`


### Setup

First make sure to embed the necessary script files at the bottom of
`index.html`, before all other scripts.

    ...
    <script src="/client/commons/js/utils.js"></script>
    <script src="/client/commons/js/MetadataHandler.js"></script>
    <script src="/client/commons/js/StorageHandler.js"></script>
    <script src="/client/commons/js/ActionLogger.js"></script>
    ...

Then, use the GoLab configuration by replacing `'app/standalone_configuration'`
at the very bottom of `index.html` with `'app/golab_configuration'`.

To change the StorageHandler that the app uses, go into
`app/golab_configuration`.

## Development

### Testing

Tests are written with [mocha](http://visionmedia.github.com/mocha/) as the test
framework with the tdd interface, and [Chai](http://chaijs.com) as the assertion
library. [Mocha as promised](https://github.com/domenic/mocha-as-promised)
provides advanced promise support.

Run the tests by opening `test/runner.html` in the browser.

### Package Management

This project uses [Bower](http://bower.io) to manage its dependencies. All
dependencies, including the ones not managed through bower are found under
`libs/`.

Libraries that are not in bower are located under `libs/no_bower/`.

### ES6

This project uses [Traceur](https://github.com/google/traceur-compiler) to
enable you to write code that employs language features of the next version of
javascript that are not yet in Browsers. The compiled output runs in
ES5-compatible browsers.

### Promises and Generators

This project makes use of Promises through the
[bluebird](https://github.com/petkaantonov/bluebird) library. Together with the
generators feature of ES6, one can write asynchronous code without the use of
callbacks. See [Iterators and Generators in ECMAScript
6](http://www.2ality.com/2013/06/iterators-generators.html) for an introduction
into generators, and [Bluebird
API](https://github.com/petkaantonov/bluebird/blob/master/API.md#generators) for
utility functions that marry generators and promises.

### Build Tools

To compile the files into ES5-compatible code, the [Gulp Build
System](https://github.com/gulpjs/gulp) is used. Be sure to run `npm install`
and `npm install -g gulp` to install necessary libraries to be able to build the
project.

Commands:

- `gulp transpile` compiles all files located under `app/` and `test/` into the
  `build/` directory
- `gulp watch` watches for file changes and recompiles changed files
