const API_SECRET = process.env.API_KEY;
const SARVAM_TRANSLATE_API_URL = 'https://api.sarvam.ai/translate';

/**
 * Translates text using Sarvam AI API
 * @param {string} text - Text to translate
 * @param {Object} options - Optional parameters
 * @param {string} options.targetLanguage - Target language code (default: 'en-IN')
 * @param {string} options.sourceLanguage - Source language code (default: 'auto')
 * @returns {Promise<Object>} - API response data with translation details
 * @throws {Error} - If translation fails
 */
export const translateText = async ( text, targetLanguage ) => {

  const sourceLanguage = 'auto';

  // Validate required parameters
  if (!text) {
    throw new Error('Text to translate is required');
  }

  if (!API_SECRET) {
    throw new Error('API_SECRET is not configured');
  }

  console.log("Translating text:", text.substring(0, 100) + "...");
  console.log("Source language:", sourceLanguage, "-> Target language:", targetLanguage);

  // Prepare request payload
  const requestBody = {
    input: text,
    source_language_code: sourceLanguage,
    target_language_code: targetLanguage,
  };

  try {
    const response = await fetch(SARVAM_TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'api-subscription-key': API_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Translation failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("Translation API response received");

    // Validate response structure
    if (!result.translated_text) {
      throw new Error('Invalid translation response - missing translated_text');
    }

    return {
      success: true,
      originalText: text,
      translation: result.translated_text,
      sourceLanguage: result.source_language_code || sourceLanguage,
      targetLanguage: result.target_language_code || targetLanguage,
    };

  } catch (error) {
    console.error("Error in text translation:", error);
    throw error;
  }
};
