from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import os
import httpx
import json
import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Instagram API configuration
INSTAGRAM_CLIENT_ID = os.getenv("INSTAGRAM_CLIENT_ID")
INSTAGRAM_CLIENT_SECRET = os.getenv("INSTAGRAM_CLIENT_SECRET")
INSTAGRAM_REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI", "http://localhost:8000/auth/instagram/callback")

app = FastAPI(title="WLM API", description="Backend API for WLM with Instagram authentication and Supabase integration")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define models
class UserCreate(BaseModel):
    instagram_id: str
    username: str
    profile_picture: Optional[str] = None
    access_token: str

@app.get("/")
def read_root():
    return {"message": "Welcome to WLM API"}

@app.get("/auth/instagram")
def instagram_login():
    """Redirect to Instagram authorization page"""
    instagram_auth_url = f"https://api.instagram.com/oauth/authorize?client_id={INSTAGRAM_CLIENT_ID}&redirect_uri={INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code"
    return RedirectResponse(instagram_auth_url)

@app.get("/auth/instagram/callback")
async def instagram_callback(code: str):
    """Handle Instagram callback and create/login user"""
    try:
        # Exchange code for access token
        token_url = "https://api.instagram.com/oauth/access_token"
        
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                token_url,
                data={
                    "client_id": INSTAGRAM_CLIENT_ID,
                    "client_secret": INSTAGRAM_CLIENT_SECRET,
                    "grant_type": "authorization_code",
                    "redirect_uri": INSTAGRAM_REDIRECT_URI,
                    "code": code
                }
            )
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            user_id = token_data.get("user_id")
            
            if not access_token or not user_id:
                raise HTTPException(status_code=400, detail="Failed to get access token")
                
            # Get user profile information
            graph_api_url = f"https://graph.instagram.com/me?fields=id,username&access_token={access_token}"
            user_response = await client.get(graph_api_url)
            user_data = user_response.json()
            
            # Check if user exists in Supabase
            query = supabase.table("users").select("*").eq("instagram_id", user_data["id"]).execute()
            
            if len(query.data) == 0:
                # Create new user
                new_user = {
                    "instagram_id": user_data["id"],
                    "username": user_data["username"],
                    "access_token": access_token
                }
                
                supabase.table("users").insert(new_user).execute()
            else:
                # Update existing user's access token
                supabase.table("users").update({"access_token": access_token}).eq("instagram_id", user_data["id"]).execute()
            
            # Create session or JWT token for frontend
            # This is a simplified approach - you may want to use JWT or another auth method
            user_session = {
                "instagram_id": user_data["id"],
                "username": user_data["username"]
            }
            
            # Redirect to frontend with token/session
            frontend_callback_url = os.getenv("FRONTEND_CALLBACK_URL", "http://localhost:3000/callback")
            return RedirectResponse(
                f"{frontend_callback_url}?user={json.dumps(user_session)}",
                status_code=status.HTTP_302_FOUND
            )
            
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"Authentication error: {str(e)}"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
