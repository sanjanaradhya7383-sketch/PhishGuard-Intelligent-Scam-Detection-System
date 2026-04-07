import { useState, useEffect, useRef } from "react";

function App() {

// 🔐 Auth
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

// 🧭 Navigation
const [currentPage, setCurrentPage] = useState("dashboard");

// 📥 Input
const [text, setText] = useState("");
const [image, setImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

// 📊 Result
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const resultRef = useRef(null);

// 🔥 ANALYZE (Unified)
const analyze = async () => {
if (!text && !image) {
alert("Enter text/URL or upload image");
return;
}

setLoading(true);

try {
  let response;

  if (image) {
    const formData = new FormData();
    formData.append("image", image);

    response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData
    });
  } else {
    response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
  }

  const data = await response.json();

  setResult(data);
  setCurrentPage("result");

} catch (err) {
  setResult({ verdict: "Error", riskScore: 0, analysis: "Server error" });
  setCurrentPage("result");
} finally {
  setLoading(false);
}


};

// 📸 Image Upload
const handleImageUpload = (e) => {
const file = e.target.files[0];
setImage(file);


if (file) {
  const reader = new FileReader();
  reader.onload = (e) => setImagePreview(e.target.result);
  reader.readAsDataURL(file);
}


};

// 🎨 Helpers
const getRiskColor = (score) => {
if (score >= 7) return "#ff4d6d";
if (score >= 4) return "#ffaa33";
return "#00f5d4";
};

const getVerdictColor = (v) => {
if (v === "High Risk" || v === "Suspicious") return "#ff4d6d";
if (v === "Moderate") return "#ffaa33";
return "#00f5d4";
};

const reset = () => {
setCurrentPage("dashboard");
setResult(null);
setText("");
setImage(null);
setImagePreview(null);
};

// 🔐 LOGIN SCREEN
if (!isLoggedIn) {
return ( <div style={authContainer}> <div style={authCard}> <h1 style={title}>🛡️ PhishGuard</h1>


      <input style={input} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input style={input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

      <button style={btn} onClick={() => setIsLoggedIn(true)}>Login</button>
    </div>
  </div>
);


}

return ( <div style={mainBg}> <h1>🛡️ PhishGuard</h1>

  {/* DASHBOARD */}
  {currentPage === "dashboard" && (
    <div style={scannerPage}>

      <input
        style={input}
        placeholder="Enter message or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input type="file" onChange={handleImageUpload} />

      <button style={analyzeBtn} onClick={analyze}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

    </div>
  )}

  {/* RESULT */}
  {currentPage === "result" && result && (
    <div style={resultPage}>
      <button style={backBtn} onClick={reset}>← Back</button>

      <div style={resultGrid}>

        {/* LEFT */}
        <div style={analysisCard}>
          <h2 style={sectionTitle}>AI Analysis</h2>

          <div style={analysisBox}>
            {result.analysis || "No analysis available"}
          </div>

          <div style={riskSection}>
            <p>Risk Level</p>

            <div style={riskBarContainer}>
              <div
                style={{
                  ...riskBar,
                  width: `${Math.min(result.riskScore * 10, 100)}%`,
                  background: getRiskColor(result.riskScore)
                }}
              />
            </div>
          </div>

          <div style={finalVerdict}>
            <p>Final Verdict</p>
            <h2 style={{ color: getVerdictColor(result.verdict) }}>
              {result.verdict}
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div style={inputCard}>
          <h3>Given Input</h3>

          <div style={givenInput}>
            {result.extractedText || text || "No input"}
          </div>

          {imagePreview && (
            <img src={imagePreview} alt="preview" style={previewImg} />
          )}
{/* 🔥 STEP 1: Detailed Analysis */}
{/* 🔥 STEP 2: Detailed Analysis (Styled) */}
<div style={{ marginTop: "20px" }}>
  <h3 style={{ color: "#00f5d4" }}>🔍 Detailed Analysis</h3>

  {/* AI BOX */}
  <div style={miniBox}>
    <h4>🧠 AI Engine</h4>
    <p>Verdict: {result.ai?.verdict}</p>
    <p>Confidence: {result.ai?.confidence}%</p>
  </div>

  {/* SCAM BOX */}
  <div style={miniBox}>
    <h4>📜 Scam Detection</h4>
    <p>Score: {result.scam?.score}</p>
  </div>

  {/* URL BOX */}
  {result.url && (
    <div style={miniBox}>
      <h4>🔗 URL Analysis</h4>
      <p>Score: {result.url.score}</p>
    </div>
  )}
</div>        </div>

      </div>
    </div>
  )}

</div>


);
}

