"use strict";
if (!('webkitSpeechRecognition' in window)) {
  alert("This application is currently unsupported on your browser.\nPlease use Chrome instead.");
} else {
  let recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.lang = 'en-US'; // Hard coded for now.

  let final_transcript = '';

  let final_span = document.getElementById("finalized-text");
  let interim_span = document.getElementById("interm-text");

  recognition.onstart = function() {
    console.log("Transcription started.");
    // ...
  };
  recognition.onresult = function(event) {
    let interim_transcript = '';

    // Loop through new results
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      let result = event.results[i];

      if (result.isFinal) {
        final_transcript += result[0].transcript;
      } else {
        interim_transcript += result[0].transcript;
      }
    }

    final_span.innerText = final_transcript;
    interim_span.innerText = interim_transcript;
  };
  recognition.onerror = function(event) {
    console.log("Error!\n" + event);
    // TODO: Restart transcription.
  };
  recognition.onend = function() {
    console.log("Transcription ended.");
    // ...
  };

  recognition.start();
}
