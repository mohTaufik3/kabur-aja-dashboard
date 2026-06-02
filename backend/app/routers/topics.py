from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter(prefix="/api/topics", tags=["BERTopic Results"])

@router.get("/summary")
def get_topics_summary():
    path = "data/topic_sentiment_bps.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File topic_sentiment_bps.csv tidak ditemukan. Jalankan run_bertopic_pipeline.py terlebih dahulu.")
    
    df = pd.read_csv(path)
    
    df = df.sort_values(by='total', ascending=False)
    
    return df.to_dict(orient="records")

@router.get("/by-category")
def get_topics_by_bps_category():
    path = "data/topic_sentiment_bps.csv"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File topic_sentiment_bps.csv tidak ditemukan.")
    
    df = pd.read_csv(path)
    
    summary = df.groupby('bps_category')['total'].sum().reset_index()
    return summary.to_dict(orient="records")