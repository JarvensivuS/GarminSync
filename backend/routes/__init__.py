"""
API route module initialization.

This module imports and exposes route blueprints for registration with the main Flask application.
Each blueprint handles a specific category of API endpoints (activities, health, sleep).
"""

from .activity_route import activity_routes
from .health_route import health_routes
from .sleep_route import sleep_routes

__all__ = ['activity_routes', 'health_routes', 'sleep_routes']