from transformers import pipeline
import os

_sentiment_pipeline = None

def get_sentiment_pipeline():
    global _sentiment_pipeline
    
    if _sentiment_pipeline is None:
        print("Loading IndoBERT model... (ini mungkin butuh beberapa menit pertama kali)")
        model_name = os.getenv("MODEL_NAME", "indobenchmark/indobert-base-p1")
        
        _sentiment_pipeline = pipeline(
            task="text-classification",
            model="mdhugol/indonesia-bert-sentiment-classification",
            tokenizer="mdhugol/indonesia-bert-sentiment-classification"
        )
        print("Model loaded successfully!")
    
    return _sentiment_pipeline