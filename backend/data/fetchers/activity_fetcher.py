"""
Activity data fetcher module.

This module handles retrieving activity data from Garmin Connect,
processing it through the appropriate processors, and storing
it in the database.
"""

import logging
from datetime import datetime, timedelta
from typing import List
from sqlalchemy import func
from backend.core.garmin_client import GarminClient
from backend.models.models import get_db, Activities, ActivityRecords
from backend.utils.data_utils import parse_gpx
from backend.data.processors.activity_processor import process_activity, process_gps_data

logger = logging.getLogger(__name__)

def fetch_and_store_activities(client):
    """
    Fetch activities from Garmin Connect and store them in the database.
    
    Args:
        client: Initialized GarminClient instance
        
    Returns:
        True if successful, False if an error occurred
    """
    db = next(get_db())
    try:
        activities = client.get_activities(0, 100)  
        
        new_activities_count = 0
        for activity in activities:
            try:
                new_activity = process_activity(activity)
                existing = db.query(Activities).filter_by(
                    activity_id=activity["activityId"]
                ).first()
                
                if not existing:
                    db.add(new_activity)
                    fetch_and_store_activity_details(db, client, activity["activityId"])
                    new_activities_count += 1
                    
            except Exception as e:
                logger.error(f"Error processing activity {activity.get('activityId')}: {e}")
                continue
                
        db.commit()
        logger.info(f"Added {new_activities_count} new activities")
        return True
        
    except Exception as e:
        logger.error(f"Error in activity fetch and store: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def fetch_and_store_activity_details(db, client, activity_id: str) -> None:
    """
    Fetch GPS data for a specific activity and store it in the database.
    
    Args:
        db: Database session
        client: Initialized GarminClient instance
        activity_id: ID of the activity to fetch details for
    """
    try:
        gpx_data = client.get_activity_gpx(activity_id)  
        if not gpx_data:
            return

        gps_data = parse_gpx(gpx_data)
        if not gps_data:
            return

        db.query(ActivityRecords).filter_by(activity_id=activity_id).delete()
        records = process_gps_data(activity_id, gps_data)
        for record in records:
            db.add(record)
    except Exception as e:
        logger.error(f"Error fetching GPS data for activity {activity_id}: {e}")