/**
 * @Author: Martin Adamko <@martin_adamko>
 * @Date: 2020-12-03T01:12:43+01:00
 * @Copyright: Martin Adamko
 * @license MIT
 * @flow
**/

type ScrollTrigger = $Exact<{
  after: () => void,
  before: () => void,
  bottom: ?number,
  during: () => void,
  element: HTMLElement,
  inView: ?number, // -1: not yet in view, 0: in view, 1: was in view
  origin: number,
  top: ?number,
}>

// eslint-disable-next-line no-unused-vars
let addScrollingTriggers = function addScrollingTriggersNoop (triggers: ScrollTrigger[]): void { '' }
// eslint-disable-next-line no-unused-vars
let setScrollingTriggersFramerate = function setScrollingTriggersFramerateNoop (newScrollFramerate: number): void { '' };

(function (window: Window) {
  'use strict'

  const $document = window.document.documentElement

  if (!$document) { return }

  // eslint-disable-next-line no-console
  const warn = (console && console.warn) || function warnNoop (...rest: mixed[]) { /**/ }

  const scrollTriggersList: ScrollTrigger[] = []
  const $body = window.document.body

  if (!$body) { return }

  let screenHeight = 0

  const updateScreenHeight = function () {
    screenHeight = window.innerHeight || $document.clientHeight || $body.clientHeight
    updateScrolledObjects()
  }

  let lastScrolledTime = Date.now()
  let scrollFramerate: number = 1000 / 25

  const updateScrolledObjects = function () {
    scrollTriggersList.forEach((scrolltrigger: ScrollTrigger) => {
      let newInView = null
      let elementClientRects = scrolltrigger.element.getClientRects()

      if (elementClientRects.length === 0) {
        return
      }

      elementClientRects = elementClientRects[0]

      const top = Math.round(elementClientRects.top - (screenHeight * scrolltrigger.origin))
      const bottom = Math.round(elementClientRects.bottom - (screenHeight * scrolltrigger.origin))

      scrolltrigger.top = top
      scrolltrigger.bottom = bottom

      if (top > 0) {
        // Comming: Distance of top border from middle is > 0
        newInView = -1
      } else if (bottom < 0) {
        // Was: Distance of bottom border from middle is < 0
        newInView = 1
      } else {
        // In view
        newInView = 0
      }

      // Change
      if (scrolltrigger.inView !== newInView) {
        // > +1 FORWARD
        // < -1 BACKWARD
        if (newInView === -1) {
          scrolltrigger.before()
        } else if (newInView === 0) {
          scrolltrigger.during()
        } else {
          scrolltrigger.after()
        }
      }

      // Commit
      scrolltrigger.inView = newInView
    })
  }
  const noop = function () { '' }
  const throttledScroll = function throttledScroll () {
    const scrolledTime = Date.now()

    if (scrolledTime - lastScrolledTime > scrollFramerate) {
      lastScrolledTime = scrolledTime
      updateScrolledObjects()
    }
  }

  function castTriggerTypeOrNull (trigger: mixed): ?ScrollTrigger {
    if (!trigger || typeof trigger !== 'object') {
      return
    }

    const element: ?HTMLElement = trigger.element instanceof HTMLElement
      ? trigger.element
      : typeof trigger.element === 'string'
        ? window.document.getElementById(trigger.element)
        : null

    if (!element) {
      return
    }

    const inView = null // -1: not yet in view, 0: in view, 1: was in view
    const bottom = null
    const top = null
    const before = typeof trigger.before === 'function' && trigger.before.length === 0
      ? ((trigger.before: any): () => void)
      : noop
    const during = typeof trigger.during === 'function' && trigger.during.length === 0
      ? ((trigger.during: any): () => void)
      : noop
    const after = typeof trigger.after === 'function' && trigger.after.length === 0
      ? ((trigger.after: any): () => void)
      : noop
    const origin = typeof trigger.origin === 'number'
      ? Math.min(1, Math.max(0, trigger.origin))
      : 0.5

    return {
      after,
      before,
      bottom,
      during,
      element,
      inView,
      origin,
      top,
    }
  }

  function castArrayOfEmptyArray (triggers: mixed): $ReadOnlyArray<mixed> {
    if (!Array.isArray(triggers)) {
      warn('`triggers` must be an array', triggers)

      return []
    }

    return triggers
  }

  addScrollingTriggers = function addScrollingTriggers (triggers: ScrollTrigger[]): void {
    castArrayOfEmptyArray(triggers).forEach((trigger: mixed) => {
      trigger = castTriggerTypeOrNull(trigger)

      if (trigger) {
        scrollTriggersList.push(trigger)
      }
    })

    updateScreenHeight()
    updateScrolledObjects()
  }

  setScrollingTriggersFramerate = function setScrollingTriggersFramerate (newScrollFramerate: number): void {
    if (newScrollFramerate > 1000 / 10 && newScrollFramerate <= 1000 / 60) {
      scrollFramerate = newScrollFramerate
    } else {
      warn('New frame rate must be within rangge 10fps (100ms) and 60fps (16.666ms).')
    }
  }

  window.addEventListener('resize', updateScreenHeight)
  window.addEventListener('scroll', throttledScroll, { passive: true })
}(window))
