from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.utils import resample
from sklearn.preprocessing import MinMaxScaler
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score, roc_auc_score
import logging as log
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Use an absolute path to the CSV file
file_path = os.path.join(os.path.dirname(__file__), 'water_potability.csv')
df = pd.read_csv(file_path)

# Fill NaN values with the mean of each column
df.fillna(df.mean(numeric_only=True), inplace=True)

# Remove duplicate rows
df_cleaned = df.drop_duplicates()

# Initial filtering based on 'ph' values
indices = df_cleaned.index[((df_cleaned['ph'] >= 13) | (df_cleaned['ph'] <= 1)) & (df_cleaned['Potability'] == 1)].tolist()
df_cleaned = df_cleaned.drop(indices)

# Multiply all values in the 'Solids' column by 100 for the mistake done by data owner
df_cleaned['Solids'] = df_cleaned['Solids'] / 100

# Filter rows where Potability is 1
df_potable = df_cleaned[df_cleaned['Potability'] == 1]

# Initialize a list to collect indices of outliers
outlier_indices = []
# Loop through each column to detect outliers
for column in df_potable.columns[:-1]:  # Exclude the 'Potability' column
    # Calculate IQR for the column
    Q1 = df_potable[column].quantile(0.25)
    Q3 = df_potable[column].quantile(0.75)
    IQR = Q3 - Q1
    
    # Define outlier bounds
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    # Find outlier indices for this column
    column_outliers = df_potable.index[(df_potable[column] < lower_bound) | (df_potable[column] > upper_bound)].tolist()
    
    # Add these indices to the outlier_indices list
    outlier_indices.extend(column_outliers)
# Remove duplicates from outlier_indices
outlier_indices = list(set(outlier_indices))
# Drop the rows with outlier indices
df_cleaned = df_cleaned.drop(outlier_indices)

# Remove duplicates and fill NaN values
df_cleaned = df_cleaned.drop_duplicates()
df_cleaned.fillna(df_cleaned.mean(numeric_only=True), inplace=True)

# Calculate average values for each feature
averages = df_cleaned.mean()

# Separate majority and minority classes
df_majority = df_cleaned[df_cleaned['Potability'] == 0]
df_minority = df_cleaned[df_cleaned['Potability'] == 1]

# Downsample majority class and upsample minor class
df_minority_upsampled = resample(df_minority, replace=True, n_samples=2000, random_state=100)
df_majority_downsampled = resample(df_majority, replace=True, n_samples=2000, random_state=100)

# Combine minor class with downsampled major class
df_balanced = pd.concat([df_minority_upsampled, df_majority_downsampled])

# Define X and y
X = df_balanced.drop('Potability', axis=1)
y = df_balanced['Potability']

# Apply log transformation only to features
X_log_transformed = np.log1p(X)

# Apply SMOTE to the features
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_log_transformed, y)

# Scale the features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X_resampled)

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_resampled, test_size=0.2, random_state=42)

# Train models
# Hyperparameter tuning for RandomForestClassifier
rf = RandomForestClassifier(random_state=42)
rf_params = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2]
}

grid_rf = GridSearchCV(rf, rf_params, cv=3, n_jobs=-1, verbose=1)
grid_rf.fit(X_train, y_train)
best_rf = grid_rf.best_estimator_
rf_predictions = best_rf.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_predictions)
rf_roc_auc = roc_auc_score(y_test, best_rf.predict_proba(X_test)[:, 1])

# Hyperparameter tuning for XGBClassifier
xgb = XGBClassifier(random_state=42)
xgb_params = {
    'n_estimators': [100, 200],
    'max_depth': [3, 5],
    'learning_rate': [0.01, 0.1],
    'subsample': [0.8, 0.9]
}

grid_xgb = GridSearchCV(xgb, xgb_params, cv=3, n_jobs=-1, verbose=1)
grid_xgb.fit(X_train, y_train)
best_xgb = grid_xgb.best_estimator_
xgb_predictions = best_xgb.predict(X_test)
xgb_accuracy = accuracy_score(y_test, xgb_predictions)
xgb_roc_auc = roc_auc_score(y_test, best_xgb.predict_proba(X_test)[:, 1])

# Training GaussianNB
nb = GaussianNB()
nb.fit(X_train, y_train)
nb_predictions = nb.predict(X_test)
nb_accuracy = accuracy_score(y_test, nb_predictions)
nb_roc_auc = roc_auc_score(y_test, nb.predict_proba(X_test)[:, 1])

# Initialize model accuracies and ROC-AUC scores
roc_auc_scores = {
    'RandomForestROC_AUC': rf_roc_auc,
    'XGBoostROC_AUC': xgb_roc_auc,
    'NaiveBayesROC_AUC': nb_roc_auc
}

# Calculate normalized weights based on ROC-AUC scores
total_auc = rf_roc_auc + xgb_roc_auc + nb_roc_auc
weights = {
    'RandomForestWeight': rf_roc_auc / total_auc,
    'XGBoostWeight': xgb_roc_auc / total_auc,
    'NaiveBayesWeight': nb_roc_auc / total_auc
}

model_accuracies = {
    'RandomForestAccuracy': rf_accuracy,
    'XGBoostAccuracy': xgb_accuracy,
    'NaiveBayesAccuracy': nb_accuracy,
}

# Calculate average values for features where Potability is 1
averages_potable = df_cleaned[df_cleaned['Potability'] == 1].mean()

# Model Deployment
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    required_fields = ['ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields'}), 400
    
    # Convert to DataFrame with exact feature names
    input_data = pd.DataFrame([data], columns=required_fields)
    
    # Convert all columns to numeric, coerce errors to NaN
    input_data = input_data.apply(pd.to_numeric, errors='coerce')
    
    # Handle NaN values if any exist
    if input_data.isnull().values.any():
        return jsonify({'error': 'Invalid input data'}), 400
    
    # Apply log transformation
    input_data = np.log1p(input_data)

    # Perform scaling
    input_data = scaler.transform(input_data)
    
    # Make predictions using the best models
    rf_prob = best_rf.predict_proba(input_data)[:, 1]
    nb_prob = nb.predict_proba(input_data)[:, 1]
    xgb_prob = best_xgb.predict_proba(input_data)[:, 1]
    
    # Calculate weighted average
    weighted_average = (weights['RandomForestWeight'] * rf_prob +
                        weights['XGBoostWeight'] * xgb_prob +
                        weights['NaiveBayesWeight'] * nb_prob)
    
    # Final prediction based on weighted average
    final_prediction = 1 if weighted_average >= 0.5 else 0
    
    # Prepare results
    modelResults = {
        'RandomForestPrediction': 'Potable' if best_rf.predict(input_data)[0] == 1 else 'Not Potable',
        'NaiveBayesPrediction': 'Potable' if nb.predict(input_data)[0] == 1 else 'Not Potable',
        'XGBoostPrediction': 'Potable' if best_xgb.predict(input_data)[0] == 1 else 'Not Potable',
        'EnsemblePrediction': 'Potable' if final_prediction == 1 else 'Not Potable'
    }

    # Add average values and accuracies to the results
    averages_dict = averages_potable.to_dict()
    response = {
        'averages': averages_dict,
        'inputData': data,
        'modelResults': modelResults,
        'modelAccuracies': model_accuracies,
        'modelROC-AUC': roc_auc_scores,
        'modelWeight': weights
        
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
