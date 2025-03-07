"""
Configuration module for the application.
Loads environment variables and provides application settings.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    """Application configuration loaded from environment variables."""
    
    # Server settings
    PORT = int(os.getenv('PORT', 5000))
    
    # Database settings
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_CONNECTION_STRING')
    
    # Garmin API settings
    GARMIN_USERNAME = os.getenv('GARMIN_USERNAME')
    GARMIN_PASSWORD = os.getenv('GARMIN_PASSWORD')

    @classmethod
    def validate(cls):
        """
        Validate that all required configuration variables are set.
        Raises ValueError if any required variables are missing.
        """
        required_vars = {
            'GARMIN_USERNAME': cls.GARMIN_USERNAME,
            'GARMIN_PASSWORD': cls.GARMIN_PASSWORD,
            'DATABASE_CONNECTION_STRING': cls.SQLALCHEMY_DATABASE_URI,
        }
        
        missing = [key for key, value in required_vars.items() if not value]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")