/* 🎨 STYLES (YOUR STYLE PRESERVED) */

const mainBg = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0a1f2e, #0f3a4a, #1a5f6b)",
  color: "#e0f7f5",
  padding: "20px",
  fontFamily: "system-ui, sans-serif"
};

const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const title = {
  textAlign: "center",
  color: "#00f5d4",
  fontSize: "2.5rem",
  marginBottom: "10px",
  textShadow: "0 0 20px rgba(0,245,212,0.6)"
};
const logoutBtn = {
  padding: "10px 20px",
  background: "#ff4d6d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const historyBtn = {
  padding: "10px 20px",
  background: "#00f5d4",
  color: "#0a1f2e",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "12px"
};

const threatBtn = {
  padding: "10px 20px",
  background: "#ffaa33",
  color: "#0a1f2e",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "12px"
};

const dashboardContainer = { textAlign: "center", maxWidth: "900px", margin: "0 auto" };
const welcomeTitle = { color: "#00f5d4", marginBottom: "50px", fontSize: "1.8rem" };
const optionsGrid = { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" };

const bigCard = {
  background: "#132f3f",
  border: "2px solid #00f5d4",
  borderRadius: "20px",
  width: "320px",
  padding: "40px 25px",
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0, 245, 212, 0.15)"
};

const icon = { fontSize: "4rem", marginBottom: "20px" };

const scannerPage = {
  maxWidth: "720px",
  margin: "0 auto",
  background: "#132f3f",
  padding: "35px",
  borderRadius: "16px",
  border: "1px solid #00f5d4"
};

const backBtn = {
  padding: "8px 18px",
  background: "#1e4a5a",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginBottom: "25px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 245, 212, 0.3)"
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "2px solid #00f5d4",
  background: "#0a1f2e",
  color: "#e0f7f5",
  boxSizing: "border-box",
  fontSize: "16px"
};

const textarea = { ...input, height: "160px", resize: "vertical" };

const sourceSection = { margin: "20px 0" };
const label = { display: "block", marginBottom: "10px", color: "#00f5d4", fontWeight: "600" };
const checkboxGroup = { display: "flex", gap: "30px", flexWrap: "wrap" };
const checkboxLabel = { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "16px" };
const radioInput = { accentColor: "#00f5d4", width: "18px", height: "18px", cursor: "pointer" };

const fileInput = { margin: "10px 0" };

const analyzeBtn = {
  width: "100%",
  padding: "14px",
  background: "#00f5d4",
  color: "#0a1f2e",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
  opacity: 1
};

const resultPage = { maxWidth: "1100px", margin: "0 auto", padding: "30px" };
const resultGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" };

