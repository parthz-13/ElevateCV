from groq import Groq
from app.config import settings

class AIAnalyzer:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.1-70b-versatile"  # Free tier model
    
    def analyze_resume(self, resume_text: str) -> dict:
        """Analyze resume using Groq AI."""
        
        prompt = f"""You are an expert resume reviewer. Analyze the following resume and provide a structured review.

Resume Content:
{resume_text}

Provide your analysis in the following format:

OVERALL SCORE: [Score from 1-10]

STRENGTHS:
- [Strength 1]
- [Strength 2]
- [Strength 3]

AREAS FOR IMPROVEMENT:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

KEY RECOMMENDATIONS:
[2-3 sentences of actionable advice]

Keep your analysis concise, specific, and actionable."""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an experienced HR professional and resume expert. Provide honest, constructive feedback."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1024,
            )
            
            analysis = chat_completion.choices[0].message.content
            
            return {
                "success": True,
                "analysis": analysis,
                "model_used": self.model
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"AI analysis failed: {str(e)}"
            }
