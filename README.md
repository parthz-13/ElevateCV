# ElevateCV

An AI-powered resume analysis tool built with FastAPI and React. Upload your resume PDF and get instant feedback on strengths, weaknesses, and actionable improvements.

## 🚀 Features

- **PDF Resume Upload** - Simple drag-and-drop interface
- **AI-Powered Analysis** - Using Groq's free LLM API (Llama 3.1 70B)
- **Structured Feedback** - Overall score, strengths, improvements, and recommendations
- **Fast & Free** - No cost, processes resumes in seconds

## 🛠️ Tech Stack

**Backend:**

- FastAPI (async Python web framework)
- Groq API (free LLM)
- PyPDF2 (PDF parsing)
- UV (package manager)

**Frontend:**

- React 18
- Vite (build tool)
- Axios (HTTP client)

## 📦 Installation

### Backend Setup

1. Install UV:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Setup backend:

```bash
cd backend
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -e .
```

3. Get Groq API key (FREE):

   - Visit https://console.groq.com
   - Sign up and create API key
   - Free tier: 30 req/min, 14,400 req/day

4. Configure:

```bash
cp .env.example .env
# Edit .env and add GROQ_API_KEY
```

5. Run:

```bash
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Run:

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

## 🎯 Usage

1. Start both backend and frontend
2. Open http://localhost:5173
3. Upload a PDF resume
4. Click "Analyze Resume"
5. View AI-generated feedback

## 📁 Project Structure

```
resume-review-ai/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── main.py          # API endpoints
│   │   ├── config.py        # Configuration
│   │   └── services/        # Business logic
│   └── pyproject.toml       # Dependencies
└── frontend/         # React frontend
    ├── src/
    │   ├── App.jsx          # Main component
    │   └── api.js           # API calls
    └── package.json
```

## 🔧 API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /analyze` - Analyze resume (accepts PDF)

Full API docs: http://localhost:8000/docs

## 🚀 Deployment

**Backend:** Deploy to Render, Railway, or fly.io
**Frontend:** Deploy to Vercel or Netlify

## 💡 Future Improvements

- Support for DOCX files
- Job description matching
- ATS (Applicant Tracking System) scoring
- Resume formatting suggestions
- Multiple language support
- Export analysis as PDF

## 📝 License

MIT

## 👨‍💻 Author

Built as a portfolio project to demonstrate:

- RESTful API design with FastAPI
- External API integration (Groq)
- File handling and parsing
- Modern frontend development
- Clean code architecture
