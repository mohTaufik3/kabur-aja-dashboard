from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze, bps, topics
from app.routers import sentiment_summary
from app.models import get_sentiment_pipeline
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="KaburAjaDulu Sentiment & BPS API",
    description="API untuk analisis sentimen, topik menggunakan IndoBERT & BERTopic, serta sinkronisasi data BPS",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")
app.include_router(bps.router)
app.include_router(topics.router)
app.include_router(sentiment_summary.router)

@app.on_event("startup")
async def startup_event():
    print("Server starting — loading IndoBERT model...")
    get_sentiment_pipeline()
    print("Model ready!")

@app.get("/")
def root():
    return {"message": "KaburAjaDulu Sentiment and BPS Integration API is running"}
