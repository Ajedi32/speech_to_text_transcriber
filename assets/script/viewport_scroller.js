"use strict";
class ViewportScroller {
  constructor(viewport, options) {
    options = options || {}
    this.viewport = viewport
    this.scrollInterval = options.scrollInterval || 30
    this.scrollSpeed = options.scrollSpeed || 1

    this.intervalId = null
    this.scrollDirection = 1
    this.scrollCondition = ViewportScroller.trueFunc

    this._tick = this._tick.bind(this)
  }

  scrollDownUntil(condition) {
    this.scrollCondition = ViewportScroller.invertFunc(condition)
    this.scrollDirection = 1
    this._start()
  }

  stop() {
    if (!this.running) return
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  get running() {
    return this.intervalId !== null
  }

  get scrollSpeed() {
    let result = this._scrollSpeed;
    if (typeof result === 'function') result = result();
    return result;
  }
  set scrollSpeed(newVal) {
    this._scrollSpeed = newVal;
  }

  _checkCondition() {
    if (this.scrollCondition(this)) {
      return true
    } else {
      this.stop()
      return false
    }
  }

  _tick() {
    if (!this._checkCondition()) return;
    this.viewport.scrollDown(this.scrollSpeed * this.scrollDirection)
  }

  _start() {
    this.stop()
    this.intervalId = setInterval(this._tick, this.scrollInterval)
  }
}
ViewportScroller.trueFunc = () => true
ViewportScroller.invertFunc = (func) => function(){ return !func.apply(this, arguments) }
