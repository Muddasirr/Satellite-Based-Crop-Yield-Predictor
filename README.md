
# 🌾 Satellite-Based Crop Yield Prediction System

This Final Year Project, submitted to IBA Karachi, is a Pakistan-specific initiative aimed at empowering agricultural stakeholders, researchers, and policymakers with data-driven insights. The system uses multispectral satellite imagery and comparative machine learning models to predict crop yield which addresses the gap of open-source, localized agricultural intelligence in the country.

An additional feature is its end-to-end integration of an LLM-based chatbot, allowing users to interact with the system in natural language. This makes complex yield data and predictions accessible even to non-technical users, enabling better planning, resource allocation, and agricultural decision-making in Pakistan.

## Documentation

- [Software Requirements Specification](https://www.overleaf.com/read/wjrczkthrrpc#1c0eb4)
- [System Design](https://www.overleaf.com/read/hnnxdkxhwyjt#e40bdf)


## 🧠 Model Overview
We developed a satellite-based crop yield prediction system using publicly available Landsat imagery, tailored specifically for Pakistan's agricultural landscape.

- Region Focus: Division-wise areas across Pakistan

- Temporal Coverage: Multi-year imagery during the crop growing season

- Data Source: Landsat bands — especially Band 4 (Red) and Band 5 (Near-Infrared) — known for their value in vegetation analysis

### 🔧 Technical Approach
- We extracted relevant infrared and near-infrared data to assess crop health and growth.

- Each sample combined geographic and actual yield data (in kg/ha), forming a rich dataset for training.

- A custom Convolutional Neural Network (CNN) was trained on this data to map satellite features to crop yield.

- Typical yield values ranged between 2000–2500 kg per hectare.

### 🏗️ Model Architecture

Our crop yield prediction model uses a **VGG-inspired Convolutional Neural Network (CNN)** optimized for regression tasks on satellite imagery:

- **11 convolutional layers** organized into four sequential blocks  
- Each block uses the structure:  
  `3×3 Conv → BatchNorm → ReLU → Dropout`

- **Downsampling** is achieved via **stride‑2 convolutions** instead of max-pooling at the end of Blocks 1 to 3  
- **Block 4** increases feature depth to **1024 channels** without further spatial downsampling  
- Output from the final conv layer is a feature map of **1024×16×16**, which is **flattened**  
- Passed through a **2048-unit fully connected layer**  
- Ends with a **single linear output neuron** for regression (predicting continuous crop yield)

This architecture was chosen for its balance of **depth, parameter efficiency, and spatial awareness**, making it well-suited for geospatial imagery and yield prediction.

### 🎯 Performance
- Achieved Root Mean Square Error (RMSE) of just 11%, reflecting strong prediction accuracy.

- This allows for timely, scalable, and accurate yield forecasting, aiding better agricultural planning, policy-making, and resource allocation.




## Deployment

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.js. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

## Authors

- [Muddasir Rizwan](https://github.com/Muddasirr)
- [Muhammad Hadi](https://github.com/Theycallmeinsane)
- [Ahmed Raza](https://github.com/Ahmeddraaza)
- [Moeen Haider](https://github.com/MoeenH)
- [Hasan Atiq](https://github.com)



