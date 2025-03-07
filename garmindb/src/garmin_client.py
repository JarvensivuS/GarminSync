import garminconnect
import os
from dotenv import load_dotenv

load_dotenv()

garmin_username = os.getenv('GARMIN_USERNAME')
garmin_password = os.getenv('GARMIN_PASSWORD')

def initialize_garmin_client():
    try:
        client = garminconnect.Garmin(garmin_username, garmin_password)
        client.login()
        print("Successfully logged in to Garmin Connect")
        return client
    except Exception as e:
        print(f"Error logging in to Garmin: {e}")
        raise
