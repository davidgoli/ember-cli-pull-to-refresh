[![Build Status](https://travis-ci.org/davidgoli/ember-cli-pull-to-refresh.svg?branch=master)](https://travis-ci.org/davidgoli/ember-cli-pull-to-refresh)
[![Code Climate](https://codeclimate.com/github/davidgoli/ember-cli-pull-to-refresh/badges/gpa.svg)](https://codeclimate.com/github/davidgoli/ember-cli-pull-to-refresh)
[![Test Coverage](https://codeclimate.com/github/davidgoli/ember-cli-pull-to-refresh/badges/coverage.svg)](https://codeclimate.com/github/davidgoli/ember-cli-pull-to-refresh/coverage)

# Ember-cli-pull-to-refresh

A simple pull-to-refresh component for wrapping Ember CLI components.

## Usage

This component is meant to wrap the content being refreshed:

```hbs
{{#pull-to-refresh
  refresh='refresh'
  threshold=50
  refreshing=refreshing
  scrollable='.some-selector'
  disableMouseEvents=false
}}
  {{! render your model here }}
{{/pull-to-refresh}}
```

When the user drags the `pull-to-refresh` component down past the `threshold`
(default 50 pixels), then lets go, the component sends a `refresh` action and
enters the `refreshing` state. Your route can handle this action, fetch data
from the server, then set the controller's `refreshing` property to `false` to
reset to the default state. While in the `refreshing` state, the
`.pull-to-refresh` element has a `.refreshing` class you can use for styling.
When the user is pulling, it has a `.pulling` class. That's pretty much it!

Provide a `scrollable` selector that indicates the scrolling area being
observed, in order to enable normal scrolling behavior when not at the top.

Both mobile `touch` events and desktop-browser `mouse` events are supported by
default. Mouse events may be disabled by setting the property
`disableMouseEvents` to `true`.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
