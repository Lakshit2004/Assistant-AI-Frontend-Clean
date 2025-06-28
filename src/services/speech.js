// utils/speech.js

// Speak text aloud
export function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

// Start speech recognition
export function startRecognition(onResult, onEnd) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();

  return recognition;
}
// src/services/speech.js

/**
 * A class to manage speech synthesis (text-to-speech) and recognition (speech-to-text).
 */
class SpeechService {
  constructor() {
    // --- Speech Synthesis (Text-to-Speech) ---
    this.synth = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.rate = 0.9;
    this.utterance.pitch = 1;
    this.utterance.volume = 0.8;
    this.isSpeaking = false;

    // --- Speech Recognition (Speech-to-Text) ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.isListening = false;
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
      this.recognition = null;
    }

    // Bind methods to ensure 'this' context is correct
    this.speak = this.speak.bind(this);
    this.cancel = this.cancel.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
  }

  /**
   * Speaks the given text using the browser's speech synthesis API.
   * @param {string} text - The text to be spoken.
   * @param {function} onStart - Callback function when speech starts.
   * @param {function} onEnd - Callback function when speech ends.
   */
  speak(text, onStart, onEnd) {
    if (!this.synth || !text) return;

    this.cancel(); // Cancel any ongoing speech

    this.utterance.text = text;
    this.utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };
    this.utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };
     this.utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd(); // Also call onEnd on error
    };

    this.synth.speak(this.utterance);
  }

  /**
   * Cancels any ongoing speech.
   */
  cancel() {
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
    }
  }

  /**
   * Starts listening for voice input.
   * @param {function} onResult - Callback with the transcribed text.
   * @param {function} onEnd - Callback when listening ends.
   * @param {function} onError - Callback for any errors.
   */
  startListening({ onResult, onEnd, onError }) {
    if (!this.recognition || this.isListening) return;
    
    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
      this.stopListening(); // Automatically stop after getting a result
    };

    this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
    };

    this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error);
    };

    this.recognition.start();
  }

  /**
   * Manually stops the speech recognition.
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

// Export a singleton instance of the service
const speechService = new SpeechService();
export default speechService;
