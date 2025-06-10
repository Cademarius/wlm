import os
import json
import httpx
from fastapi import HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse, HTMLResponse
from typing import Dict, Any, Tuple

# Modification de l'import pour supabase-py
try:
    from supabase import create_client, Client
except ImportError:
    # Fallback pour supabase-py
    from supabase_py import create_client, Client

from database import database

# Instagram API configuration
INSTAGRAM_CLIENT_ID = os.getenv("INSTAGRAM_CLIENT_ID")
INSTAGRAM_CLIENT_SECRET = os.getenv("INSTAGRAM_CLIENT_SECRET")
INSTAGRAM_REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI", "http://localhost:8000/auth/instagram/callback")

# Debug des variables d'environnement
print("===== CONFIGURATION INSTAGRAM =====")
print(f"CLIENT_ID: {INSTAGRAM_CLIENT_ID}")
print(f"CLIENT_SECRET: {INSTAGRAM_CLIENT_ID and '*****'}")
print(f"REDIRECT_URI: {INSTAGRAM_REDIRECT_URI}")
print("===================================")

def get_instagram_auth_url() -> str:
    """Generate the Instagram authorization URL"""
    auth_url = f"https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id={INSTAGRAM_CLIENT_ID}&redirect_uri={INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights"
    print(f"URL d'authentification Instagram générée: {auth_url}")
    return auth_url
    
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
        
        print(f"Réponse du token Instagram: {token_response.text}")
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        user_id = token_data.get("user_id")
        
        if not access_token or not user_id:
            raise HTTPException(status_code=400, detail="Failed to get access token")
        
        return access_token, user_id

async def get_instagram_user_profile(access_token: str) -> Dict[str, Any]:
    """Get user profile information from Instagram"""
    async with httpx.AsyncClient() as client:
        graph_api_url = f"https://graph.instagram.com/me?fields=id,username,name,profile_picture_url&access_token={access_token}"
        user_response = await client.get(graph_api_url)
        user_data = user_response.json()
        
        print(f"Réponse du profil utilisateur Instagram: {user_response.text}")
        
        if "error" in user_data:
            raise HTTPException(status_code=400, detail=f"Failed to get user profile: {user_data['error']['message']}")
        
        return user_data

