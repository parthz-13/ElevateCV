# ElevateCV - Backend

FastAPI backend for AI-powered resume analysis using Groq (free LLM API).

## Setup

### Prerequisites

- Python 3.10+
- UV package manager

### Installation

1. Install UV (if not already installed):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Create virtual environment and install dependencies:

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
```

3. Get Groq API Key (FREE):

   - Go to https://console.groq.com
   - Sign up (free tier: 30 requests/minute, 14,400/day)
   - Create API key

4. Configure environment:

```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

## Running

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

API will be available at: http://localhost:8000
API docs: http://localhost:8000/docs

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /analyze` - Upload PDF resume for analysis

## Tech Stack

- **FastAPI** - Modern async web framework
- **Groq** - Free, fast LLM API (Llama 3.1 70B)
- **PyPDF2** - PDF text extraction
- **UV** - Fast Python package manager
