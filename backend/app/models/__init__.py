from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

_sentiment_pipeline = None

LABEL_MAP = {
    'LABEL_0': 'negatif',
    'LABEL_1': 'netral',
    'LABEL_2': 'positif',
}

def get_sentiment_pipeline():
    global _sentiment_pipeline

    if _sentiment_pipeline is None:
        print("Loading IndoBERT model...")

        BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
        MODEL_PATH = os.path.join(BASE_DIR, "../../model_indobert_finetuned")

        if os.path.exists(MODEL_PATH):
            print(f"Memuat model fine-tuned dari: {MODEL_PATH}")
            _sentiment_pipeline = pipeline(
                task      = "text-classification",
                model     = MODEL_PATH,
                tokenizer = MODEL_PATH,
                device    = 0 if torch.cuda.is_available() else -1,
            )
        else:
            print("Model fine-tuned tidak ditemukan, fallback ke mdhugol...")
            _sentiment_pipeline = pipeline(
                task      = "text-classification",
                model     = "mdhugol/indonesia-bert-sentiment-classification",
                tokenizer = "mdhugol/indonesia-bert-sentiment-classification",
            )

        print("Model loaded successfully!")

    return _sentiment_pipeline

def predict_sentiment(text: str) -> dict:
    pipe = get_sentiment_pipeline()
    result = pipe(text, truncation=True, max_length=128)[0]

    label_raw = result['label']
    score     = result['score']

    label = LABEL_MAP.get(label_raw, label_raw.lower())

    return {
        'sentiment':  label,
        'confidence': round(score * 100, 2),
        'raw_label':  label_raw,
    }