async def handle_instagram_callback(code: str):
    """Process Instagram authentication callback"""
    try:
        print(f"Traitement du callback Instagram avec code: {code[:10]}...")
        # Exchange code for access token
        access_token, user_id = await exchange_code_for_token(code)
                
        # Get user profile information
        user_data = await get_instagram_user_profile(access_token)
        
        print(f"Données utilisateur Instagram: {user_data}")
        
        # Check if user exists in Supabase
        existing_user = database.get_user_by_instagram_id(user_data["id"])
        
        if not existing_user:
            # Create new user
            new_user = {
                "instagram_id": user_data["id"],
                "username": user_data["username"],
                "name": user_data.get("name"),
                "profile_picture_url": user_data.get("profile_picture_url"),
                "access_token": access_token
            }
            
            print(f"Création d'un nouvel utilisateur: {new_user}")
            created_user = database.create_user(new_user)
            print(f"Résultat de la création: {created_user}")
        else:
            # Update existing user's access token
            print(f"Mise à jour de l'utilisateur existant: {existing_user['id']}")
            updated_user = database.update_user(user_data["id"], {
                "access_token": access_token,
                "name": user_data.get("name"),
                "profile_picture_url": user_data.get("profile_picture_url")
            })
            print(f"Résultat de la mise à jour: {updated_user}")
        
        # Create session for frontend
        user_session = {
            "instagram_id": user_data["id"],
            "username": user_data["username"],
            "name": user_data.get("name"),
            "profile_picture_url": user_data.get("profile_picture_url")
        }
        
        # Au lieu de rediriger, retourner une page HTML avec un message de succès
        # et des informations pour fermer la fenêtre/onglet
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Authentification réussie</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1C1F3F; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }}
                .popup {{ text-align: center; background-color: #2a2d5a; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 500px; animation: fadeIn 0.5s; }}
                @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(-20px); }} to {{ opacity: 1; transform: translateY(0); }} }}
                h1 {{ color: #FF4F81; margin-top: 10px; }}
                p {{ margin: 15px 0; line-height: 1.5; }}
                .checkmark-circle {{ width: 80px; height: 80px; position: relative; margin: 0 auto 20px; }}
                .checkmark-circle .background {{ width: 80px; height: 80px; border-radius: 50%; background: #FF4F81; position: absolute; }}
                .checkmark-circle .checkmark {{ width: 40px; height: 80px; position: absolute; transform: rotate(45deg); left: 25px; top: -10px; }}
                .checkmark-circle .checkmark .checkmark-stem {{ position: absolute; width: 8px; height: 40px; background-color: #fff; left: 16px; top: 20px; }}
                .checkmark-circle .checkmark .checkmark-kick {{ position: absolute; width: 20px; height: 8px; background-color: #fff; left: 0px; top: 52px; }}
                .user-info {{ background-color: #3a3d6a; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: left; }}
                .countdown {{ font-size: 1.2em; font-weight: bold; color: #FF4F81; margin: 20px 0; }}
                .closing-text {{ font-size: 0.9em; opacity: 0.8; }}
            </style>
        </head>
        <body>
            <div class="popup">
                <div class="checkmark-circle">
                    <div class="background"></div>
                    <div class="checkmark">
                        <div class="checkmark-stem"></div>
                        <div class="checkmark-kick"></div>
                    </div>
                </div>
                <h1>Authentification réussie!</h1>
                <p>Vous êtes connecté avec Instagram.</p>
                <div class="user-info">
                    {f'<img src="{user_data.get("profile_picture_url")}" alt="Photo de profil" style="width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 15px; display: block;">' if user_data.get("profile_picture_url") else ''}
                    <p><strong>Nom d'utilisateur:</strong> {user_data.get('username')}</p>
                    <p><strong>Nom:</strong> {user_data.get('name', 'N/A')}</p>
                    <p><strong>ID Instagram:</strong> {user_data.get('id')}</p>
                </div>
                <div class="countdown" id="countdown">Cette fenêtre se fermera dans <span id="timer">3</span>s</div>
                <p class="closing-text">Vous allez être redirigé vers l'application...</p>
            </div>
            <script>
                // Compter à rebours pour fermer la fenêtre
                let timeLeft = 3;
                const timerElement = document.getElementById('timer');
                
                const timer = setInterval(() => {{
                    timeLeft--;
                    timerElement.textContent = timeLeft;
                    if (timeLeft <= 0) {{
                        clearInterval(timer);
                        // Fermer la fenêtre ou rediriger
                        closeOrRedirect();
                    }}
                }}, 1000);
                
                function closeOrRedirect() {{
                    // Stocker les informations utilisateur
                    const userData = {json.dumps(user_session)};
                    
                    // Si c'est une fenêtre popup (ouverte par window.open)
                    if (window.opener) {{
                        // Envoyer un message à la fenêtre parente
                        window.opener.postMessage({{
                            type: 'INSTAGRAM_AUTH_SUCCESS',
                            userData: userData
                        }}, '*');
                        // Fermer cette fenêtre
                        window.close();
                    }} else {{
                        // Stocker dans localStorage
                        try {{
                            localStorage.setItem("user", JSON.stringify(userData));
                        }} catch (e) {{
                            console.error('Erreur lors du stockage des données:', e);
                        }}
                        // Rediriger vers la page principale
                        window.location.href = '/';
                    }}
                }}
                
                // Filet de sécurité: fermer la fenêtre après 5 secondes malgré tout
                setTimeout(() => {{
                    closeOrRedirect();
                }}, 5000);
            </script>
        </body>
        </html>
        """
        
        print("Rendu de la page HTML de succès")
        return HTMLResponse(content=html_content, status_code=200)
        
    except Exception as e:
        error_message = str(e)
        print(f"Erreur d'authentification: {error_message}")
        # Renvoyer une page HTML d'erreur au lieu d'une redirection
        error_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Erreur d'authentification</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1C1F3F; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }}
                .popup {{ text-align: center; background-color: #2a2d5a; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 500px; animation: fadeIn 0.5s; }}
                @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(-20px); }} to {{ opacity: 1; transform: translateY(0); }} }}
                h1 {{ color: #e74c3c; margin-top: 10px; }}
                p {{ margin: 15px 0; line-height: 1.5; }}
                .error-circle {{ width: 80px; height: 80px; background-color: #e74c3c; border-radius: 50%; position: relative; margin: 0 auto 20px; }}
                .error-circle:before, .error-circle:after {{ content: ''; width: 8px; height: 40px; background-color: white; position: absolute; top: 20px; left: 36px; transform: rotate(45deg); }}
                .error-circle:after {{ transform: rotate(-45deg); }}
                .error-message {{ background-color: #3a3d6a; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: left; overflow-wrap: break-word; }}
                .button {{ background-color: #e74c3c; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; transition: background-color 0.3s; }}
                .button:hover {{ background-color: #c0392b; }}
            </style>
        </head>
        <body>
            <div class="popup">
                <div class="error-circle"></div>
                <h1>Erreur d'authentification</h1>
                <p>Une erreur s'est produite lors de l'authentification avec Instagram.</p>
                <div class="error-message">
                    <p><strong>Détail:</strong> {error_message}</p>
                </div>
                <p>Veuillez réessayer ou contacter l'assistance.</p>
                <button class="button" onclick="window.close() || (window.location.href = '/')">Fermer</button>
            </div>
            <script>
                // Filet de sécurité: fermer la fenêtre après 10 secondes
                setTimeout(() => {{
                    if (window.opener) {{
                        window.opener.postMessage({{
                            type: 'INSTAGRAM_AUTH_ERROR',
                            error: '{error_message}'
                        }}, '*');
                        window.close();
                    }} else {{
                        window.location.href = '/';
                    }}
                }}, 10000);
            </script>
        </body>
        </html>
        """
        return HTMLResponse(content=error_html, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
