import { translateText } from '../utils/translateText.js';

export const getTextToText = (req, res) => {
  res.json({
    message:
      "This is the Text to Text API endpoint. Please use POST method with text data.",
    status: "success",
  });
};

export const postTextToText = async (req, res) => {
  try {
    const { text, targetLanguage = 'en-IN' } = req.body;

    // Validate required fields
    if (!text) {
      return res.status(400).json({ error: "Text to translate is required" });
    }

    // Call utility function
    // You can call it in different ways:
    
    // 1. Use default target language (en-IN):
    // const result = await translateText(text);
    
    // 2. Specify target language:
    const result = await translateText(text, { 
      targetLanguage: targetLanguage || 'en-IN' 
    });
    
    // 3. Specify both source and target languages:
    // const result = await translateText(text, { 
    //   sourceLanguage: 'od-IN',
    //   targetLanguage: 'en-US' 
    // });

    res.status(200).json(result);

  } catch (error) {
    console.error("Controller error:", error.message);
    
    // Return appropriate HTTP status based on error type
    let statusCode = 500;
    if (error.message.includes('required')) {
      statusCode = 400;
    } else if (error.message.includes('API_SECRET')) {
      statusCode = 500;
    }

    const errorResponse = {
      success: false,
      error: error.message,
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === "development") {
      errorResponse.details = error.stack;
    }

    res.status(statusCode).json(errorResponse);
  }
};

export default {
  getTextToText,
  postTextToText,
};
