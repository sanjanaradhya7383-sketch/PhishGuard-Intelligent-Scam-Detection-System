const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function analyzeWithAI(text, source, organisation) {
  try {
    const prompt = `
Analyze the message carefully. Even if text is partially corrupted, detect phishing intent.

Look for:
- urgency ("urgent", "blocked", "verify now")
- banking/financial context
- requests for action
- suspicious tone

If message resembles a phishing attempt, classify as High Risk.

Message:
"${text}"

Return ONLY JSON:

{
  "verdict": "Safe | Suspicious | High Risk",
  "confidence": number (0-100),
  "analysis": "short explanation",
  "redFlags": ["point1", "point2"]
}
`;

  const response = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  },
  {
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    timeout: 60000 // 🔥 IMPORTANT (inside config)
  }
);
    let output = response.data.choices[0].message.content;

// 🔥 CLEAN RESPONSE
output = output.replace(/```json/g, "")
               .replace(/```/g, "")
               .trim();

return JSON.parse(output);
  } catch (err) {
    console.log("AI ERROR:", err.response?.data || err.message);

    return {
      verdict: "Error",
      confidence: 0,
      analysis: "AI analysis failed",
      redFlags: []
    };
  }
}

module.exports = analyzeWithAI;
