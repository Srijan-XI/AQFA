# Test Report

**Date:** 2025-12-08
**Project:** Air Quality Analysis Forecasting
**Test Suite:** Data Preprocessing Tests

## Summary
- **Total Tests:** 2
- **Passed:** 2
- **Failed:** 0
- **Status:** PASS

## Test Execution Details
The following tests were executed using `pytest`:

1. `tests/test_data_preprocessing.py::test_preprocess_data`: **PASSED**
   - Verifies that data frame is correctly preprocessed (Date conversion, Year/Month extraction).
2. `tests/test_data_preprocessing.py::test_preprocess_data_empty`: **PASSED**
   - Verifies handling of empty dataframes.

## Raw Output
```text
============================= test session starts =============================
platform win32 -- Python 3.13.10, pytest-8.3.5, pluggy-1.6.0 -- C:\Users\srija\AppData\Local\Programs\Python\Python313\python.exe
cachedir: .pytest_cache
rootdir: P:\CODE-XI\AI Projects\air-quality-analysis-forecasting
plugins: anyio-3.7.1, dash-3.2.0, timeout-2.4.0
collecting ... collected 2 items

tests/test_data_preprocessing.py::test_preprocess_data PASSED            [ 50%]
tests/test_data_preprocessing.py::test_preprocess_data_empty PASSED      [100%]

============================== 2 passed in 0.51s ==============================
```
