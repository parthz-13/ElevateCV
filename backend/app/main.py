from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from app.config import settings
from app.services.pdf_parser import PDFParser
from app.services.ai_service import AIAnalyzer

app = FastAPI(
    title="ElevateCV",
    description="AI-powered resume analysis API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "https://elevate-cv-seven.vercel.app",
        "https://elevate-cv-seven.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pdf_parser = PDFParser()
ai_analyzer = AIAnalyzer()

@app.get("/")
async def root():
    return {
        "message": "Resume Review AI API",
        "endpoints": {
            "POST /analyze": "Upload and analyze a resume (PDF only)",
            "GET /health": "Health check endpoint"
        }
    }

@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "healthy", "api_configured": bool(settings.GROQ_API_KEY)}

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Analyze a resume PDF file.
    
    Returns:
        JSON with analysis results
    """
    

    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    

    try:
        file_content = await file.read()
        

        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024)}MB"
            )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read file: {str(e)}"
        )
    

    try:
        resume_text = pdf_parser.extract_text(file_content)
        
        if not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. Please ensure the PDF contains selectable text."
            )
            
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )
    

    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="AI service not configured. Please set GROQ_API_KEY."
        )
    
    result = ai_analyzer.analyze_resume(resume_text)
    
    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Analysis failed")
        )
    
    return JSONResponse(content={
        "filename": file.filename,
        "analysis": result["analysis"],
        "model": result["model_used"]
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
