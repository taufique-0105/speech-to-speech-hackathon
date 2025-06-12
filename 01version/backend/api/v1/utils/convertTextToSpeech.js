const API_SECRET = process.env.API_KEY;
const SARVAM_TTS_API_URL = 'https://api.sarvam.ai/text-to-speech';

/**
 * Converts text to speech using Sarvam AI API
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Optional parameters
 * @param {string} options.targetLanguageCode - Target language code (required)
 * @param {string} options.model - model type (default bulbul:v2 , bulbul:v1)
 * @returns {Promise<Object>} - API response data with audios array
 * @throws {Error} - If conversion fails
 */
export const convertTextToSpeech = async (text, options = {}) => {
  const { targetLanguageCode,
		model='bulbul:v2',
//		...additionalOptions
	} = options;

  // Validate required parameters
  if (!text) {
    throw new Error('Text is required for text-to-speech conversion');
  }

  if (!targetLanguageCode) {
    throw new Error('Target language code is required');
  }

  if (!API_SECRET) {
    throw new Error('API_SECRET is not configured');
  }

  console.log("Converting text to speech:", text.substring(0, 100) + "...");
  console.log("Target language:", targetLanguageCode);

  // Prepare request payload
  const requestBody = {
    text,
    target_language_code: targetLanguageCode,
		model: model,
//    ...additionalOptions // Allow for future API parameters
  };

  try {
    const response = await fetch(SARVAM_TTS_API_URL, {
      method: 'POST',
      headers: {
        'api-subscription-key': API_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Text-to-speech failed with status ${response.status}: ${errorText}`);
    }

    const ttsResult = await response.json();
    console.log("TTS API response received");

    // Validate response structure
    if (!ttsResult.audios || !Array.isArray(ttsResult.audios)) {
      throw new Error('Invalid TTS response structure - missing or invalid audios array');
    }

    return {
      request_id: ttsResult.request_id || 'unknown',
      audios: ttsResult.audios,
    };

  } catch (error) {
    console.error("Error in text-to-speech conversion:", error);
    throw error;
  }
};
