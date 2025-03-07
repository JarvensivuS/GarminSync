"""
Time-related utility functions.

This module provides helper functions for working with time and date values,
including conversions between different time formats and representations.
"""

from datetime import time, datetime, timedelta
from typing import Optional, Union

def seconds_to_time(seconds: Union[int, float, str]) -> time:
    """
    Convert total seconds to a time object.
    
    Args:
        seconds: Number of seconds as int, float or string
        
    Returns:
        time object representing the duration in HH:MM:SS format
    
    Example:
        >>> seconds_to_time(3665)
        datetime.time(1, 1, 5)
        >>> str(seconds_to_time(3665))
        '01:01:05'
    """
    try:
        total_seconds = int(float(seconds or 0))
        
        # Ensure values are within valid ranges for time objects
        hours = min(total_seconds // 3600, 23)
        minutes = min((total_seconds % 3600) // 60, 59)
        secs = min(total_seconds % 60, 59)
        
        return time(hours, minutes, secs)
    except (TypeError, ValueError):
        # Return zero time if conversion fails
        return time(0, 0, 0)

def parse_timestamp(timestamp: str) -> Optional[datetime]:
    """
    Parse timestamp string to datetime.
    
    Handles various timestamp formats including ISO 8601.
    
    Args:
        timestamp: String timestamp in a recognizable format
        
    Returns:
        datetime object or None if parsing fails
    
    Example:
        >>> parse_timestamp("2023-01-15T14:30:45Z")
        datetime.datetime(2023, 1, 15, 14, 30, 45)
    """
    if not timestamp:
        return None
    
    try:
        # Handle ISO format with or without timezone indicator
        if timestamp.endswith('Z'):
            clean_ts = timestamp[:-1]
            dt = datetime.fromisoformat(clean_ts)
            # NOTE: This is a simplification; for production code, 
            # proper timezone handling would be needed
            return dt
        return datetime.fromisoformat(timestamp)
    except Exception:
        # Try other formats if ISO format fails
        formats_to_try = [
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d %H:%M:%S",
            "%Y/%m/%d %H:%M:%S",
            "%d/%m/%Y %H:%M:%S",
            "%m/%d/%Y %H:%M:%S",
            "%Y-%m-%d"
        ]
        
        for fmt in formats_to_try:
            try:
                return datetime.strptime(timestamp, fmt)
            except ValueError:
                continue
                
        return None

def format_duration(seconds: int) -> str:
    """
    Format duration in seconds to HH:MM:SS string.
    
    Args:
        seconds: Duration in seconds
        
    Returns:
        Formatted string in HH:MM:SS format
    
    Example:
        >>> format_duration(3665)
        '01:01:05'
    """
    return str(timedelta(seconds=seconds))

def time_to_seconds(time_obj: time) -> int:
    """
    Convert time object to total seconds.
    
    Args:
        time_obj: time object to convert
        
    Returns:
        Total seconds as integer
    
    Example:
        >>> time_to_seconds(time(1, 1, 5))
        3665
    """
    return time_obj.hour * 3600 + time_obj.minute * 60 + time_obj.second

def get_date_range(start_date: datetime, days: int) -> tuple:
    """
    Generate a date range from start date for given number of days.
    
    Args:
        start_date: Starting date
        days: Number of days to include
        
    Returns:
        Tuple of (start_date, end_date) where end_date is inclusive
    
    Example:
        >>> start = datetime(2023, 1, 1)
        >>> get_date_range(start, 7)
        (datetime.datetime(2023, 1, 1, 0, 0), datetime.datetime(2023, 1, 7, 23, 59, 59))
    """
    end_date = start_date + timedelta(days=days-1)
    # Set end_date to end of day
    end_date = datetime.combine(end_date.date(), time(23, 59, 59))
    return (start_date, end_date)