from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models import get_sentiment_pipeline

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    sentiment: str
    confidence: float
    label_raw: str

LABEL_MAP = {
    "LABEL_0": "positif",
    "LABEL_1": "netral", 
    "LABEL_2": "negatif",
    "positive": "positif",
    "neutral": "netral",
    "negative": "negatif",
}

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_sentiment(request: AnalyzeRequest):
    # Validasi input
    if not request.text or len(request.text.strip()) < 3:
        raise HTTPException(status_code=400, detail="Teks terlalu pendek")
    
    if len(request.text) > 512:
        raise HTTPException(status_code=400, detail="Teks terlalu panjang (max 512 karakter)")
    
    try:
        pipeline = get_sentiment_pipeline()
        result = pipeline(request.text)[0]
        
        label_raw = result["label"]
        sentiment = LABEL_MAP.get(label_raw, label_raw.lower())
        confidence = round(result["score"] * 100, 1)
        
        return AnalyzeResponse(
            sentiment=sentiment,
            confidence=confidence,
            label_raw=label_raw
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saat analisis: {str(e)}")