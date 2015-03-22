"use strict";

function pageScrollBottom() {
  // For some reason, only the document element (e.g. `<html>`) has the correct
  // client height, whereas only the body has a scroll height (the document
  // element's scroll height is always 0).
  return document.documentElement.scrollTopMax - document.body.scrollTop;
}

const buffer_element = document.getElementById("buffer");
function scrollStartThreshold() {
  return scrollEndThreshold() + buffer_element.clientHeight;
}
function scrollEndThreshold() {
  return parseInt(getComputedStyle(buffer_element).getPropertyValue("margin-bottom"));
}

const scrollInterval = 30;
const scrollSpeed = 1;

const checkInterval = 1000;

let scrollIntervalID = undefined;

function startScrollIfNeeded() {
  if (pageScrollBottom() > scrollStartThreshold()) startScroll();
}

function startScroll() {
  if (scrollIntervalID !== undefined) return;

  scrollIntervalID = setInterval(scrollDownUntilStopThresholdMet, scrollInterval);
}

function scrollDownUntilStopThresholdMet() {
  scrollDown();

  if (pageScrollBottom() <= scrollEndThreshold()) {
    clearInterval(scrollIntervalID)
    scrollIntervalID = undefined;
  }
}

function scrollDown() {
  scrollBy(0, scrollSpeed);
}

let checkIntervalID = undefined;
function enable() {
  checkIntervalID = setInterval(startScrollIfNeeded, checkInterval);
}
function disable() {
  clearInterval(checkIntervalID);
  checkIntervalID = undefined;
}

enable();
