"""
Database utility functions.

This module provides helper functions for common database operations such as
finding earliest dates, calculating date ranges, and handling database-specific
functionality.
"""

from datetime import datetime, timedelta
from sqlalchemy import func
import logging

from backend.models.models import Activities, HealthSummary, SleepMetrics
from backend.core.create_db import get_db

logger = logging.getLogger(__name__)

def get_earliest_date() -> datetime.date:
    """
    Find the earliest date with data across all tables.
    
    This function queries the database to find the earliest date with data in
    any of the main data tables (Activities, HealthSummary, SleepMetrics).
    
    Returns:
        The earliest date found or a default date (180 days ago)
    
    Example:
        >>> earliest_date = get_earliest_date()
        >>> print(earliest_date)
        2022-10-15
    """
    db = next(get_db())
    try:
        # Collect earliest dates from all relevant tables
        dates = []
        
        # Check Activities table
        earliest_activity = db.query(func.min(Activities.start_time)).scalar()
        if earliest_activity:
            dates.append(earliest_activity.date())
            
        # Check HealthSummary table
        earliest_health = db.query(func.min(HealthSummary.date)).scalar()
        if earliest_health:
            dates.append(earliest_health)
            
        # Check SleepMetrics table
        earliest_sleep = db.query(func.min(SleepMetrics.date)).scalar()
        if earliest_sleep:
            dates.append(earliest_sleep)
        
        # Return the minimum date found or default to 180 days ago
        return min(dates) if dates else datetime.now().date() - timedelta(days=180)
    except Exception as e:
        logger.error(f"Error determining earliest date: {e}")
        # Fall back to 180 days ago if query fails
        return datetime.now().date() - timedelta(days=180)
    finally:
        db.close()

def get_latest_activity_date() -> datetime.date:
    """
    Find the date of the most recent activity.
    
    Returns:
        The date of the most recent activity or today's date if none found
    
    Example:
        >>> latest_date = get_latest_activity_date()
        >>> print(latest_date)
        2023-03-15
    """
    db = next(get_db())
    try:
        latest = db.query(func.max(Activities.start_time)).scalar()
        return latest.date() if latest else datetime.now().date()
    except Exception as e:
        logger.error(f"Error determining latest activity date: {e}")
        return datetime.now().date()
    finally:
        db.close()

def get_date_range_activity_count(start_date: datetime.date, end_date: datetime.date) -> int:
    """
    Count activities within a date range.
    
    Args:
        start_date: Start date (inclusive)
        end_date: End date (inclusive)
        
    Returns:
        Number of activities within the date range
    """
    db = next(get_db())
    try:
        # Convert dates to datetime with time component for proper comparison
        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date, datetime.max.time())
        
        count = db.query(func.count(Activities.activity_id))\
            .filter(Activities.start_time >= start_datetime)\
            .filter(Activities.start_time <= end_datetime)\
            .scalar()
            
        return count or 0
    except Exception as e:
        logger.error(f"Error counting activities in date range: {e}")
        return 0
    finally:
        db.close()

def check_record_exists(model, **kwargs) -> bool:
    """
    Check if a record exists in the given model with the provided criteria.
    
    Args:
        model: SQLAlchemy model class
        **kwargs: Field-value pairs to use as filter criteria
        
    Returns:
        True if a matching record exists, False otherwise
    
    Example:
        >>> exists = check_record_exists(Activities, activity_id='123456789')
    """
    db = next(get_db())
    try:
        query = db.query(model).filter_by(**kwargs)
        exists = db.query(query.exists()).scalar()
        return bool(exists)
    except Exception as e:
        logger.error(f"Error checking if record exists: {e}")
        return False
    finally:
        db.close()