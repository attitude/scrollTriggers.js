(function(w) {
    'use strict';

    var $document = w.document.documentElement,
        objects = [],
        $body = w.document.getElementsByTagName('body')[0],
        screenHeight = 0,
        updateScreenHeight = function() {
            screenHeight = w.innerHeight || $document.clientHeight || $body.clientHeight;
            updateScrolledObjects();
        },
        lastScrolledTime = new Date().getTime(),
        scrollFramerate = 1000 / 25,
        updateScrolledObjects = function() {
            objects.map(function(o) {
                var newInView = null,
                    elementClientRects = o.element.getClientRects();

                if (elementClientRects.length > 0) {
                    elementClientRects = elementClientRects[0];

                    o.top = Math.round(elementClientRects.top - (screenHeight * o.origin));
                    o.bottom = Math.round(elementClientRects.bottom - (screenHeight * o.origin));

                    if (o.top > 0) {
                        // Comming: Distance of top border from middle is > 0
                        newInView = -1;
                    } else if (o.bottom < 0) {
                        // Was: Distance of bottom border from middle is < 0
                        newInView = 1;
                    } else {
                        // In view
                        newInView = 0;
                    }

                    // Change
                    if (o.inView !== newInView) {
                        // > +1 FORWARD
                        // < -1 BACKWARD
                        if (newInView === -1) {
                            o.before();
                        } else if (newInView === 0) {
                            o.during();
                        } else {
                            o.after();
                        }
                    }

                    // Commit
                    o.inView = newInView;
                }
            });
        },
        noop = function() {},
        throttledScroll = function throttledScroll() {
            var scrolledTime = new Date().getTime();

            if (scrolledTime - lastScrolledTime > scrollFramerate) {
                lastScrolledTime = scrolledTime;
                updateScrolledObjects();
            }
        };

    w.addScrollingTriggers = function(triggers) {
        if (Object.prototype.toString.call(triggers) !== '[object Array]') {
            if (w.console) {
                w.console.warn('`triggers` must be an array', triggers);
            }

            return;
        }

        triggers = triggers.filter(function(v) {
            return typeof v === 'object' && Object.prototype.toString.call(v) !== '[object Array]';
        }).map(function(v) {
            if (v.el instanceof Element) {
                var el = v.el;
            } else {
                var el = w.document.getElementById(v.el);
            }

            if (el) {
                objects.push({
                    element: el,
                    inView: null, // -1: not yet in view, 0: in view, 1: was in view
                    top: null,
                    bottom: null,
                    before: v.before && typeof v.before === 'function' ? v.before : noop,
                    during: v.during && typeof v.during === 'function' ? v.during : noop,
                    after: v.after && typeof v.after === 'function' ? v.after : noop,
                    origin: (v.origin || v.origin === 0) && v.origin >= 0 && v.origin <= 1 ? v.origin : 0.5
                });
            }

            return v;
        });

        updateScreenHeight();
        updateScrolledObjects();
    };

    w.setScrollingTriggersFramerate = function setScrollingTriggersFramerate(newScrollFramerate) {
        if (newScrollFramerate > 1000 / 10 && newScrollFramerate <= 1000 / 60) {
            scrollFramerate = newScrollFramerate;
        }
    };

    w.addEventListener('resize', updateScreenHeight);
    w.addEventListener('scroll', throttledScroll);
}(window));
