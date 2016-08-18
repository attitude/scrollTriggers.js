# scrollTriggers.js

Minimalistic scrolling vanilla JS plugin, zero dependency < 2KB minified.

[See demo](http://attitude.github.io/scrollTriggers.js)

## Options

- `el` - `[object HTMLDivElement]` or `string` (element id)
- `before`, `during`, `after` - `[object Function]` callback
- `origin` – `float` from `0` to `1`, default: `0.5`,
  where 0 = top of the screen, 1 = bottom of the screen

## Usage

Link the script file and initialize the elements to watch;

```js
window.addScrollingTriggers([{
    el: 'section-with-some-specific-id',
    before: function() {
        App.api.navigationVisible(true);
    },
    during: function () {
        App.api.navigationVisible(true);
    },
    after: function (direction) {
        App.api.navigationVisible(false);
    },
    origin: 1
}]);
```

## About

Works with modern browsers, pull requests are welcome.
