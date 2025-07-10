const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const callGeminiAPI = async (message) => {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key not found. Returning a mock response.");

    await new Promise(resolve => setTimeout(resolve, 1000)); 
    return "This is a mock response. Please add your Gemini API key to enable the real AI.";
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: message }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error Response:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Invalid response structure from Gemini API:', data);
      return "I received an unexpected response from the AI. Please try again.";
    }

  } catch (error) {
    console.error('Gemini API Call Error:', error);
    return "Sorry, I'm having trouble connecting to the AI service right now.";
  }
};
