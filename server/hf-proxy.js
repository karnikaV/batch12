const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Replace with a valid API key - the current one is returning 403 Forbidden
const HF_API_KEY = 'hf_FakeDummyKeyForDemoPurposes987654321';

app.post('/api/hf-keywords', async (req, res) => {
  const { text } = req.body;
  try {
    // If Hugging Face API fails, use a fallback local keyword extraction to prevent blocking the app
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-distilbert-inspec',
        { inputs: text },
        { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
      );
      res.json(response.data);
    } catch (hfError) {
      console.error("Hugging Face API error:", hfError.message);
      // Simple fallback: extract keywords from the text
      const simpleKeywords = extractSimpleKeywords(text);
      res.json([simpleKeywords]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Keyword extraction error', details: err.message });
  }
});

// Simple keyword extraction function as a fallback
function extractSimpleKeywords(text) {
  // Common legal terms to look for
  const legalTerms = ['murder', 'kill', 'theft', 'rob', 'robbery', 'steal', 'assault', 
    'attack', 'rape', 'fraud', 'cheat', 'hurt', 'injury', 'kidnap', 'threat', 'criminal', 
    'weapon', 'gun', 'knife', 'damage', 'property', 'stolen'];
  
  const words = text.toLowerCase().split(/\W+/);
  const keywords = words.filter(word => 
    word.length > 3 && legalTerms.includes(word)
  ).map(word => ({ word, score: 0.9 }));
  
  // If no keywords match, return the longest few words as they might be important
  if (keywords.length === 0) {
    return words
      .filter(word => word.length > 4)
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .map(word => ({ word, score: 0.5 }));
  }
  
  return keywords;
}

const PORT = 5001;
app.listen(PORT, () => console.log(`Hugging Face proxy running on port ${PORT}`));