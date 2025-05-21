import os
import json
import httpx
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from typing import Dict, Any, Tuple
from database import database

# Instagram API configuration
INSTAGRAM_CLIENT_ID = os.getenv("INSTAGRAM_CLIENT_ID")
INSTAGRAM_CLIENT_SECRET = os.getenv("INSTAGRAM_CLIENT_SECRET")
INSTAGRAM_REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI", "http://localhost:8000/auth/instagram/callback")

def get_instagram_auth_url() -> str:
    """Generate the Instagram authorization URL"""
    return f"https://api.instagram.com/oauth/authorize?client_id={INSTAGRAM_CLIENT_ID}&redirect_uri={INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code"

async def exchange_code_for_token(code: str) -> Tuple[str, str]:
    """Exchange authorization code for an access token"""
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
        
        return access_token, user_id

async def get_instagram_user_profile(access_token: str) -> Dict[str, Any]:
    """Get user profile information from Instagram"""
    async with httpx.AsyncClient() as client:
        graph_api_url = f"https://graph.instagram.com/me?fields=id,username&access_token={access_token}"
        user_response = await client.get(graph_api_url)
        user_data = user_response.json()
        
        if "error" in user_data:
            raise HTTPException(status_code=400, detail=f"Failed to get user profile: {user_data['error']['message']}")
        
        return user_data

async def handle_instagram_callback(code: str):
    """Process Instagram authentication callback"""
    try:
        # Exchange code for access token
        access_token, user_id = await exchange_code_for_token(code)
                
        # Get user profile information
        user_data = await get_instagram_user_profile(access_token)
        
        # Check if user exists in Supabase
        existing_user = database.get_user_by_instagram_id(user_data["id"])
        
        if not existing_user:
            # Create new user
            new_user = {
                "instagram_id": user_data["id"],
                "username": user_data["username"],
                "access_token": access_token
            }
            
            database.create_user(new_user)
        else:
            # Update existing user's access token
            database.update_user(user_data["id"], {"access_token": access_token})
        
        # Create session for frontend
        user_session = {
            "instagram_id": user_data["id"],
            "username": user_data["username"]
        }
        
        # Redirect to frontend with session
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
