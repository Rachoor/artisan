from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of origins you want to allow (e.g., ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],  # List of HTTP methods to allow (e.g., ["GET", "POST"])
    allow_headers=["*"],  # List of headers to allow (e.g., ["X-Custom-Header"])
)

# Define the data model for incoming messages
class Message(BaseModel):
    user_message: str

@app.post("/send_message/")
async def send_message(message: Message):
    print(message)
    user_message = message.user_message
    # For now, just echo the message
    response_message = f"Received your message: '{user_message}'"
    return {"text": response_message}
