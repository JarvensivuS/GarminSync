"""
Health data fetcher module.

This module handles retrieving health data from Garmin Connect,
processing it through the appropriate processors, and storing
it in the database.
"""

import logging
from datetime import datetime, timedelta, date
from backend.core.garmin_client import GarminClient
from backend.core.create_db import get_db
from backend.models.models import HealthSummary
from backend.utils.db_util import get_earliest_date
from backend.data.processors.health_processor import process_health_data
from typing import Dict, Optional

logger = logging.getLogger(__name__)

def fetch_heart_rate_data(client, date_str: str) -> Dict:
    """
    Fetch heart rate data with improved null handling.
    
    Args:
        client: Initialized GarminClient instance
        date_str: Date string in format "YYYY-MM-DD"
        
    Returns:
        Dictionary containing heart rate data and metrics
    """
    heart_rate_debug = {
        'avg_hr': None,
        'max_hr': None,
        'resting_hr': None,
        'hr_values': []
    }
    
    try:
        heart_rates = client.get_heart_rates(date_str)
        logger.debug(f"Raw heart rates response: {heart_rates}")
        
        if heart_rates and isinstance(heart_rates, dict):
            heart_rate_values = heart_rates.get('heartRateValues', [])
            if heart_rate_values and isinstance(heart_rate_values, list):
                hr_values = []
                for hr in heart_rate_values:
                    try:
                        if isinstance(hr, dict) and hr.get('value') is not None:
                            value = float(hr['value'])
                            hr_values.append(value)
                    except (ValueError, TypeError):
                        continue
                
                if hr_values:
                    heart_rate_debug['hr_values'] = hr_values
                    heart_rate_debug['avg_hr'] = int(round(sum(hr_values) / len(hr_values)))
                    heart_rate_debug['max_hr'] = int(max(hr_values))
                    logger.debug(f"Processed HR values - Avg: {heart_rate_debug['avg_hr']}, Max: {heart_rate_debug['max_hr']}")
    except Exception as e:
        logger.error(f"Error fetching heart rates: {str(e)}")

    try:
        rhr_data = client.get_rhr_day(date_str)
        if isinstance(rhr_data, list) and rhr_data:
            rhr_entry = next((item for item in rhr_data if isinstance(item, dict) and item.get('metricId') == 60), None)
            if rhr_entry:
                heart_rate_debug['resting_hr'] = int(rhr_entry.get('value')) if rhr_entry.get('value') is not None else None
                logger.debug(f"Found RHR value: {heart_rate_debug['resting_hr']}")
    except Exception as e:
        logger.error(f"Error fetching RHR: {str(e)}")

    return heart_rate_debug

def fetch_health_data_with_debug(client, date_str: str) -> Dict:
    """
    Fetch health data from all endpoints with improved null handling.
    
    Args:
        client: Initialized GarminClient instance
        date_str: Date string in format "YYYY-MM-DD"
        
    Returns:
        Dictionary containing processed health data
    """
    hr_data = fetch_heart_rate_data(client, date_str)
    
    try:
        summary = client.get_user_summary(date_str) or {}
        logger.debug(f"Summary data: {summary}")
    except Exception as e:
        logger.error(f"Failed to fetch user summary: {e}")
        summary = {}

    try:
        intensity_data = client.get_intensity_minutes_data(date_str) or {}
        logger.debug(f"Raw intensity data: {intensity_data}")
        
        moderate = intensity_data.get('moderateIntensityDuration', 0) or 0
        vigorous = intensity_data.get('vigorousIntensityDuration', 0) or 0
        
        moderate_minutes = int(moderate // 60)
        vigorous_minutes = int(vigorous // 60)
        total_intensity_minutes = moderate_minutes + (vigorous_minutes * 2)
        
        logger.debug(f"Calculated intensity minutes: {total_intensity_minutes} "
                    f"(moderate: {moderate_minutes}, vigorous: {vigorous_minutes})")
    except Exception as e:
        logger.error(f"Failed to fetch intensity minutes: {str(e)}")
        total_intensity_minutes = 0

    try:
        daily_stats = client.get_stats(date_str) or {}
        active_calories = daily_stats.get('activeKilocalories')
    except Exception as e:
        logger.error(f"Failed to fetch daily stats: {str(e)}")
        active_calories = None

    processed_data = {
        'restingHeartRate': hr_data['resting_hr'],
        'maxHeartRate': hr_data['max_hr'],
        'averageHeartRate': hr_data['avg_hr'],
        'intensityMinutes': total_intensity_minutes,
        'activeCalories': active_calories,
        'averageStressLevel': summary.get('averageStressLevel', 0),
        'maxStressLevel': summary.get('maxStressLevel', 0),
        'totalSteps': summary.get('totalSteps', 0),
        'bodyBatteryChargedValue': summary.get('bodyBatteryChargedValue', 0),
        'bodyBatteryDrainedValue': summary.get('bodyBatteryDrainedValue', 0)
    }

    logger.debug(f"Final processed data for {date_str}: {processed_data}")
    return processed_data

def fetch_and_store_health_data(client=None):
    """
    Main function to fetch and store health data.
    
    Args:
        client: Optional GarminClient instance. If None, a new instance will be created.
    """
    if client is None:
        client = GarminClient()
    
    db = next(get_db())
    try:
        end_date = datetime.now().date()
        start_date = get_earliest_date()
        current_date = start_date if not hasattr(start_date, 'date') else start_date.date()
        records_processed = 0
        
        while current_date <= end_date:
            try:
                date_str = current_date.strftime("%Y-%m-%d")
                logger.info(f"Processing date: {date_str}")
                
                processed_data = fetch_health_data_with_debug(client, date_str)
                
                new_health = process_health_data(
                    data=processed_data,
                    date=datetime.combine(current_date, datetime.min.time()),
                    hr_values=[] 
                )

                if new_health:
                    existing = db.query(HealthSummary).filter_by(date=current_date).first()
                    if existing:
                        for key, value in new_health.__dict__.items():
                            if key != '_sa_instance_state':
                                setattr(existing, key, value)
                    else:
                        db.add(new_health)
                    
                    db.commit()
                    records_processed += 1
                
            except Exception as e:
                logger.error(f"Error processing health data for {current_date}: {e}")
                db.rollback()
            
            current_date += timedelta(days=1)
            
        logger.info(f"Processed {records_processed} health records")
        
    except Exception as e:
        logger.error(f"Error in health data fetch: {e}")
        raise
    finally:
        db.close()