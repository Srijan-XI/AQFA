import pytest
import pandas as pd
import sys
import os

# Add src to sys.path to ensure we can import the module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from data_preprocessing import preprocess_data

def test_preprocess_data():
    data = {
        'Date': ['2015-01-01', '2016-02-01'],
        'Value': [10, 20]
    }
    df = pd.DataFrame(data)
    
    processed_df = preprocess_data(df)
    
    assert pd.api.types.is_datetime64_any_dtype(processed_df['Date'])
    assert 'Year' in processed_df.columns
    assert 'Month' in processed_df.columns
    assert processed_df['Year'].iloc[0] == 2015
    assert processed_df['Month'].iloc[0] == 1
    assert processed_df['Year'].iloc[1] == 2016
    assert processed_df['Month'].iloc[1] == 2

def test_preprocess_data_empty():
    data = {
        'Date': [],
        'Value': []
    }
    df = pd.DataFrame(data)
    processed_df = preprocess_data(df)
    assert processed_df.empty
    assert 'Year' in processed_df.columns
    assert 'Month' in processed_df.columns
