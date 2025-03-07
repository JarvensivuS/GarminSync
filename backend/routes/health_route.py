"""
Health data API endpoints.

This module defines REST API endpoints for accessing health-related data 
including heart rate, stress levels, steps, and other daily health metrics.
Each endpoint returns data in JSON format with appropriate HTTP status codes.
"""

from flask import Blueprint, jsonify
from backend.core.create_db import get_db
from backend.models.models import HealthSummary
import logging

logger = logging.getLogger(__name__)
health_routes = Blueprint('health', __name__, url_prefix='/api')

@health_routes.route('/health', methods=['GET'])
def get_health_data():
    """
    Retrieve all health summary records.
    
    Endpoint: GET /api/health
    
    Returns:
        JSON array of daily health summaries in descending chronological order
    """
    db = next(get_db())
    try:
        health_records = db.query(HealthSummary)\
            .order_by(HealthSummary.date.desc())\
            .all()
        return jsonify([record.to_dict() for record in health_records]), 200
    except Exception as e:
        logger.error(f"Error fetching health data: {e}")
        return jsonify({"error": "Failed to fetch health data"}), 500
    finally:
        db.close()