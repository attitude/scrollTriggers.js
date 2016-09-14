(function (w) {
    'use strict';

    var $document = w.document.documentElement,
        objects = [],
        $body = w.document.getElementsByTagName('body')[0],
        screenHeight = 0,
        updateScreenHeight = function () {
            screenHeight = w.innerHeight || $document.clientHeight || $body.clientHeight;
            updateScrolledObjects();
        },
        updateScrolledObjects = function () {
            objects.map(function (o) {
                o.top       = Math.round(o.element.getClientRects()[0].top - (screenHeight * o.origin));
                o.bottom    = Math.round(o.element.getClientRects()[0].bottom - (screenHeight * o.origin));

                var newInView = null;

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
                        o.before(newInView - o.inView);
                    } else if (newInView === 0) {
                        o.during(newInView - o.inView);
                    } else {
                        o.after(newInView - o.inView);
                    }
                }

                // Commit
                o.inView = newInView;
            });
        },
        noop = function() {};

    w.addScrollingTriggers = function (triggers) {
        if (Object.prototype.toString.call(triggers) !== '[object Array]') {
            if (w.console) {
                w.console.warn('`triggers` must be an array', triggers);
            }

            return;
        }

        triggers = triggers.filter(function (v) {
            return typeof v === 'object' && Object.prototype.toString.call(v) !== '[object Array]';
        }).map(function (v) {
            if (v.el instanceof Element) {
                var el = v.el;
            } else {
                var el = w.document.getElementById(v.el);
            }

            if (el) {
                objects.push({
                    element: el,
                    inView:  null, // -1: not yet in view, 0: in view, 1: was in view
                    top:     null,
                    bottom:  null,
                    before:  v.before && typeof v.before === 'function' ? v.before : noop,
                    during:  v.during && typeof v.during === 'function' ? v.during : noop,
                    after:   v.after  && typeof v.after  === 'function' ? v.after  : noop,
                    origin:  (v.origin || v.origin === 0) && v.origin >= 0 && v.origin <= 1 ? v.origin : 0.5
                });
            }

            return v;
        });

        updateScreenHeight();
        updateScrolledObjects();
    };

    w.addEventListener('resize', updateScreenHeight);
    w.addEventListener('scroll', updateScrolledObjects);
}(window));
