import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_CONNECTION_STRING = (
        f"mssql+pyodbc://{os.getenv('DATABASE_USERNAME')}:{os.getenv('DATABASE_PASSWORD')}"
        f"@{os.getenv('DATABASE_SERVER')}:1433/{os.getenv('DATABASE_NAME')}?"
        f"driver={os.getenv('DATABASE_DRIVER')}&Encrypt=yes&TrustServerCertificate=no"
    )



