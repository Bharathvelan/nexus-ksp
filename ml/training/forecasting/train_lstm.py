import torch
import torch.nn as nn
import torch.optim as optim

class CrimeForecaster(nn.Module):
    def __init__(self, input_size=32, hidden_size=256, num_layers=2, dropout=0.2):
        super(CrimeForecaster, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout)
        # Attention mechanism
        self.attention = nn.Linear(hidden_size, 1)
        self.fc = nn.Linear(hidden_size, 1) # Predict crime count

    def forward(self, x):
        # x shape: (batch_size, sequence_length=90, input_size=32)
        lstm_out, (hn, cn) = self.lstm(x)
        
        # Attention over time steps
        attn_weights = torch.softmax(self.attention(lstm_out), dim=1)
        context_vector = torch.sum(attn_weights * lstm_out, dim=1)
        
        out = self.fc(context_vector)
        return out

def train_model():
    print("STUB: Loading 5 years of mock data...")
    # Train/val/test split: 70/15/15
    model = CrimeForecaster()
    criterion = nn.HuberLoss()
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=50)
    
    print("STUB: Training loop with MLflow logging, early stopping patience=10")
    # torch.save(model.state_dict(), "../../models/forecaster_v1.pt")
    print("STUB: Model saved to ml/models/forecaster_v1.pt")

if __name__ == "__main__":
    train_model()
