const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key; // Clients send the key in this header
  console.log(apiKey)

  if (!apiKey) {
    return res.status(401).json({ error: 'API key missing' });
  }

  if (apiKey !== process.env.API_ADMIN_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next(); // Key is valid → proceed to the route
};

export default apiKeyAuth;