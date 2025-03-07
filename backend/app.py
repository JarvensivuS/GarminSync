"""
Main application entry point for the Fitness Activity Tracker backend.

This module initializes the Flask application, registers blueprints,
configures CORS, and starts the server. It also validates required configuration
before startup to ensure the application can connect to necessary services.
"""

from flask import Flask
from flask_cors import CORS
from backend.core.config import Config
from backend.core.log_config import setup_logging
from backend.routes.activity_route import activity_routes
from backend.routes.health_route import health_routes
from backend.routes.sleep_route import sleep_routes
from backend.data.sync import sync_all_data
from backend.core.garmin_client import garmin_client
import logging

# Set up application logging
setup_logging()
logger = logging.getLogger(__name__)

def create_app():
    """
    Create and configure the Flask application.
    
    Returns:
        Flask: The configured Flask application instance.
        
    Raises:
        ValueError: If required configuration is missing.
    """
    try:
        # Validate configuration before starting
        Config.validate()
        # Initialize Garmin client to validate connectivity
        garmin_client
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise

    # Create Flask app
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Register API blueprints
    logger.info("Registering blueprints...")  
    app.register_blueprint(activity_routes)
    app.register_blueprint(health_routes)
    app.register_blueprint(sleep_routes)
    
    # Log all registered routes for debugging
    logger.info("Registered routes:")  
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.rule}")
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=int(Config.PORT))