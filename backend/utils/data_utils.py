"""
Utility functions for data processing and conversion.

This module provides helper functions for parsing and transforming
data from various formats, handling type conversions safely, and
processing specialized data formats like GPX.
"""

import logging
import xml.etree.ElementTree as ET
from datetime import datetime, time
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

def safe_float(value: Any) -> Optional[float]:
    """
    Safely convert a value to float, returning None if conversion fails.
    
    Args:
        value: Value to convert to float
        
    Returns:
        Float value or None if conversion fails
    """
    if value is None:
        return None
        
    try:
        return float(value)
    except (TypeError, ValueError):
        logger.debug(f"Could not convert '{value}' to float")
        return None

def safe_int(value: Any) -> Optional[int]:
    """
    Safely convert a value to integer, returning None if conversion fails.
    
    Args:
        value: Value to convert to integer
        
    Returns:
        Integer value or None if conversion fails
    """
    if value is None:
        return None
        
    try:
        return int(value)
    except (TypeError, ValueError):
        logger.debug(f"Could not convert '{value}' to integer")
        return None

def seconds_to_time(seconds: Any) -> time:
    """
    Convert seconds to time object.
    
    Args:
        seconds: Number of seconds (int, float, or string)
        
    Returns:
        time object representing the duration
    """
    try:
        total_seconds = int(float(seconds or 0))
        # Ensure values are within valid ranges for time objects
        hours = min(total_seconds // 3600, 23)
        minutes = min((total_seconds % 3600) // 60, 59)
        secs = min(total_seconds % 60, 59)
        return time(hours, minutes, secs)
    except (TypeError, ValueError):
        logger.debug(f"Could not convert '{seconds}' to time")
        return time(0, 0, 0)

def parse_timestamp(timestamp_str: str) -> Optional[datetime]:
    """
    Parse ISO timestamp string to datetime.
    
    Args:
        timestamp_str: ISO format timestamp string
        
    Returns:
        datetime object or None if parsing fails
    """
    if not timestamp_str:
        return None
        
    try:
        # Handle timestamps with or without 'Z' timezone indicator
        clean_ts = timestamp_str.rstrip('Z')
        return datetime.fromisoformat(clean_ts)
    except (ValueError, AttributeError) as e:
        logger.debug(f"Error parsing timestamp '{timestamp_str}': {e}")
        return None

def parse_gpx(gpx_data: str) -> List[Dict[str, Any]]:
    """
    Parse GPX XML data into a list of track points.
    
    Args:
        gpx_data: String containing GPX XML data
        
    Returns:
        List of dictionaries containing parsed track point data
    """
    if not gpx_data:
        logger.warning("Empty GPX data provided")
        return []
        
    try:
        root = ET.fromstring(gpx_data)
        namespace = {'gpx': 'http://www.topografix.com/GPX/1/1'}
        track_points = root.findall('.//gpx:trkpt', namespace)
        
        gps_data = []
        for point in track_points:
            try:
                # Extract basic point data
                point_data = {
                    'lat': float(point.get('lat')),
                    'lon': float(point.get('lon')),
                    'time': datetime.fromisoformat(point.find('gpx:time', namespace).text.rstrip('Z')),
                }
                
                # Add elevation if available
                ele_elem = point.find('gpx:ele', namespace)
                if ele_elem is not None:
                    point_data['ele'] = safe_float(ele_elem.text)
                
                # Add heart rate if available
                hr_elem = point.find('.//gpx:hr', namespace)
                if hr_elem is not None:
                    point_data['hr'] = safe_int(hr_elem.text)
                
                # Add speed if available
                speed_elem = point.find('.//gpx:speed', namespace)
                if speed_elem is not None:
                    point_data['speed'] = safe_float(speed_elem.text)
                
                gps_data.append(point_data)
                
            except Exception as e:
                logger.warning(f"Error parsing track point: {e}")
                continue
        
        logger.info(f"Successfully parsed {len(gps_data)} GPS points from GPX data")
        return gps_data
        
    except Exception as e:
        logger.error(f"Error parsing GPX data: {e}")
        return []