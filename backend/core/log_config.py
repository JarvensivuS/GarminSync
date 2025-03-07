"""
Logging configuration for the application.

This module configures the application's logging system, setting up
console and file handlers with appropriate formatting and log levels.
"""

import logging

def setup_logging():
    """
    Configure application logging with consistent formatting.
    
    Sets up:
    - Console logging for INFO and above
    - File logging for all levels
    - Reduces verbosity from third-party libraries
    """
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Reduce noise from frequently chatty libraries
    logging.getLogger('urllib3').setLevel(logging.WARNING)
    logging.getLogger('sqlalchemy').setLevel(logging.WARNING)
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    
    # Get the root logger for further configuration
    root_logger = logging.getLogger()
    
    # Create file handler for persistent logging
    try:
        file_handler = logging.FileHandler('app.log')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(
            logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        )
        root_logger.addHandler(file_handler)
    except (IOError, PermissionError) as e:
        # Gracefully handle permission issues with log files
        logging.warning(f"Could not set up file logging: {e}")