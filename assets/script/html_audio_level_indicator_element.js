"use strict";
class HTMLAudioLevelIndicatorElement extends HTMLElement {
  constructor() {
    super()

    // Bind `this` in event handlers
    this._draw = this._draw.bind(this)

    // Set up the audio analyser
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    analyser.smoothingTimeConstant = 0.85
    analyser.fftSize = 32

    // Initialize instance variables
    this._audioContext = audioContext
    this._audioAnalyser = analyser
    this._audioSource = null
    this._canvas = document.createElement('canvas')
    this._drawingContext = this._canvas.getContext('2d')
    this._resizeSensor = null
    this._pendingAnimationFrame = null
    this._audioBufferLength = analyser.fftSize
    this._byteFrequencyDataArray = new Uint8Array(this._audioBufferLength)
  }

  connectedCallback() {
    this.appendChild(this._canvas)

    this._setCanvasSize()
    this._resizeSensor = new ResizeSensor(this, () => {
        this._setCanvasSize()
    });

    // TODO: Use the permissions API to avoid requesting access to mic if user
    // hasn't already granted it. Display indicator only after user grants the
    // permission through some other interaction with the page.
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        this._audioSource = this._audioContext.createMediaStreamSource(stream)
        this._audioSource.connect(this._audioAnalyser)

        this._startIndicator()
      })
    } else {
       throw new Error('getUserMedia is not supported by this browser!')
    }
  }

  disconnectedCallback() {
    if (this._resizeSensor !== null) {
      this._resizeSensor.detach()
      this._resizeSensor = null
    }
    if (this._audioSource !== null) {
      this._audioSource.disconnect()
      this._audioSource = null
    }
  }

  _setCanvasSize() {
    this._canvas.height = this.clientHeight
    this._canvas.width = this.clientWidth
  }

  _startIndicator() {
    this._draw()
  }

  _stopIndicator() {
    if (this._pendingAnimationFrame === null) return

    window.cancelAnimationFrame(this._pendingAnimationFrame)
    this._pendingAnimationFrame = null
  }

  _clearCanvas() {
    this._drawingContext.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  _draw() {
    this._clearCanvas()

    this._audioAnalyser.getByteFrequencyData(this._byteFrequencyDataArray)
    const barWidth = (this._canvas.width / this._audioBufferLength) * 2.5

    for(let i = 0; i < this._audioBufferLength; i++) {
      let fractionalVolume = this._byteFrequencyDataArray[i]/255
      let barHeight = fractionalVolume*this._canvas.height

      this._drawingContext.fillStyle = 'rgba(255,20,20,' + fractionalVolume + ')'
      this._drawingContext.fillRect(
        (barWidth + 1)*i,
        this._canvas.height-barHeight,
        barWidth,
        barHeight
      )
    }

    this._pendingAnimationFrame = window.requestAnimationFrame(this._draw)
  }
}

customElements.define('audio-level-indicator', HTMLAudioLevelIndicatorElement)
