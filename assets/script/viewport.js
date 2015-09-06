"use strict";
class Viewport {
  constructor() {
    this.documentElement = document.documentElement
    this.scrollingElement = document.body
  }

  get height() {
    return this.documentElement.clientHeight
  }
  // get width() { ... }

  get top() {
    return this.scrollingElement.scrollTop
  }
  set top(value) {
    this.scrollingElement.scrollTop = value
  }

  get distanceFromTop() {
    return this.top
  }
  set distanceFromTop(value) {
    this.top = value
  }

  get bottom() {
    return this.top + this.height
  }
  set bottom(value) {
    this.top = value - this.height
  }

  get distanceFromBottom() {
    return this.documentElement.scrollHeight - this.bottom
  }
  set distanceFromBottom(value) {
    this.bottom = this.documentElement.scrollHeight - value
  }

  scrollDown(pixels) {
    this.scrollingElement.scrollTop += pixels
  }
  scrollUp(pixels) {
    this.scrollingElement.scrollTop -= pixels
  }
}
