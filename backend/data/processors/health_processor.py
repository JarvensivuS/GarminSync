"""
Health data processor module.

This module contains functions for processing health data retrieved from
Garmin Connect, converting it into appropriate database models, and
extracting relevant metrics for storage and analysis.
"""

import logging
from typing import Dict, List, Optional
from datetime import datetime
from models.models import HealthSummary

logger = logging.getLogger(__name__)

def process_health_data(data: Dict, date: datetime, hr_values: List[float]) -> Optional[HealthSummary]:
    """
    Process health data with proper field mapping.
    
    Args:
        data: Raw health data dictionary from Garmin Connect
        date: Date of the health data
        hr_values: List of heart rate values for the day
        
    Returns:
        HealthSummary model instance or None if insufficient data
    """
    if not (data.get('totalSteps') or data.get('intensityMinutes') or hr_values):
        return None

    return HealthSummary(
        date=date.date(),
        resting_heart_rate=data.get('restingHeartRate'),
        max_heart_rate=data.get('maxHeartRate'),
        avg_heart_rate=data.get('averageHeartRate'),
        avg_stress=data.get('averageStressLevel', 0), 
        max_stress=data.get('maxStressLevel', 0),
        steps=data.get('totalSteps', 0),
        intensity_minutes=data.get('intensityMinutes', 0),
        active_calories=data.get('activeCalories'),
        body_battery_charged=data.get('bodyBatteryChargedValue', 0),
        body_battery_drained=data.get('bodyBatteryDrainedValue', 0)
    )