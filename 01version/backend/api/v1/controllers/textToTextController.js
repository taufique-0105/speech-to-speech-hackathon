const API_SECRET = process.env.API_KEY;

export const getTextToText = (req, res) => {
  res.json({
    message:
      "This is the Text to Text API endpoint. Please use POST method with text data.",
    status: "success",
  });
};

export const postTextToText = async (req, res) => {
  try {
    // Get parameters from request body
    const { text, targetLanguage = "en-IN" } = req.body;
    const API_KEY = API_SECRET;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: "Text to translate is required" });
    }
    if (!API_KEY) {
      return res.status(401).json({ error: "API key is required" });
    }

    // Call Sarvam AI API
    const response = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "api-subscription-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        source_language_code: "auto",
        target_language_code: targetLanguage,
      }),
    });

    // Handle response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Send successful response
    res.status(200).json({
      success: true,
      originalText: text,
      translation: result.translated_text,
      sourceLanguage: result.source_language_code,
      targetLanguage: result.targetLanguage
    });

  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Translation failed",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export default {
  getTextToText,
  postTextToText,
};
