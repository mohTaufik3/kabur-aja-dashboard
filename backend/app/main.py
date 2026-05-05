from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze
from app.models import get_sentiment_pipeline
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="KaburAjaDulu Sentiment API",
    description="API untuk analisis sentimen dan topik menggunakan IndoBERT",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    print("Server starting — loading IndoBERT model...")
    get_sentiment_pipeline()
    print("Model ready!")

@app.get("/")
def root():
    return {"message": "KaburAjaDulu Sentiment API is running"}