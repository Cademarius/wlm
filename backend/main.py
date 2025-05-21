from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import os
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from dotenv import load_dotenv

# Modification de l'import pour supabase-py
try:
    from supabase import create_client, Client
except ImportError:
    # Fallback pour supabase-py
    from supabase_py import create_client, Client

from database import database
from auth import get_instagram_auth_url, handle_instagram_callback

# Load environment variables
load_dotenv()

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

class CrushCreate(BaseModel):
    user_id: str
    crush_name: str
    social_network: str

class CrushResponse(BaseModel):
    id: str
    user_id: str
    crush_name: str
    social_network: str
    matched: bool = False
    created_at: str

@app.get("/")
def read_root():
    return {"message": "Welcome to WLM API"}

@app.get("/auth/instagram")
def instagram_login():
    """Redirect to Instagram authorization page"""
    instagram_auth_url = get_instagram_auth_url()
    return RedirectResponse(instagram_auth_url)

@app.get("/auth/instagram/callback")
async def instagram_callback(code: str):
    """Handle Instagram callback and create/login user"""
    return await handle_instagram_callback(code)

@app.get("/users/me")
async def get_current_user(instagram_id: str):
    """Get currently authenticated user"""
    user = database.get_user_by_instagram_id(instagram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Ne pas renvoyer le token par sécurité
    if "access_token" in user:
        del user["access_token"]
    
    return user

@app.post("/crushes/", response_model=Dict[str, Any])
async def add_crush(crush: CrushCreate):
    """Add a new crush for a user"""
    # Vérifie si l'utilisateur existe
    user = database.client.table("users").select("*").eq("id", crush.user_id).execute()
    if not user.data or len(user.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Ajouter le crush dans la base de données
    new_crush = database.add_crush(crush.user_id, crush.crush_name, crush.social_network)
    
    # Vérifier s'il y a un match
    is_match = database.check_for_matches(crush.user_id, crush.crush_name)
    
    # Mettre à jour le crush avec le statut de correspondance si nécessaire
    if is_match and "id" in new_crush:
        database.client.table("crushes").update({"matched": True}).eq("id", new_crush["id"]).execute()
        new_crush["matched"] = True
    
    return {
        "crush": new_crush,
        "is_match": is_match
    }

@app.get("/crushes/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_crushes(user_id: str):
    """Get all crushes for a user"""
    # Vérifie si l'utilisateur existe
    user = database.client.table("users").select("*").eq("id", user_id).execute()
    if not user.data or len(user.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Récupérer tous les crushes de l'utilisateur
    crushes = database.get_user_crushes(user_id)
    
    return crushes

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
