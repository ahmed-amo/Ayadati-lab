# AI_INT — archived ML assets

This folder holds the **removed** anemia and diabetes prediction work from the Ayadati-lab (Brave Lab) Django app.

It is **not** part of the web application. The lab app no longer loads models or runs inference.

## Contents

- `model-anemia/` — logistic regression training scripts, datasets, `.pkl` models
- `model-diabete/` — diabetes prediction training scripts, datasets, `.pkl` models
- `readme.txt` — original short description
- `diabetes_guide.txt`, `new.py` — misc notes/scripts

## If you re-integrate later

Use a separate service or worker; do not embed `joblib` inference in Django request/signal paths unless you accept that operational cost.
