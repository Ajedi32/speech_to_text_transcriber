"use strict";

const bufferElement = document.getElementById("buffer");
function scrollStartThreshold() {
  return scrollEndThreshold() + bufferElement.clientHeight;
}
function scrollEndThreshold() {
  return parseInt(getComputedStyle(bufferElement).getPropertyValue("margin-bottom"));
}

function scrollStartThresholdMet() {
  return viewport.distanceFromBottom > scrollStartThreshold()
}
function scrollEndThresholdMet() {
  return viewport.distanceFromBottom <= scrollEndThreshold()
}

function startScrollIfNeeded() {
  if (scroller.running) return
  if (scrollStartThresholdMet()) {
    scroller.scrollDownUntil(scrollEndThresholdMet)
  }
}

const viewport = new Viewport();
const scroller = new ViewportScroller(viewport);

const observedDOMObject = document.getElementById('results')
const observer = new MutationObserver(startScrollIfNeeded)

function enable() {
  observer.observe(observedDOMObject, {childList: true, characterData: true, subtree: true})
}
function disable() {
  observer.disconnect()
}

enable()
