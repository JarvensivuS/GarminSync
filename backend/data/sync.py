"""
Comprehensive data synchronization module.
Handles fetching and storing data from Garmin Connect to the database.
"""

import logging
from backend.data.fetchers import activity_fetcher
from backend.data.fetchers import health_fetcher 
from backend.data.fetchers import sleep_fetcher
from backend.core.garmin_client import garmin_client

logger = logging.getLogger(__name__)

def sync_all_data(force: bool = False) -> bool:
    """
    Synchronizes all types of data from Garmin Connect to the database.
    
    This is the main entry point for data synchronization. It orchestrates
    fetching activities, health summaries, and sleep data using the respective
    fetcher modules.
    
    Args:
        force (bool): If True, forces redownload of all data regardless of
                      what's already in the database. Defaults to False.
    
    Returns:
        bool: True if synchronization was successful, False otherwise.
    
    Example:
        >>> from backend.data.sync import sync_all_data
        >>> success = sync_all_data()
        >>> print(f"Sync successful: {success}")
    """
    logger.info("Starting comprehensive data sync from Garmin Connect...")
    
    try:
        # Use the singleton garmin_client instance to fetch data
        # Each fetcher handles its own database operations
        activity_fetcher.fetch_and_store_activities(garmin_client)
        health_fetcher.fetch_and_store_health_data(garmin_client)
        sleep_fetcher.fetch_and_store_sleep_data(garmin_client)
        
        logger.info("All data synced successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error during data sync: {e}")
        return False