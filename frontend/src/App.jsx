import { useState, useEffect } from "react";
import { analyzeResume, checkHealth } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    checkHealth().then((health) => {
      setApiHealthy(health.status === "healthy" && health.api_configured);
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const selectedFile = e.dataTransfer.files[0];
    validateAndSetFile(selectedFile);
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

  useEffect(() => {
    if (result) {
      const resultsElement = document.querySelector(".results-container");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [result]);

  return (
    <div className="app">
      <div className="hero">
        <h1>
          Elevate your career with{" "}
          <span className="hero-highlight">AI-powered</span> resume insights.
        </h1>
        <p>
          Instant, intelligent feedback on your resume to help you stand out.
          Our AI analyzes your CV against industry standards.
        </p>
        {!apiHealthy && (
          <div className="warning-banner">
            ⚠️ Backend not configured - Add GROQ_API_KEY to proceed
          </div>
        )}
      </div>

      <div className="upload-container">
        <div
          className={`drop-zone ${isDragOver ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
            id="file-upload"
          />

          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <div className="drop-text">
            {file ? file.name : "Choose a file or drag & drop it here"}
          </div>
          <div className="drop-subtext">PDF formats, up to 5MB</div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="analyze-btn"
        >
          {loading ? "Analyzing Resume..." : "Analyze Resume"}
        </button>

        {loading && (
          <div className="loading-container">
            <span className="loader"></span>
            <p>Analyzing your resume... This may take a few seconds.</p>
          </div>
        )}

        {result && !loading && (
          <div
            className="success-message"
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: "#468d68ff",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Analysis generated! Scroll down to view your feedback.
          </div>
        )}

        {error && (
          <div className="error" style={{ marginTop: "20px" }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {result && (
        <div className="results-container">
          <div className="results-header">
            <h2>Analysis Results</h2>
          </div>
          <div className="results-content">{result.analysis}</div>
        </div>
      )}
    </div>
  );
}

export default App;
