"""
Garmin Connect API client for fetching activity and health data.

This module provides a singleton interface to the Garmin Connect API using
the garminconnect library, handling authentication, session management,
and data retrieval with appropriate error handling.
"""

import garminconnect
import logging
from typing import Optional, Dict, List, Any
from .config import Config

logger = logging.getLogger(__name__)

class GarminClient:
    """
    Singleton client for interacting with the Garmin Connect API.
    
    This class manages authentication and provides methods for 
    retrieving various types of fitness data from Garmin Connect.
    """
    
    _instance = None
    _client = None

    def __new__(cls):
        """Ensure only one instance of the client exists."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize the Garmin Connect client if it doesn't exist."""
        if not self._client:
            self._initialize_client()

    def _initialize_client(self):
        """
        Set up the Garmin Connect client with credentials from config.
        
        Raises:
            ValueError: If Garmin credentials are not configured.
            Exception: If login to Garmin Connect fails.
        """
        if not Config.GARMIN_USERNAME or not Config.GARMIN_PASSWORD:
            raise ValueError("Garmin credentials not set. Please configure GARMIN_USERNAME and GARMIN_PASSWORD.")
        
        try:
            self._client = garminconnect.Garmin(Config.GARMIN_USERNAME, Config.GARMIN_PASSWORD)
            self._client.login()
            self._verify_session()
            logger.info("Successfully logged in to Garmin Connect")
        except Exception as e:
            logger.error(f"Failed to initialize Garmin client: {e}")
            raise

    def _verify_session(self):
        """
        Verify that the session is active by making a simple API call.
        
        Raises:
            Exception: If session verification fails.
        """
        try:
            # Test the session by retrieving a single activity
            self._client.get_activities(0, 1)
        except Exception as e:
            logger.error(f"Session verification failed: {e}")
            raise

    def get_activities(self, start: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Retrieve activities from Garmin Connect.
        
        Args:
            start: Index to start retrieving activities from (pagination)
            limit: Maximum number of activities to retrieve
            
        Returns:
            List of activity dictionaries
        """
        try:
            return self._client.get_activities(start, limit)
        except Exception as e:
            logger.error(f"Error fetching activities: {e}")
            return []

    def get_activity_gpx(self, activity_id: str) -> Optional[str]:
        """
        Download GPX data for a specific activity.
        
        Args:
            activity_id: ID of the activity to retrieve GPX data for
            
        Returns:
            String containing GPX XML data or None if retrieval fails
        """
        try:
            return self._client.download_activity(
                activity_id,
                dl_fmt=self._client.ActivityDownloadFormat.GPX
            )
        except Exception as e:
            logger.error(f"Error fetching GPX data for activity {activity_id}: {e}")
            return None

    def get_user_summary(self, date_str: str) -> Optional[Dict[str, Any]]:
        """
        Get daily summary data for a specific date.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            Dictionary of summary data or None if retrieval fails
        """
        try:
            return self._client.get_user_summary(date_str)
        except Exception as e:
            logger.error(f"Error fetching user summary for date {date_str}: {e}")
            return None

    def get_heart_rates(self, date_str: str) -> Optional[Dict[str, Any]]:
        """
        Get heart rate data for a specific date.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            Dictionary of heart rate data or None if retrieval fails
        """
        try:
            return self._client.get_heart_rates(date_str)
        except Exception as e:
            logger.error(f"Error fetching heart rate data for date {date_str}: {e}")
            return None

    def get_rhr_day(self, date_str: str) -> Optional[Dict[str, Any]]:
        """
        Get resting heart rate data for a specific date.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            Dictionary of RHR data or None if retrieval fails
        """
        try:
            return self._client.get_rhr_day(date_str)
        except Exception as e:
            logger.error(f"Error fetching RHR data for date {date_str}: {e}")
            return None

    def get_intensity_minutes_data(self, date_str: str) -> Optional[Dict[str, Any]]:
        """
        Get intensity minutes data for a specific date.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            Dictionary of intensity minutes data or None if retrieval fails
        """
        try:
            return self._client.get_intensity_minutes_data(date_str)
        except Exception as e:
            logger.error(f"Error fetching intensity minutes for date {date_str}: {e}")
            return None

    def get_stats(self, date_str: str) -> Optional[Dict[str, Any]]:
        """
        Get daily statistics including calories for a specific date.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            Dictionary of daily stats or None if retrieval fails
        """
        try:
            return self._client.get_stats(date_str)
        except Exception as e:
            logger.error(f"Error fetching daily stats for date {date_str}: {e}")
            return None

    def get_sleep_data(self, date_str: str) -> Optional[Dict[str, Any]]:
        """
        Get sleep data for a specific date.
        
        Args:
            date_str: Date string in format "YYYY-MM-DD"
            
        Returns:
            Dictionary of sleep data or None if retrieval fails
        """
        try:
            return self._client.get_sleep_data(date_str)
        except Exception as e:
            logger.error(f"Error fetching sleep data for date {date_str}: {e}")
            return None

# Create global singleton instance
garmin_client = GarminClient()