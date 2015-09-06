"use strict";

class ControlBar {
  constructor(element, options) {
    options = options || {}

    this._rootElement = element
    this._containerElement = element.querySelector('.panel-container')

    this.hideDelay = options['hideDelay'] || 3000
    this._hoverElement = options['hoverElement'] || element.parentElement

    this._hideTimer = null
    this._mouseOver = false

    this._mouseMoveParent = this._mouseMoveParent.bind(this)
    this._mouseEnter = this._mouseEnter.bind(this)
    this._mouseLeave = this._mouseLeave.bind(this)

    this._bindEventListeners()
  }

  get visible() {
    return this._rootElement.classList.contains("expanded")
  }

  show() {
    this._rootElement.classList.add("expanded")
  }
  hide() {
    this._rootElement.classList.remove("expanded")
    this._hideTimer = null
  }

  _bindEventListeners() {
    this._hoverElement.addEventListener('mousemove', this._mouseMoveParent);
    this._containerElement.addEventListener('mouseenter', this._mouseEnter);
    this._containerElement.addEventListener('mouseleave', this._mouseLeave);
  }
  _unbindEventListeners() {
    this._hoverElement.removeEventListener('mousemove', this._mouseMoveParent);
    this._containerElement.removeEventListener('mouseenter', this._mouseEnter);
    this._containerElement.removeEventListener('mouseleave', this._mouseLeave);
  }

  _mouseMoveParent() {
    this.show()
    if (!this._mouseOver) this._startHiding()
  }
  _mouseEnter() {
    this._mouseOver = true
    this._stopHiding()
  }
  _mouseLeave() {
    this._mouseOver = false
    if (this.visible) this._startHiding()
  }

  _startHiding() {
    this._stopHiding()
    this._hideTimer = setTimeout(this._hideTimer === null ? this.hide.bind(this) : this._hideTimer, this.hideDelay)
  }
  _stopHiding() {
    if (this._hideTimer === null) return
    clearTimeout(this._hideTimer)
    this._hideTimer = null
  }
}

const controlBar = new ControlBar(document.getElementById('controls'), {hoverElement: document.documentElement});
