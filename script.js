/* eslint-disable sort-keys */
/**
 * @Author: Martin Adamko <@martin_adamko>
 * @Date: 2020-12-03T02:12:36+01:00
 * @Copyright: Martin Adamko
 * @flow
**/

/* global addScrollingTriggers */

const $body = document.getElementsByTagName('body')[0]
const states = {
  downloadVisible: false,
  finishVisible: false,
  middleChanged: false,
}

addScrollingTriggers([{
  element: 'middle',
  before () {
    if (states.downloadVisible) {
      $body.className = $body.className.replace(/\bshow-download\b/, '').trim()
    }

    states.downloadVisible = false
  },
  during () {
    if (!states.downloadVisible) {
      $body.className = ($body.className + ' show-download').trim()
    }

    if (!states.middleChanged) {
      $body.className = ($body.className + ' middle-changed').trim()
      states.middleChanged = true
    }

    states.downloadVisible = true
  },
  after () {
    if (!states.downloadVisible) {
      $body.className = ($body.className + ' show-download').trim()
    }

    states.downloadVisible = true
  },
}, {
  element: 'finish',
  before () {
    if (states.finishVisible) {
      $body.className = $body.className.replace(/\bshow-finish\b/, '').trim()
    }

    states.finishVisible = false
  },
  during () {
    if (!states.finishVisible) {
      $body.className = ($body.className + ' show-finish').trim()
    }

    states.finishVisible = true
  },
  origin: 0.2,
}])
