"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @Author: Martin Adamko <@martin_adamko>
 * @Date: 2020-12-03T01:12:43+01:00
 * @Copyright: Martin Adamko
 * @license MIT
 * 
**/
var addScrollingTriggers = function addScrollingTriggersNoop(triggers) {
  '';
};

var setScrollingTriggersFramerate = function setScrollingTriggersFramerateNoop(newScrollFramerate) {
  '';
};

(function (window) {
  'use strict';

  var $document = window.document.documentElement;

  if (!$document) {
    return;
  }

  var warn = console && console.warn || function warnNoop() {};

  var scrollTriggersList = [];
  var $body = window.document.body;

  if (!$body) {
    return;
  }

  var screenHeight = 0;

  var updateScreenHeight = function updateScreenHeight() {
    screenHeight = window.innerHeight || $document.clientHeight || $body.clientHeight;
    updateScrolledObjects();
  };

  var lastScrolledTime = Date.now();
  var scrollFramerate = 1000 / 25;

  var updateScrolledObjects = function updateScrolledObjects() {
    scrollTriggersList.forEach(function (scrolltrigger) {
      var newInView = null;
      var elementClientRects = scrolltrigger.element.getClientRects();

      if (elementClientRects.length === 0) {
        return;
      }

      elementClientRects = elementClientRects[0];
      var top = Math.round(elementClientRects.top - screenHeight * scrolltrigger.origin);
      var bottom = Math.round(elementClientRects.bottom - screenHeight * scrolltrigger.origin);
      scrolltrigger.top = top;
      scrolltrigger.bottom = bottom;

      if (top > 0) {
        newInView = -1;
      } else if (bottom < 0) {
        newInView = 1;
      } else {
        newInView = 0;
      }

      if (scrolltrigger.inView !== newInView) {
        if (newInView === -1) {
          scrolltrigger.before();
        } else if (newInView === 0) {
          scrolltrigger.during();
        } else {
          scrolltrigger.after();
        }
      }

      scrolltrigger.inView = newInView;
    });
  };

  var noop = function noop() {
    '';
  };

  var throttledScroll = function throttledScroll() {
    var scrolledTime = Date.now();

    if (scrolledTime - lastScrolledTime > scrollFramerate) {
      lastScrolledTime = scrolledTime;
      updateScrolledObjects();
    }
  };

  function castTriggerTypeOrNull(trigger) {
    if (!trigger || _typeof(trigger) !== 'object') {
      return;
    }

    var element = trigger.element instanceof HTMLElement ? trigger.element : typeof trigger.element === 'string' ? window.document.getElementById(trigger.element) : null;

    if (!element) {
      return;
    }

    var inView = null;
    var bottom = null;
    var top = null;
    var before = typeof trigger.before === 'function' && trigger.before.length === 0 ? trigger.before : noop;
    var during = typeof trigger.during === 'function' && trigger.during.length === 0 ? trigger.during : noop;
    var after = typeof trigger.after === 'function' && trigger.after.length === 0 ? trigger.after : noop;
    var origin = typeof trigger.origin === 'number' ? Math.min(1, Math.max(0, trigger.origin)) : 0.5;
    return {
      after: after,
      before: before,
      bottom: bottom,
      during: during,
      element: element,
      inView: inView,
      origin: origin,
      top: top
    };
  }

  function castArrayOfEmptyArray(triggers) {
    if (!Array.isArray(triggers)) {
      warn('`triggers` must be an array', triggers);
      return [];
    }

    return triggers;
  }

  addScrollingTriggers = function addScrollingTriggers(triggers) {
    castArrayOfEmptyArray(triggers).forEach(function (trigger) {
      trigger = castTriggerTypeOrNull(trigger);

      if (trigger) {
        scrollTriggersList.push(trigger);
      }
    });
    updateScreenHeight();
    updateScrolledObjects();
  };

  setScrollingTriggersFramerate = function setScrollingTriggersFramerate(newScrollFramerate) {
    if (newScrollFramerate > 1000 / 10 && newScrollFramerate <= 1000 / 60) {
      scrollFramerate = newScrollFramerate;
    } else {
      warn('New frame rate must be within rangge 10fps (100ms) and 60fps (16.666ms).');
    }
  };

  window.addEventListener('resize', updateScreenHeight);
  window.addEventListener('scroll', throttledScroll, {
    passive: true
  });
})(window);
//# sourceMappingURL=scrollTriggers.js.map