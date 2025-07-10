
export function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

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


    this.speak = this.speak.bind(this);
    this.cancel = this.cancel.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
  }


  speak(text, onStart, onEnd) {
    if (!this.synth || !text) return;

    this.cancel(); 

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
      if (onEnd) onEnd(); 
    };

    this.synth.speak(this.utterance);
  }


  cancel() {
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
    }
  }


  startListening({ onResult, onEnd, onError }) {
    if (!this.recognition || this.isListening) return;
    
    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
      this.stopListening(); 
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
