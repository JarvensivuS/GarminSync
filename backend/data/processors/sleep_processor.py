"""
Sleep data processor module.

This module contains functions for processing sleep data retrieved from
Garmin Connect, converting it into appropriate database models, and
extracting relevant metrics for storage and analysis.
"""

import logging
from typing import Dict, Optional
from datetime import datetime, time
from models.models import SleepMetrics
from utils.time_utils import seconds_to_time
from utils.data_utils import safe_int, safe_float, parse_timestamp

logger = logging.getLogger(__name__)

def process_sleep_data(sleep_data: Dict, date: datetime) -> Optional[SleepMetrics]:
    """
    Process sleep data from Garmin Connect.
    
    Args:
        sleep_data: Raw sleep data dictionary from Garmin Connect
        date: Date of the sleep data
        
    Returns:
        SleepMetrics model instance or None if insufficient data
    """
    daily_sleep = sleep_data.get('dailySleepDTO', sleep_data)

    start_time = (datetime.fromtimestamp(daily_sleep.get('sleepStartTimestampGMT', 0)/1000) 
                 if daily_sleep.get('sleepStartTimestampGMT') else None)
                 
    end_time = (datetime.fromtimestamp(daily_sleep.get('sleepEndTimestampGMT', 0)/1000) 
                if daily_sleep.get('sleepEndTimestampGMT') else None)

    deep_sleep = daily_sleep.get('deepSleepSeconds') or daily_sleep.get('deepSleep') or 0
    light_sleep = daily_sleep.get('lightSleepSeconds') or daily_sleep.get('lightSleep') or 0
    rem_sleep = daily_sleep.get('remSleepSeconds') or daily_sleep.get('remSleep') or 0
    awake = daily_sleep.get('awakeSleepSeconds') or daily_sleep.get('awake') or 0
    total_sleep = deep_sleep + light_sleep + rem_sleep

    if not (daily_sleep.get('deepSleepSeconds') or daily_sleep.get('lightSleepSeconds')):
        return None

    return SleepMetrics(
        date=date.date() if hasattr(date, 'date') else date,
        start_time=start_time,
        end_time=end_time,
        total_sleep=seconds_to_time(total_sleep),
        deep_sleep=seconds_to_time(deep_sleep),
        light_sleep=seconds_to_time(light_sleep),
        rem_sleep=seconds_to_time(rem_sleep),
        awake_time=seconds_to_time(awake),
        avg_respiration=daily_sleep.get('averageRespirationValue'),
        stress_during_sleep=daily_sleep.get('avgSleepStress')
    )