const mongoose = require("mongoose");

const urlAnalysisSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  url: { type: String, required: true },
  source: String,
  organisation: String,
  verdict: String,
  riskScore: Number,
  reasons: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("UrlAnalysis", urlAnalysisSchema);