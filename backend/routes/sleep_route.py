"""
Sleep data API endpoints.

This module defines REST API endpoints for accessing sleep-related data
including sleep duration, sleep stages, and sleep quality metrics.
Each endpoint returns data in JSON format with appropriate HTTP status codes.
"""

from flask import Blueprint, jsonify
from backend.core.create_db import get_db
from backend.models.models import SleepMetrics
import logging

logger = logging.getLogger(__name__)
sleep_routes = Blueprint('sleep', __name__, url_prefix='/api')

@sleep_routes.route('/sleep', methods=['GET'])
def get_sleep_data():
    """
    Retrieve all sleep records.
    
    Endpoint: GET /api/sleep
    
    Returns:
        JSON array of sleep records in descending chronological order
    """
    db = next(get_db())
    try:
        sleep_records = db.query(SleepMetrics)\
            .order_by(SleepMetrics.date.desc())\
            .all()
        return jsonify([record.to_dict() for record in sleep_records]), 200
    except Exception as e:
        logger.error(f"Error fetching sleep data: {e}")
        return jsonify({"error": "Failed to fetch sleep data"}), 500
    finally:
        db.close()