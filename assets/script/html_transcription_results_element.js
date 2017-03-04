"use strict";
class HTMLTranscriptionResultsElement extends HTMLElement {
  constructor() {
    super();

    this._initialized = false
    this._lastFinalizedIndex = 0
    this.speechRecognition = null

    // Bind `this` in event listener methods
    this._speechRecognitionStart = this._speechRecognitionStart.bind(this)
    this._speechRecognitionResult = this._speechRecognitionResult.bind(this)
    this._speechRecognitionEnd = this._speechRecognitionEnd.bind(this)
    this._speechRecognitionError = this._speechRecognitionError.bind(this)
  }

  connectedCallback() {
    this._initializeTextElements()
  }

  _initializeTextElements() {
    if (this._initialized) return
    this._finalizedTextElement = this._newSpan("finalized-text")
    this._intermTextElement = this._newSpan("interm-text")
  }

  get speechRecognition() {
    return this._speechRecognition
  }

  set speechRecognition(newValue) {
    var oldValue = this._speechRecognition
    if (oldValue == newValue) return;

    this._unbindEvents()

    this._lastFinalizedIndex = 0
    this._speechRecognition = newValue

    this._bindEvents()
  }

  _bindEvents() {
    if (!this._speechRecognition) return
    this._initializeTextElements()
    this._speechRecognition.addEventListener('start', this._speechRecognitionStart)
    this._speechRecognition.addEventListener('result', this._speechRecognitionResult)
    this._speechRecognition.addEventListener('end', this._speechRecognitionEnd)
    this._speechRecognition.addEventListener('error', this._speechRecognitionError)
  }

  _unbindEvents() {
    if (!this._speechRecognition) return
    this._speechRecognition.removeEventListener('start', this._speechRecognitionStart)
    this._speechRecognition.removeEventListener('result', this._speechRecognitionResult)
    this._speechRecognition.removeEventListener('end', this._speechRecognitionEnd)
    this._speechRecognition.removeEventListener('error', this._speechRecognitionError)
  }

  get _finalizedText() {
    return this._finalizedTextElement.innerText
  }
  set _finalizedText(newValue) {
    this._finalizedTextElement.innerText = newValue
  }

  get _intermText() {
    return this._intermTextElement.innerText
  }
  set _intermText(newValue) {
    this._intermTextElement.innerText = newValue
  }

  _speechRecognitionStart(event) {
    this.displayStatus('start', "Speech recognition started.")
  }
  _speechRecognitionResult(event) {
    let newFinalizedText = ""
    let newIntermText = ""

    for (let i = this._lastFinalizedIndex; i < event.results.length; ++i) {
      let result = event.results[i];

      if (result.isFinal) {
        newFinalizedText += result[0].transcript
        this._lastFinalizedIndex = i+1
      } else {
        newIntermText += result[0].transcript
      }
    }

    // Add to finalized text *before* updating interm text. This prevents the
    // scrollbar from jumping upwards due to the page size shrinking before
    // expanding.
    this._finalizedText += newFinalizedText
    this._intermText = newIntermText
  }
  _speechRecognitionEnd(event) {
    this._lastFinalizedIndex = 0
    this.displayStatus('stop', "Speech recognition stopped.")
  }
  _speechRecognitionError(event) {
    this.displayStatus('error', "Speech recognition error: " + this._humanReadableSpeechError(event.error))
  }

  _newSpan(domClass) {
    var span = document.createElement("span")
    span.classList.add(domClass)
    this.appendChild(span)
    return span
  }

  _newStatus(type, msg) {
    var div = document.createElement("div")
    div.classList.add('status')
    div.classList.add('status-' + type)
    div.innerText = msg
    this.appendChild(div)
    return div
  }

  _humanReadableSpeechError(errorCode) {
    switch (errorCode) {
      case "no-speech":
        return "No speech was detected."
      case "aborted":
        return "Speech input was aborted."
      case "audio-capture":
        return "Audio capture failed."
      case "network":
        return "Network connection failed."
      case "not-allowed":
        return "Speech capture permission denied."
      case "service-not-allowed":
        return "Specified speech capture permission denied."
      case "bad-grammar":
        return "Speech recognition grammar or semantic tags invalid."
      case "language-not-supported":
        return "The specified language is not supported."
      default:
        return errorCode
    }
  }

  displayStatus(type, msg) {
    this._newStatus(type, msg)
    this._initializeTextElements()
  }
}

customElements.define('transcription-results', HTMLTranscriptionResultsElement)
