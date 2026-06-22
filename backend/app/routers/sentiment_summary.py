from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter(prefix="/api/sentiment", tags=["Sentiment Summary"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESEARCH_DATA = os.path.join(BASE_DIR, "../../../research/data")

@router.get("/summary")
def get_sentiment_summary():
    df = pd.read_csv(os.path.join(RESEARCH_DATA, "output/sentiment_results.csv"))

    total = len(df)
    counts = df['sentiment'].value_counts().to_dict()

    platform_sentiment = (
        df.groupby(['platform', 'sentiment'])
        .size()
        .unstack(fill_value=0)
        .reset_index()
    )
    platform_list = []
    for _, row in platform_sentiment.iterrows():
        platform_list.append({
            'platform': 'Platform X' if row['platform'] == 'X' else row['platform'],
            'negatif':  int(row.get('negatif', 0)),
            'netral':   int(row.get('netral', 0)),
            'positif':  int(row.get('positif', 0)),
        })

    platform_counts = df['platform'].value_counts().to_dict()

    return {
        'total':           total,
        'negatif':         int(counts.get('negatif', 0)),
        'netral':          int(counts.get('netral', 0)),
        'positif':         int(counts.get('positif', 0)),
        'platform':        platform_list,
        'platform_counts': {
            'X':      int(platform_counts.get('X', 0)),
            'TikTok': int(platform_counts.get('TikTok', 0)),
        }
    }

@router.get("/timeline")
def get_sentiment_timeline():
    df = pd.read_csv(os.path.join(RESEARCH_DATA, "output/sentiment_results.csv"))

    df['created_at'] = pd.to_datetime(
        df['created_at'],
        format='%a %b %d %H:%M:%S +0000 %Y',
        errors='coerce'
    )

    # Hanya data X yang punya timestamp
    df_x = df[df['created_at'].notna()].copy()
    df_x['bulan'] = df_x['created_at'].dt.strftime('%b %y')

    MONTH_ORDER = [
        'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24',
        'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25',
        'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25',
        'Nov 25', 'Dec 25'
    ]

    grouped = (
        df_x.groupby('bulan')['sentiment']
        .value_counts()
        .unstack(fill_value=0)
        .reset_index()
    )

    result = []
    for month in MONTH_ORDER:
        row = grouped[grouped['bulan'] == month]
        if not row.empty:
            result.append({
                'bulan':   month,
                'negatif': int(row.get('negatif', pd.Series([0])).values[0]),
                'netral':  int(row.get('netral',  pd.Series([0])).values[0]),
                'positif': int(row.get('positif', pd.Series([0])).values[0]),
            })

    return result

@router.get("/samples")
def get_sentiment_samples():
    df = pd.read_csv(os.path.join(RESEARCH_DATA, "output/sentiment_results.csv"))
    df = df[df['clean_text'].notna() & (df['clean_text'].str.strip() != '')]

    samples = []
    for sentiment in ['negatif', 'netral', 'positif']:
        subset = df[df['sentiment'] == sentiment].sample(
            n=min(3, len(df[df['sentiment'] == sentiment])),
            random_state=42
        )
        for _, row in subset.iterrows():
            samples.append({
                'text':      str(row['clean_text']),
                'sentiment': sentiment,
                'platform':  str(row['platform']),
            })

    return samples
@router.get("/evaluation")
def get_evaluation_results():
    import json
    path = os.path.join(RESEARCH_DATA, "output/evaluation_results.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File evaluation_results.json tidak ditemukan.")
    with open(path, 'r') as f:
        data = json.load(f)
    return data

@router.get("/samples/refresh")
def get_sentiment_samples_refresh():
    import random
    df = pd.read_csv(os.path.join(RESEARCH_DATA, "output/sentiment_results.csv"))
    df = df[df['clean_text'].notna() & (df['clean_text'].str.strip() != '')]

    samples = []
    for sentiment in ['negatif', 'netral', 'positif']:
        subset = df[df['sentiment'] == sentiment]
        n = min(3, len(subset))
        picked = subset.sample(n=n, random_state=random.randint(0, 99999))
        for _, row in picked.iterrows():
            samples.append({
                'text':      str(row['clean_text']),
                'sentiment': sentiment,
                'platform':  str(row['platform']),
            })

    return samples
