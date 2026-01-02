import { useState, useEffect } from "react";
import { analyzeResume, checkHealth } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(false);

  useEffect(() => {
    checkHealth().then((health) => {
      setApiHealthy(health.status === "healthy" && health.api_configured);
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    if (!apiHealthy) {
      setError(
        "Backend API is not configured. Please check GROQ_API_KEY in backend .env file."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeResume(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>📄 ElevateCV</h1>
        <p>Get instant AI-powered feedback on your resume</p>
        {!apiHealthy && (
          <p style={{ color: "#ffeb3b", marginTop: "10px" }}>
            ⚠️ Backend not configured - Add GROQ_API_KEY to proceed
          </p>
        )}
      </div>

      <div className="card">
        <div className="upload-section">
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="upload-btn"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
          {file && (
            <p style={{ marginTop: "10px", color: "#666" }}>
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing your resume... This may take a few seconds.</p>
          </div>
        )}

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="results">
            <h2>Analysis Results</h2>
            <div className="analysis-content">{result.analysis}</div>
            <div className="metadata">
              <p>
                <strong>Filename:</strong> {result.filename}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
