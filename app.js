const analyzeScamText = require("./scamAnalyzer");
require("dotenv").config();
const analyzeWithAI = require("./aiAnalyzer");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const checkWithGoogle = require("./googleSafeCheck");
const analyzeURL = require("./urlAnalyzer");

const app = express();

// =========================
// 🔗 URL EXTRACTOR
// =========================
function extractUrl(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches ? matches[0] : null;
}

// =========================
// 📁 FILE UPLOAD
// =========================
const upload = multer({ dest: "uploads/" });

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
// DATABASE
// =========================
mongoose.connect("mongodb://127.0.0.1:27017/phishguard")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// =========================
// ROOT
// =========================
app.get("/", (req, res) => {
  res.send("Backend working");
});

// =========================
// 🧠 UNIFIED ANALYSIS ROUTE
// =========================
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    let text = req.body.text || "";

    // =========================
    // 📸 IMAGE → OCR
    // =========================
    if (req.file) {
      const { data: { text: extracted } } = await Tesseract.recognize(
        req.file.path,
        "eng"
      );
      text = extracted;
    }

    // =========================
    // ❌ INVALID INPUT
    // =========================
    if (!text || text.trim() === "") {
      return res.json({
        verdict: "Invalid",
        riskScore: 10,
        reasons: ["Provide text, URL, or image"]
      });
    }

    // =========================
    // 🧠 AI + SCAM ANALYSIS
    // =========================
    const aiResult = await analyzeWithAI(text, "", "");
    const scamResult = analyzeScamText(text);

    let result = {
      verdict: "Analyzing",

      // 🔥 AI fallback safety
      riskScore:
        aiResult.verdict === "Error"
          ? 3
          : Math.round((aiResult.confidence / 100) * 10),

      // 🧠 AI OUTPUT
      analysis: aiResult.analysis,
      redFlags: aiResult.redFlags || [],

      // 🔥 AI DETAILS
      ai: {
        verdict: aiResult.verdict,
        confidence: aiResult.confidence
      },

      // 📜 SCAM RULES
      scam: {
        score: scamResult.riskScore,
        reasons: scamResult.reasons
      },

      // 📊 CLEAN REASONS
      reasons: [
        ...(aiResult.redFlags || [])
      ]
    };

    // =========================
    // 🔥 ADD SCAM SCORE
    // =========================
    result.riskScore += scamResult.riskScore;

    result.reasons = [
      ...new Set([
        ...result.reasons,
        ...scamResult.reasons
      ])
    ];

    // =========================
    // 🔗 URL EXTRACTION + CHECK
    // =========================
    const extractedUrl = extractUrl(text);

    if (extractedUrl) {
      const urlResult = analyzeURL(extractedUrl);

      // 🔗 STORE URL DETAILS
      result.url = {
        score: urlResult.riskScore,
        reasons: urlResult.reasons
      };

      result.riskScore += urlResult.riskScore;

      result.reasons = [
        ...new Set([
          ...result.reasons,
          "Contains URL",
          ...urlResult.reasons
        ])
      ];

      const google = await checkWithGoogle(extractedUrl);

      if (google.isMalicious) {
        result.riskScore += 5;
        result.reasons.push("Google flagged URL");
      }
    }

    // =========================
    // 🔥 LIMIT MAX SCORE
    // =========================
    if (result.riskScore > 15) {
      result.riskScore = 15;
    }

    // =========================
    // 🎯 FINAL VERDICT
    // =========================
    // =========================
// 🎯 FINAL VERDICT (AI PRIORITY)
// =========================

// 🔥 LIMIT MAX SCORE
if (result.riskScore > 15) {
  result.riskScore = 15;
}

// 🧠 AI PRIMARY DECISION
if (aiResult.verdict === "Safe") {
  result.verdict = "Safe";
  result.riskScore = Math.min(result.riskScore, 3);
}
else if (aiResult.verdict === "High Risk") {
  result.verdict = "High Risk";
  result.riskScore = Math.max(result.riskScore, 10);
}
else {
  if (result.riskScore >= 12) result.verdict = "High Risk";
  else if (result.riskScore >= 7) result.verdict = "Suspicious";
  else if (result.riskScore >= 4) result.verdict = "Moderate";
  else result.verdict = "Safe";
}    // =========================
    // ✅ RESPONSE
    // =========================
    res.json({
      extractedText: text,
      ...result
    });

  } catch (err) {
    console.error(err);
    res.json({
      verdict: "Error",
      riskScore: 0,
      reasons: ["Server error"]
    });
  }
});

// =========================
// 🚀 START SERVER
// =========================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});