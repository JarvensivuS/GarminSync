"""
Activity data API endpoints.

This module defines REST API endpoints for accessing activity-related data
including workouts, GPS tracks, and performance metrics. Each endpoint returns
data in JSON format with appropriate HTTP status codes.
"""

from flask import Blueprint, jsonify
from backend.core.create_db import get_db
from backend.models.models import Activities, ActivityRecords
from sqlalchemy import func, extract
import logging
from datetime import datetime
from backend.data.sync import sync_all_data 

logger = logging.getLogger(__name__)
activity_routes = Blueprint('activities', __name__, url_prefix='/api')

@activity_routes.route('/activities/sync', methods=['POST'])
def sync_activities():
    """
    Synchronize activities from Garmin Connect to the local database.
    
    Endpoint: POST /api/activities/sync
    
    Returns:
        JSON response with sync status and message
    """
    logger.info("Sync endpoint hit")  
    try:
        logger.info("Starting sync process")  
        sync_success = sync_all_data(force=True)
        
        if sync_success:
            logger.info("Sync completed successfully")  
            return jsonify({
                "message": "Activities synced successfully",
                "status": "success"
            }), 200
        else:
            logger.error("Sync failed")  
            return jsonify({
                "message": "Failed to sync activities",
                "status": "error"
            }), 500
            
    except Exception as e:
        logger.error(f"Error during activity sync: {e}")
        return jsonify({
            "message": "Failed to sync activities",
            "status": "error",
            "error": str(e)
        }), 500


@activity_routes.route('/activities/max_values', methods=['GET'])
def get_max_values():
    """
    Retrieve maximum values for activity metrics.
    
    Endpoint: GET /api/activities/max_values
    
    Returns:
        JSON response with maximum values for distance, duration, speed, etc.
    """
    db = next(get_db())
    try:
        max_values = {
            'Distance': db.query(func.max(Activities.distance)).scalar() or 0,
            'Duration': db.query(func.max(
                (extract('hour', Activities.elapsed_time) * 3600) +
                (extract('minute', Activities.elapsed_time) * 60) +
                extract('second', Activities.elapsed_time)
            )).scalar() or 0,
            'Avg Speed': db.query(func.max(Activities.avg_speed)).scalar() or 0,
            'Calories': db.query(func.max(Activities.calories)).scalar() or 0,
            'Avg HR': db.query(func.max(Activities.avg_hr)).scalar() or 0
        }
        return jsonify(max_values), 200
    except Exception as e:
        logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500
    finally:
        db.close()

@activity_routes.route('/activities', methods=['GET'])
def get_activities():
    """
    Retrieve all activities.
    
    Endpoint: GET /api/activities
    
    Returns:
        JSON array of all activities in descending chronological order
    """
    db = next(get_db())
    try:
        activities = db.query(Activities).order_by(Activities.start_time.desc()).all()
        return jsonify([activity.to_dict() for activity in activities]), 200
    except Exception as e:
        logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500
    finally:
        db.close()

@activity_routes.route('/activities/<activity_id>/gps', methods=['GET'])
def get_activity_gps(activity_id):
    """
    Retrieve GPS data for a specific activity.
    
    Endpoint: GET /api/activities/<activity_id>/gps
    
    Args:
        activity_id: Unique identifier for the activity
        
    Returns:
        JSON array of GPS coordinates (lat, long)
    """
    db = next(get_db())
    try:
        records = db.query(ActivityRecords)\
            .filter_by(activity_id=activity_id)\
            .order_by(ActivityRecords.record)\
            .all()
        gps_data = [(record.position_lat, record.position_long) 
                    for record in records 
                    if record.position_lat and record.position_long]
        return jsonify(gps_data), 200
    except Exception as e:
        logger.error(f"Error fetching GPS data: {e}")
        return jsonify({"error": "Error fetching GPS data"}), 500
    finally:
        db.close()