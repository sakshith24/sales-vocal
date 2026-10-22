from supabase import create_client, Client
from config import settings

# Initialize Supabase Client with service role key for backend writes
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def save_call_record(data: dict):
    """Inserts processed call details, transcript, summary, and status into Supabase."""
    response = supabase.table("call_logs").insert(data).execute()
    return response