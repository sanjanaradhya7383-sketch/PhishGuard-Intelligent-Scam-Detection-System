function analyzeScamText(text) {
  let riskScore = 0;
  let reasons = [];

  if (!text || typeof text !== "string") {
    return {
      verdict: "Invalid",
      riskScore: 10,
      reasons: ["Message is empty"]
    };
  }

  const msg = text.toLowerCase();

  // =========================
  // 🧠 1. SOCIAL ENGINEERING DETECTION
  // =========================

  const urgencyWords = ["urgent", "immediately", "action required", "now", "limited time"];
  urgencyWords.forEach(word => {
    if (msg.includes(word)) {
      riskScore += 2;
      reasons.push("Creates urgency: " + word);
    }
  });

  const pressureWords = ["click now", "call now", "act fast"];
  pressureWords.forEach(word => {
    if (msg.includes(word)) {
      riskScore += 2;
     reasons.push("Pressure tactic: " + word);
    }
  });

  // =========================
  // 💰 2. MONEY / PAYMENT SCAMS
  // =========================

  const paymentWords = ["pay", "fee", "registration", "processing fee", "deposit"];
  const jobWords = ["job", "hiring", "work from home", "employment"];

  let hasPayment = paymentWords.some(w => msg.includes(w));
  let hasJob = jobWords.some(w => msg.includes(w));

  if (hasPayment && hasJob) {
    riskScore += 6;
    reasons.push("Jobs rarely require upfront payment (common scam)");
  }

  // =========================
  // 🎁 3. PRIZE / LOTTERY SCAMS
  // =========================

  const prizeWords = ["won", "lottery", "prize", "reward", "gift", "free money"];
  prizeWords.forEach(word => {
    if (msg.includes(word)) {
      riskScore += 4;
      reasons.push("Unexpected reward detected: " + word);
    }
  });

  // =========================
  // 🔐 4. SENSITIVE DATA REQUEST
  // =========================

  const sensitiveWords = ["otp", "password", "cvv", "pin", "bank details"];
  sensitiveWords.forEach(word => {
    if (msg.includes(word)) {
      riskScore += 7;
      reasons.push("Requests sensitive information: " + word);
    }
  });

  // =========================
  // 🔗 5. LINK DETECTION
  // =========================

  if (msg.includes("http://") || msg.includes("https://")) {
    riskScore += 3;
    reasons.push("Contains a link");
  }

  // =========================
  // ❗ 6. FORMATTING ANOMALIES
  // =========================

  if ((msg.match(/!/g) || []).length > 2) {
    riskScore += 2;
    reasons.push("Too many exclamation marks");
  }

  if ((msg.match(/[A-Z]/g) || []).length > 10) {
    riskScore += 1;
    reasons.push("Excessive capital letters");
  }

  // =========================
  // 🧠 7. GENERIC TRUST RULES (YOUR IDEA CORE)
  // =========================

  if (hasPayment && msg.includes("account")) {
    riskScore += 5;
    reasons.push("Payment request linked with account action");
  }

  if (msg.includes("verify") && msg.includes("account")) {
    riskScore += 3;
    reasons.push("Account verification request (phishing pattern)");
  }

  // =========================
  // 🧠 8. ORGANIZATION-AWARE (GENERIC)
  // =========================

  const orgKeywords = ["google", "amazon", "bank", "paypal", "upi", "phonepe"];

  orgKeywords.forEach(org => {
    if (msg.includes(org) && hasPayment) {
      riskScore += 5;
      reasons.push(`${org.toUpperCase()} related payment request (suspicious)`);
    }
  });

  // =========================
  // 🎯 FINAL VERDICT LOGIC
  // =========================

  let verdict = "Safe";

  if (riskScore >= 12) verdict = "High Risk";
  else if (riskScore >= 7) verdict = "Suspicious";
  else if (riskScore >= 4) verdict = "Moderate";

  if (riskScore === 0) {
    reasons.push("No suspicious patterns");
  }

  return {
    verdict,
    riskScore,
    reasons
  };
}

module.exports = analyzeScamText;