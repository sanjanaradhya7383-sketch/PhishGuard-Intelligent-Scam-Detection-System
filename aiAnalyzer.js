const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function analyzeWithAI(text, source, organisation) {
  try {
    const prompt = `
You are an advanced cybersecurity analyst AI.

Analyze the message and classify it as Safe, Suspicious, or High Risk.

Think deeply:
- Does this scenario make sense?
- Is there urgency, pressure, or manipulation?
- Is sensitive info requested?
- Is the communication realistic?

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
        }
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