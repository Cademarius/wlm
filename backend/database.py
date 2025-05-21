import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, List, Optional, Any

# Load environment variables
load_dotenv()

class Database:
    def __init__(self):
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")
            
        self.client: Client = create_client(supabase_url, supabase_key)
    
    def get_user_by_instagram_id(self, instagram_id: str) -> Optional[Dict[str, Any]]:
        """Get a user from the database by Instagram ID"""
        response = self.client.table("users").select("*").eq("instagram_id", instagram_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in the database"""
        response = self.client.table("users").insert(user_data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return {}
    
    def update_user(self, instagram_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing user in the database"""
        response = self.client.table("users").update(user_data).eq("instagram_id", instagram_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return {}

# Singleton instance
database = Database()
