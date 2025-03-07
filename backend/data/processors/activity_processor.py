"""
Activity data processor module.

This module contains functions for processing activity data retrieved from
Garmin Connect, converting it into appropriate database models, and
extracting relevant metrics for storage and analysis.
"""

import logging
from typing import Dict, List
from models.models import Activities, ActivityRecords
from utils.time_utils import seconds_to_time

logger = logging.getLogger(__name__)

def process_activity(activity: Dict) -> Activities:
    """
    Convert raw activity data to an Activities model instance.
    
    Args:
        activity: Raw activity data dictionary from Garmin Connect
        
    Returns:
        Activities model instance populated with activity data
    """
    return Activities(
        activity_id=activity["activityId"],
        locationName=activity.get("locationName", ""),
        start_time=activity["startTimeLocal"],
        sport=activity["activityType"]["typeKey"],
        distance=round(activity["distance"] / 1000, 2),
        elapsed_time=seconds_to_time(activity["duration"]),
        avg_speed=round(activity["averageSpeed"] * 3.6, 2),
        max_speed=round(activity["maxSpeed"] * 3.6, 2),
        calories=activity["calories"],
        avg_hr=activity.get("averageHR"),
        max_hr=activity.get("maxHR"),
        steps=activity.get("steps"),
        training_effect=round(activity.get("aerobicTrainingEffect", 0), 2),
        training_load=round(activity.get("activityTrainingLoad", 0), 2),
        vO2MaxValue=round(activity.get("vO2MaxValue", 0), 2)
    )

def process_gps_data(activity_id: str, gps_points: list) -> List[ActivityRecords]:
    """
    Convert raw GPS data points to ActivityRecords model instances.
    
    Args:
        activity_id: Unique identifier for the parent activity
        gps_points: List of GPS data points extracted from GPX data
        
    Returns:
        List of ActivityRecords model instances for database storage
    """
    return [
        ActivityRecords(
            activity_id=activity_id,
            record=i,
            timestamp=point['time'],
            position_lat=point['lat'],
            position_long=point['lon'],
            altitude=point.get('ele'),
            heart_rate=point.get('hr'),
            speed=point.get('speed')
        )
        for i, point in enumerate(gps_points)
    ]