# Troubleshooting Guide

This guide covers common issues you might encounter while setting up or running the **Air Quality Analysis and Forecasting** project. It includes solutions for installation, data handling, and model training.

---

## 1. Environment & Installation Issues

### **Issue: `pip install prophet` fails**
**Symptoms**:
- "Microsoft Visual C++ 14.0 or greater is required" error.
- Long build process that eventually errors out.
- `cmdstanpy` errors.

**Solution**:
`Prophet` depends on `pystan`, which requires a C++ compiler. 
1. **Easy Fix**: Use `conda` if available:
   ```bash
   conda install -c conda-forge prophet
   ```
2. **Pip Fix**: 
   - Install the **C++ Build Tools** from the [Visual Studio Installer](https://visualstudio.microsoft.com/visual-cpp-build-tools/). Select "Desktop development with C++".
   - Retry installation: `pip install prophet`

### **Issue: `ImportError: cannot import name 'Prophet'`**
**Symptoms**:
- You are using an older notebook that uses `from fbprophet import Prophet`.

**Solution**:
- The library was renamed. Update your import statement:
  ```python
  # Old
  from fbprophet import Prophet
  
  # New
  from prophet import Prophet
  ```
- If you are forced to use legacy code, install the old version (not recommended): `pip install fbprophet`.

### **Issue: TensorFlow Installation / DLL Load Failed**
**Symptoms**:
- `ImportError: DLL load failed while importing _pywrap_tensorflow_internal`.
- "This system is not compatible with this version of TensorFlow."

**Solution**:
- **Check Python Version**: TensorFlow often lags behind the latest Python release. Ensure you are using Python 3.8 - 3.11 (check official docs for latest matrix).
- **Missing DLLs**: Install [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist).
- **CPU only**: If you don't have a dedicated GPU or don't want to configure CUDA, install the CPU version explicitly (though usually standard package covers both now, some versions are split).

---

## 2. Data Issues

### **Issue: `FileNotFoundError: [Errno 2] No such file or directory: './datasets/city_day.csv'`**
**Symptoms**:
- Notebook cells fail immediately when reading the CSV.

**Solution**:
- The project expects the dataset to be in a specific relative path.
- **Check Path**: Ensure you have a folder named `datasets` in the root of the project.
- **Check Filename**: Ensure the file is named exactly `city_day.csv` (case sensitive on some OS).
- **Download**: If missing, download it from [Kaggle](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india) or the internal source.

### **Issue: Missing Columns or `KeyError`**
**Symptoms**:
- `KeyError: 'PM2.5'` when accessing dataframe columns.

**Solution**:
- **Verify Header**: Open the CSV to ensure headers match.
- **Whitespace**: Sometimes columns have trailing spaces (e.g., `"PM2.5 "`). Clean them:
  ```python
  df.columns = df.columns.str.strip()
  ```

---

## 3. Model Training & Execution Issues

### **Issue: SARIMA Grid Search Taking Too Long**
**Symptoms**:
- The cell running the grid search (`itertools.product` loop) runs for hours without output.

**Solution**:
- **Reduce Search Space**: Limit the `p`, `d`, `q` ranges. For example, change `range(0, 3)` to `range(0, 2)`.
- **Parallelize**: Use `joblib` library to run iterations in parallel (requires code modification).
- **Use Auto-ARIMA**: Consider using `pmdarima.auto_arima` which is optimized to find parameters faster.

### **Issue: LSTM Loss is NaN**
**Symptoms**:
- Training loss shows `nan`.

**Solution**:
- **Data Scaling**: Neural networks are sensitive to input scale. Ensure you have applied `MinMaxScaler` or `StandardScaler` to your data before feeding it to the LSTM.
- **Exploding Gradients**: Clip gradients during training or reduce the learning rate.
- **Missing Values**: Ensure `NaN`s are dropped or imputed (`df.fillna()`) before scaling.

### **Issue: "ConvergenceWarning" in SARIMA**
**Symptoms**:
- `Maximum Likelihood optimization failed to converge.`

**Solution**:
- **Increase MaxIter**: Increase the `maxiter` parameter in the `.fit()` call.
- **Simplify Model**: The requested `(p,d,q)` order might be too complex for the data. Try reducing the order.
- **Data Quality**: Ensure data is stationary (d=1 usually helps).

---

## 4. Jupyter / Notebook Issues

### **Issue: Kernel Died / restart on import**
**Symptoms**:
- The kernel crashes as soon as you import `tensorflow` or `prophet`.

**Solution**:
- **Library Conflict**: You might have conflicting versions of numpy, scipy, or others.
- **Reinstall**: Create a clean virtual environment and re-install dependencies from scratch.
  ```bash
  python -m venv new_env
  source new_env/bin/activate  # or .\new_env\Scripts\activate
  pip install -r requirements.txt
  ```

### **Issue: Widgets/Progress Bars Not Showing**
**Symptoms**:
- `tqdm` or Prophet training bars format weirdly or don't show.

**Solution**:
- Install widget extensions:
  ```bash
  pip install ipywidgets
  jupyter nbextension enable --py widgetsnbextension
  ```

---

## 5. General Tips

- **Relative Paths**: Always run Jupyter from the root of the project directory so that `./datasets/...` resolves correctly.
- **Memory**: LSTM models can be memory intensive. If you get MemoryErrors, reduce the `batch_size`.
- **Reproducibility**: If your results change every run, set the random seed for numpy and tensorflow at the start of your notebook:
  ```python
  import numpy as np
  import tensorflow as tf
  np.random.seed(42)
  tf.random.set_seed(42)
  ```
