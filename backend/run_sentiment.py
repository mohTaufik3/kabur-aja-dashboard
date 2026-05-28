import pandas as pd
from transformers import pipeline
import torch
from tqdm import tqdm

device = 0 if torch.cuda.is_available() else -1
print(f"Device: {'GPU' if device == 0 else 'CPU'}")

print("Loading IndoBERT model...")
sentiment_pipeline = pipeline(
    task="text-classification",
    model="mdhugol/indonesia-bert-sentiment-classification",
    tokenizer="mdhugol/indonesia-bert-sentiment-classification",
    device=device,
    truncation=True,
    max_length=512
)
print("Model loaded!")

LABEL_MAP = {
    "LABEL_0": "positif",
    "LABEL_1": "netral",
    "LABEL_2": "negatif",
}

df = pd.read_csv("data/cleaned_data.csv")
print(f"Data loaded: {len(df)} baris")

texts = df["clean_text"].tolist()
results = []
batch_size = 32

print(f"Memproses {len(texts)} teks...")

for i in tqdm(range(0, len(texts), batch_size)):
    batch = texts[i:i + batch_size]
    try:
        outputs = sentiment_pipeline(batch, truncation=True, max_length=512)
        for out in outputs:
            results.append({
                "sentiment": LABEL_MAP.get(out["label"], out["label"].lower()),
                "confidence": round(out["score"] * 100, 2)
            })
    except Exception as e:
        print(f"Error di batch {i}: {e}")
        for _ in batch:
            results.append({"sentiment": "netral", "confidence": 0.0})

df["sentiment"] = [r["sentiment"] for r in results]
df["confidence"] = [r["confidence"] for r in results]

df.to_csv("data/sentiment_results.csv", index=False)

print("\nDistribusi sentimen:")
print(df["sentiment"].value_counts().to_string())
print(f"\nRata-rata confidence: {df['confidence'].mean():.2f}%")
print(df.groupby(["platform", "sentiment"]).size().to_string())