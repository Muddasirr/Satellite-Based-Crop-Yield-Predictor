import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.models as models
from torch.utils.data import DataLoader, Dataset
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import cv2
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F

# Dataset class to handle images, years, and labels from DataFrame
import torch
from torch.utils.data import Dataset
import cv2
import numpy as np

class YieldDataset(Dataset):
    def __init__(self, df, transform=None):
        self.df = df  # DataFrame containing image paths and labels
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        # Get image path and label (yield) from the DataFrame
        img_path = self.df.iloc[idx]['ImagePath']
        label = self.df.iloc[idx]['Yield']
        
        # Load the image using OpenCV
        image = cv2.imread(img_path)

        # Check if the image was loaded correctly
        if image is None:
            raise ValueError(f"Image at path {img_path} could not be loaded.")

        # Resize the image to 128x128
        image = cv2.resize(image, (128, 128))

        # Convert the image to grayscale
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Equalize the histogram to enhance contrast
        image = cv2.equalizeHist(image)

        # Normalize the image (optional but recommended for neural networks)
        image = image.astype(np.float32) / 255.0  # Normalize to [0, 1]

        # If a transform is provided, apply it
        if self.transform:
            image = self.transform(image)

        # Convert the image to a tensor and add a channel dimension (1 channel for grayscale)
        image = torch.tensor(image).unsqueeze(0)  # Add a channel dimension (1 for grayscale)

        # Return the image and the corresponding yield label
        return image, torch.tensor(label, dtype=torch.float32)
    

class Config():
    B, W, H = 32, 32, 32 # Batch size, width, height, channels
    train_step = 250  # Number of training steps
    lr = 1e-3  # Learning rate
    weight_decay = 0.005  # Weight decay
    drop_out = 0.25  # Dropout probability (matches paper)

# Custom CNN Model


class PyTorchModel(nn.Module):
    def __init__(self, config):
        super(PyTorchModel, self).__init__()
        
        self.conv1_1 = self.conv_relu_batch(1, 128)
        self.conv1_2 = self.conv_relu_batch(128, 128)
        self.conv1_3 = self.conv_relu_batch(128, 128, stride=2)

        self.conv2_1 = self.conv_relu_batch(128, 256)
        self.conv2_2 = self.conv_relu_batch(256, 256)
        self.conv2_3 = self.conv_relu_batch(256, 256, stride=2)

        self.conv3_1 = self.conv_relu_batch(256, 512)
        self.conv3_2 = self.conv_relu_batch(512, 512)
        self.conv3_3 = self.conv_relu_batch(512, 512)
        self.conv3_4 = self.conv_relu_batch(512, 512, stride=2)

        self.conv4_1 = self.conv_relu_batch(512, 1024)

        # Adjusting fc6 layer to match the flattened size
        flattened_size = 1024 * 16 * 16  # After conv4_1, image size is 16x16
        self.fc6 = nn.Linear(flattened_size, 2048)  # Adjusted for output size after conv layers
        self.fc_out = nn.Linear(2048, 1)

    def conv_relu_batch(self, in_channels, out_channels, filter_size=3, stride=1):
        layers = [
            nn.Conv2d(in_channels, out_channels, filter_size, stride=stride, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(),
            nn.Dropout(p=0.25)
        ]
        return nn.Sequential(*layers)

    def forward(self, x):
        x = self.conv1_1(x)
        x = self.conv1_2(x)
        x = self.conv1_3(x)

        x = self.conv2_1(x)
        x = self.conv2_2(x)
        x = self.conv2_3(x)

        x = self.conv3_1(x)
        x = self.conv3_2(x)
        x = self.conv3_3(x)
        x = self.conv3_4(x)

        x = self.conv4_1(x)

        x = x.view(x.size(0), -1)  # Flatten for fully connected layer
        x = self.fc6(x)
        x = self.fc_out(x)
        return x
    
# RMSE Loss (Root Mean Squared Error Loss)
class RMSELoss(nn.Module):
    def __init__(self):
        super(RMSELoss, self).__init__()

    def forward(self, outputs, targets):
        # Calculate MSE
        mse_loss = torch.mean((outputs - targets) ** 2)
        # Return the square root of MSE
        return torch.sqrt(mse_loss)
    
