import zipfile
import os
import re
from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import List
import torch
import numpy as np
from io import BytesIO
from PIL import Image
import pandas as pd
from sklearn.metrics import mean_squared_error
from CNN_LSTM import YieldDataset, PyTorchModel, Config
import cv2


app = FastAPI()

# Load the model
config=Config()
model = PyTorchModel(config=config)
checkpoint_path = r"C:\Users\muhammad.hadi\Downloads\dummy_model_punjab_india_punjab.pth"
state_dict = torch.load(checkpoint_path, map_location=torch.device('cpu'))

# Remove 'module.' prefix from the keys in the state_dict
state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

# Load the corrected state_dict into the model
model.load_state_dict(state_dict)

# Load the dataframe with true values
df = pd.read_excel(r"D:\New folder\Desktop\FYP\Excel_Data\Sindh\rice_processed_data_clean_sindh.xlsx")

# Pydantic models for request and response
class PredictionResponse(BaseModel):
    prediction: float
    # true_value: float

# Preprocessing function with additional checks

# Preprocessing function with the same functionality as YieldDataset
def preprocess_image(image_file):
    try:
        # Load the image using PIL and convert it to RGB format
        image = Image.open(BytesIO(image_file))
        image = image.convert('RGB')
        
        # Resize the image to 128x128
        image = image.resize((128, 128), Image.Resampling.LANCZOS)
        
        # Convert image to numpy array for OpenCV processing
        img_array = np.array(image)
        
        # Convert the image to grayscale (similar to YieldDataset)
        img_gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Equalize the histogram to enhance contrast
        img_gray = cv2.equalizeHist(img_gray)
        
        # Normalize the image (convert to float32 and scale to [0, 1])
        img_gray = img_gray.astype(np.float32) / 255.0
        
        # Add a channel dimension to the image (for grayscale, we use 1 channel)
        img_gray = torch.tensor(img_gray).unsqueeze(0)  # Shape: (1, 128, 128)

        # Ensure the image is of the expected shape (C, H, W) with 1 channel for grayscale
        img_gray = img_gray.unsqueeze(0)  # Add a batch dimension (N, C, H, W)

        return img_gray
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")


# Function to calculate RMSE
def calculate_rmse(true_values, predicted_values):
    mse = mean_squared_error(true_values, predicted_values)
    rmse = np.sqrt(mse)
    return rmse

# Function to extract Divisions and Year from the image filename
def extract_division_and_year(filename):
    parts = filename.split('_')
    division = parts[2]  # Divisions is at index 2
    year = int(parts[3].split('.')[0])  # Year is at index 3 before the extension
    return division, year

# Function to extract ZIP files
def extract_zip(zip_file: UploadFile, extract_to: str = "./temp"):
    with zipfile.ZipFile(zip_file.file, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    return [os.path.join(extract_to, file) for file in os.listdir(extract_to) if file.endswith('.jpg')]

# Function to get image path based on Divisions and Year
def get_image_path(row, target_folder):
    division = row['Divisions'].strip()
    year = str(row['Year']).strip()

    pattern = re.compile(rf"NDVI_HLS_{re.escape(division)}\s*_{re.escape(year)}.jpg", re.IGNORECASE)

    for file_name in os.listdir(target_folder):
        if pattern.match(file_name):
            return os.path.join(target_folder, file_name)

    return None

# Endpoint for single image prediction
@app.post("/predict/", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        image_tensor = preprocess_image(image_data)

        # Extract Divisions and Year from the filename
        filename = file.filename
        division, year = extract_division_and_year(filename)

        # Get the true value from the dataframe based on Divisions and Year
        # row = df[(df['Divisions'] == division) & (df['Year'] == year)]
        # if not row.empty:
        #     true_value = row['Yield'].values[0]
        # else:
        #     raise HTTPException(status_code=400, detail=f"No true value found for {division} in year {year}")

        with torch.no_grad():
            prediction = model(image_tensor)

            # Check if prediction is empty
            if prediction is None or prediction.numel() == 0:
                raise HTTPException(status_code=400, detail="Model produced an empty prediction.")
            
            prediction_value = prediction.numpy().flatten()[0]  # Get scalar value

        return PredictionResponse(prediction=prediction_value)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint for batch image predictions (Upload a ZIP file)
# @app.post("/predict_batch/", response_model=List[PredictionResponse])
# async def predict_batch(zip_file: UploadFile = File(...)):
#     try:
#         # Save the uploaded zip file temporarily
#         zip_file_path = r"C:\Users\muhammad.hadi\OneDrive - Qordata\Desktop\FYP\Satellite_Imagery\Sindh\HLS_NDVI_SINDH_RICE_JPG.zip"
#         with open(zip_file_path, "wb") as f:
#             f.write(await zip_file.read())

#         # Extract the zip file
#         extracted_folder = "extracted_images"
#         os.makedirs(extracted_folder, exist_ok=True)
#         image_paths = extract_zip(zip_file, extract_to=extracted_folder)

#         predictions = []
#         predicted_values = []
#         true_value_list = []
#         print('Working on the batch...')
#         print('Extracted images:', image_paths)
#         # Process each file and extract true values based on Divisions and Year
#         for image_path in image_paths:
#             filename = os.path.basename(image_path)

#             # Extract Divisions and Year from the filename
#             division, year = extract_division_and_year(filename)

#             # Get the true value from the dataframe based on Divisions and Year
#             row = df[(df['Divisions'] == division) & (df['Year'] == year)]
#             if not row.empty:
#                 true_value = row['Yield'].values[0]
#             else:
#                 raise HTTPException(status_code=400, detail=f"No true value found for {division} in year {year}")

#             # Get the image path using get_image_path function
#             image_file_path = get_image_path(row.iloc[0], extracted_folder)
#             if not image_file_path:
#                 raise HTTPException(status_code=400, detail=f"Image not found for {division} in year {year}")
            
#             # Read the image file
#             with open(image_file_path, "rb") as image_file:
#                 image_data = image_file.read()
#                 image_tensor = preprocess_image(image_data)
#                 with torch.no_grad():
#                     prediction = model(image_tensor)
                    
#                     # Check if prediction is empty
#                     if prediction is None or prediction.numel() == 0:
#                         raise HTTPException(status_code=400, detail="Model produced an empty prediction.")
                    
#                     prediction_value = prediction.numpy().flatten()[0]  # Get scalar value
#                     predictions.append(PredictionResponse(prediction=prediction_value, true_value=true_value))
#                     predicted_values.append(prediction_value)
#                     true_value_list.append(true_value)

        # Calculate RMSE for the batch
        batch_rmse = calculate_rmse(true_value_list, predicted_values)

        # Clean up the extracted files
        for image_file_name in os.listdir(extracted_folder):
            os.remove(os.path.join(extracted_folder, image_file_name))
        os.rmdir(extracted_folder)
        os.remove(zip_file_path)

        # Return predictions and batch RMSE
        return {"predictions": predictions, "batch_rmse": batch_rmse}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
