import os
# Modification de l'import pour supabase-py
try:
    from supabase import create_client, Client
except ImportError:
    # Fallback pour supabase-py
    from supabase_py import create_client, Client
    
from dotenv import load_dotenv
from typing import Dict, List, Optional, Any

# Load environment variables
load_dotenv()

class Database:
    def __init__(self):
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        print(f"Initialisation de la connexion Supabase avec URL: {supabase_url}")
        print(f"Clé API Supabase: {supabase_key and '****' + supabase_key[-4:]}")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")
            
        self.client: Client = create_client(supabase_url, supabase_key)
        print("Client Supabase initialisé avec succès")
    
    def get_user_by_instagram_id(self, instagram_id: str) -> Optional[Dict[str, Any]]:
        """Get a user from the database by Instagram ID"""
        try:
            print(f"Recherche de l'utilisateur avec instagram_id: {instagram_id}")
            response = self.client.table("users").select("*").eq("instagram_id", instagram_id).execute()
            print(f"Réponse de Supabase pour la recherche d'utilisateur: {response.data}")
            if response.data and len(response.data) > 0:
                return response.data[0]
            print("Aucun utilisateur trouvé avec cet instagram_id")
            return None
        except Exception as e:
            print(f"Erreur lors de la recherche de l'utilisateur: {str(e)}")
            return None
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in the database"""
        try:
            print(f"Création d'un nouvel utilisateur: {user_data}")
            response = self.client.table("users").insert(user_data).execute()
            print(f"Réponse de Supabase pour la création d'utilisateur: {response.data}")
            if response.data and len(response.data) > 0:
                return response.data[0]
            print("Aucune donnée retournée par Supabase lors de la création de l'utilisateur")
            return {}
        except Exception as e:
            print(f"Erreur lors de la création de l'utilisateur: {str(e)}")
            return {}
    
    def update_user(self, instagram_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing user in the database"""
        try:
            print(f"Mise à jour de l'utilisateur avec instagram_id: {instagram_id}, données: {user_data}")
            response = self.client.table("users").update(user_data).eq("instagram_id", instagram_id).execute()
            print(f"Réponse de Supabase pour la mise à jour de l'utilisateur: {response.data}")
            if response.data and len(response.data) > 0:
                return response.data[0]
            print("Aucune donnée retournée par Supabase lors de la mise à jour de l'utilisateur")
            return {}
        except Exception as e:
            print(f"Erreur lors de la mise à jour de l'utilisateur: {str(e)}")
            return {}
    
    # Nouvelles fonctions pour gérer les crushes
    def add_crush(self, user_id: str, crush_name: str, social_network: str) -> Dict[str, Any]:
        """Add a new crush to the database"""
        crush_data = {
            "user_id": user_id,
            "crush_name": crush_name,
            "social_network": social_network
        }
        response = self.client.table("crushes").insert(crush_data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return {}
    
    def get_user_crushes(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all crushes for a user"""
        response = self.client.table("crushes").select("*").eq("user_id", user_id).execute()
        return response.data if response.data else []
    
    def check_for_matches(self, user_id: str, crush_name: str) -> bool:
        """Check if there's a match between two users"""
        # Cette fonction est simplifiée et devrait être adaptée à votre logique de correspondance spécifique
        # L'idée est de vérifier si un autre utilisateur a ajouté cet utilisateur en tant que crush
        
        # Récupérer l'utilisateur par son ID
        user = self.client.table("users").select("*").eq("id", user_id).single().execute().data
        if not user:
            return False
        
        # Vérifier si quelqu'un a ajouté cet utilisateur comme crush
        response = self.client.table("crushes").select("*")\
            .eq("crush_name", user.get('username', ''))\
            .execute()
        
        # Si quelqu'un a ajouté l'utilisateur comme crush et que l'utilisateur a ajouté cette personne aussi
        for potential_match in response.data or []:
            potential_match_user_id = potential_match.get('user_id')
            if potential_match_user_id:
                # Vérifier si l'utilisateur a aussi ajouté cette personne comme crush
                user_crushes = self.get_user_crushes(user_id)
                potential_match_user = self.client.table("users").select("username")\
                    .eq("id", potential_match_user_id).single().execute().data
                
                if potential_match_user:
                    potential_match_username = potential_match_user.get('username', '')
                    for user_crush in user_crushes:
                        if user_crush.get('crush_name') == potential_match_username:
                            # C'est un match! Mettre à jour les deux crushes
                            self.client.table("crushes").update({"matched": True})\
                                .eq("id", potential_match.get('id')).execute()
                            
                            # Trouver le crush correspondant de l'utilisateur et le mettre à jour aussi
                            for uc in user_crushes:
                                if uc.get('crush_name') == potential_match_username:
                                    self.client.table("crushes").update({"matched": True})\
                                        .eq("id", uc.get('id')).execute()
                                    return True
        
        return False

# Singleton instance
database = Database()
