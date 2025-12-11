import pandas as pd

def preprocess_data(df):
    """
    Preprocesses the air quality dataframe by converting Date to datetime
    and extracting Year and Month.
    """
    df = df.copy()
    df['Date'] = pd.to_datetime(df['Date'])
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.month
    return df
