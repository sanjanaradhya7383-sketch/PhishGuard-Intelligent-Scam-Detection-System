function analyzeURL(url) {
  let riskScore = 0;
  let reasons = [];

  // =========================
  // ❌ INVALID URL CHECK
  // =========================
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (err) {
    return {
      verdict: "Invalid",
      riskScore: 10,
      reasons: ["Invalid URL format"]
    };
  }

  const hostname = parsedUrl.hostname.replace("www.", "").toLowerCase();

  // =========================
  // 🧠 TRUSTED DOMAINS (VERY IMPORTANT)
  // =========================
  const trustedDomains = [
    "google.com",
    "amazon.in",
    "amazon.com",
    "github.com",
    "wikipedia.org",
    "stackoverflow.com"
  ];

  const isTrusted = trustedDomains.some(domain =>
    hostname === domain || hostname.endsWith("." + domain)
  );

  // =========================
  // 🔐 HTTPS CHECK
  // =========================
  if (!url.startsWith("https://")) {
    riskScore += 2;
    reasons.push("Uses HTTP (not secure)");
  }

  // =========================
  // 🌐 IP ADDRESS CHECK
  // =========================
  const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(hostname)) {
    riskScore += 4;
    reasons.push("Uses IP address instead of domain");
  }

  // =========================
  // 📛 TOO MANY SUBDOMAINS
  // =========================
  const parts = hostname.split(".");
  if (parts.length > 3) {
    riskScore += 2;
    reasons.push("Too many subdomains");
  }

  // =========================
  // 🔤 NUMBER SPOOFING CHECK
  // =========================
  if (/\d/.test(hostname) && !isTrusted) {
    riskScore += 2;
    reasons.push("Domain contains numbers (possible spoofing)");
  }

  // =========================
  // 🚨 SUSPICIOUS KEYWORDS
  // =========================
  const suspiciousWords = ["login", "verify", "secure", "update", "account"];
  suspiciousWords.forEach(word => {
    if (url.toLowerCase().includes(word)) {
      riskScore += 2;
      reasons.push(`Suspicious keyword: ${word}`);
    }
  });

  // =========================
  // 🧠 BRAND IMPERSONATION CHECK (SMART FIX)
  // =========================
  const brands = ["google", "amazon", "paypal", "bank", "facebook"];

  if (!isTrusted) {
    brands.forEach(brand => {
      if (hostname.includes(brand)) {
        riskScore += 3;
        reasons.push(`Possible impersonation of ${brand}`);
      }
    });
  }

  // =========================
  // 🎯 FINAL VERDICT
  // =========================
  let verdict = "Safe";

  if (riskScore >= 10) verdict = "High Risk";
  else if (riskScore >= 6) verdict = "Suspicious";
  else if (riskScore >= 3) verdict = "Moderate";

  if (riskScore === 0) {
    reasons.push("No suspicious patterns");
  }

  return {
    verdict,
    riskScore,
    reasons
  };
}

module.exports = analyzeURL;