"use strict";
class HTMLTranscriptionResultsElement extends HTMLElement {
  createdCallback() {
    this._finalizedTextElement = this._newSpan("finalized-text")
    this._intermTextElement = this._newSpan("interm-text")

    this._finalizedText = ""
    this._intermText = ""

    this._lastFinalizedIndex = 0

    this.speechRecognition = null

    this._speechRecognitionResult = this._speechRecognitionResult.bind(this)
    this._speechRecognitionEnd = this._speechRecognitionEnd.bind(this)
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
    this._speechRecognition.addEventListener('result', this._speechRecognitionResult)
    this._speechRecognition.addEventListener('end', this._speechRecognitionEnd)
  }

  _unbindEvents() {
    if (!this._speechRecognition) return
    this._speechRecognition.removeEventListener('result', this._speechRecognitionResult)
    this._speechRecognition.removeEventListener('end', this._speechRecognitionEnd)
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

    this._intermText = newIntermText
    this._finalizedText += newFinalizedText
  }

  _speechRecognitionEnd(event) {
    this._lastFinalizedIndex = 0
  }

  _newSpan(domClass) {
    var span = document.createElement("span")
    span.classList.add(domClass)
    this.appendChild(span)
    return span
  }
}

document.registerElement('transcription-results', {
  prototype: HTMLTranscriptionResultsElement.prototype
})