const analysisCard = {
  background: "linear-gradient(145deg, #132f3f, #0f2a38)",
  padding: "30px",
  borderRadius: "18px",
  border: "1px solid rgba(0,245,212,0.4)",
  boxShadow: "0 10px 40px rgba(0,245,212,0.15)",
  backdropFilter: "blur(6px)"
};
const riskSection = { margin: "25px 0" };
const riskBarContainer = {
  height: "22px",
  background: "#1e4a5a",
  borderRadius: "999px",
  overflow: "hidden",
  margin: "10px 0"
};
const riskBar = {
  height: "100%",
  borderRadius: "999px",
  transition: "width 0.8s ease",
  boxShadow: "0 0 12px currentColor"
};const riskLabels = { display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#a0e0d8" };

const reasonsContainer = { marginTop: "25px" };
const reasonTitle = { color: "#00f5d4", fontWeight: "600", marginBottom: "12px" };
const reasonItem = {
  padding: "12px",
  marginBottom: "10px",
  background: "rgba(0, 245, 212, 0.1)",
  borderRadius: "8px",
  borderLeft: "5px solid #00f5d4"
};

const orgInfo = {
  marginTop: "20px",
  padding: "14px",
  background: "rgba(0, 245, 212, 0.08)",
  borderRadius: "8px"
};

const finalVerdict = {
  marginTop: "30px",
  padding: "20px",
  background: "rgba(10, 31, 46, 0.9)",
  borderRadius: "12px",
  textAlign: "center",
  fontSize: "1.4rem",
  border: "1px solid #00f5d4"
};

const inputCard = {
  background: "linear-gradient(145deg, #132f3f, #0f2a38)",
  padding: "30px",
  borderRadius: "18px",
  border: "1px solid rgba(0,245,212,0.4)",
  boxShadow: "0 10px 40px rgba(0,245,212,0.15)",
  display: "flex",
  flexDirection: "column"
};
const givenInput = {
  background: "#0a1f2e",
  padding: "18px",
  borderRadius: "10px",
  border: "1px solid #00f5d4",
  wordBreak: "break-all",
  marginTop: "12px",
  minHeight: "140px"
};

const previewImg = { maxWidth: "100%", borderRadius: "10px", marginTop: "15px", border: "2px solid #00f5d4" };

const sectionTitle = { color: "#00f5d4", marginBottom: "20px", fontSize: "1.4rem" };

const historyPage = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#132f3f",
  padding: "30px",
  borderRadius: "16px",
  border: "1px solid #00f5d4"
};

const historyList = { display: "flex", flexDirection: "column", gap: "12px" };

const historyItem = {
  background: "#1e4a5a",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #00f5d4",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer"
};

const historyItemLeft = { display: "flex", alignItems: "center", gap: "12px" };
const historyItemRight = { display: "flex", alignItems: "center", gap: "15px" };

const reportBtn = {
  padding: "6px 14px",
  background: "#ff4d6d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem"
};

const reportBtnBig = {
  flex: 1,
  padding: "16px",
  background: "#ff4d6d",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer"
};
const miniBox = {
  background: "rgba(10, 31, 46, 0.8)",
  border: "1px solid rgba(0,245,212,0.3)",
  borderRadius: "14px",
  padding: "15px",
  marginTop: "12px",
  boxShadow: "0 5px 20px rgba(0,245,212,0.1)",
  transition: "all 0.3s ease"
};
const analysisBox = {
  background: "#0a1f2e",
  padding: "16px",
  borderRadius: "10px",
  marginBottom: "20px",
  lineHeight: "1.6",
  border: "1px solid #00f5d4"
};

const exportBtn = {
  flex: 1,
  padding: "16px",
  background: "#00f5d4",
  color: "#0a1f2e",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(10, 31, 46, 0.95)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContent = {
  background: "#132f3f",
  padding: "30px",
  borderRadius: "16px",
  border: "2px solid #00f5d4",
  maxWidth: "600px",
  width: "90%"
};

const threatList = { display: "flex", flexDirection: "column", gap: "12px" };

const threatItem = {
  padding: "14px",
  background: "rgba(255, 170, 51, 0.1)",
  borderRadius: "8px",
  borderLeft: "5px solid #ffaa33"
};

const closeBtn = {
  marginTop: "20px",
  padding: "12px 30px",
  background: "#ff4d6d",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const authContainer = { minHeight: "100vh", background: "linear-gradient(135deg, #0a1f2e, #0f3a4a)", display: "flex", justifyContent: "center", alignItems: "center" };
const authCard = { background: "rgba(10, 31, 46, 0.95)", padding: "40px", borderRadius: "16px", width: "380px", border: "2px solid #00f5d4", boxShadow: "0 0 40px rgba(0, 245, 212, 0.3)" };
const subTitle = { textAlign: "center", color: "#e0f7f5", marginBottom: "25px" };
const btn = { width: "100%", padding: "14px", background: "#00f5d4", color: "#0a1f2e", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px" };
const switchLink = { textAlign: "center", color: "#00f5d4", marginTop: "20px", cursor: "pointer", textDecoration: "underline" };

const authMsgStyle = (msg) => ({
  color: (msg.toLowerCase().includes("success") || msg.toLowerCase().includes("registered")) ? "#00f5d4" : "#ff4d6d",
  textAlign: "center",
  marginBottom: "15px"
});

export default App;