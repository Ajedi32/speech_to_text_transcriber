"use strict";
if (!('webkitSpeechRecognition' in window)) {
  alert("This application is currently unsupported on your browser.\nPlease use Chrome instead.");
} else {
  let transcriptionContainer = document.getElementById("transcription");

  let recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.lang = 'en-US'; // Hard coded for now.

  let trResults = document.createElement('transcription-results')
  trResults.speechRecognition = recognition
  transcriptionContainer.appendChild(trResults)

  let transcription_toggle_button = document.getElementById("toggle-transcription");

  let auto_restart = true;

  let transcription_running = false;

  recognition.onstart = function() {
    console.log("Transcription started.");
    transcription_running = true;
    transcription_toggle_button.innerText = "Stop Transcription";
  };
  recognition.onerror = function(event) {
    console.log("Error!\n" + event);

    if (auto_restart) setTimeout(() => recognition.start(), 100);
  };
  recognition.onend = function() {
    console.log("Transcription ended.");
    transcription_running = false;
    transcription_toggle_button.innerText = "Start Transcription";
  };

  transcription_toggle_button.addEventListener("click", (e) => {
    if (transcription_running) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });
}
