"""
Logging configuration utilities.

This module provides functions for setting up and configuring application
logging, including file handlers, formatters, and log levels for
different components.
"""

import logging
import os
from logging.handlers import RotatingFileHandler
import sys

def setup_enhanced_logging():
    """
    Set up enhanced logging with file rotation and console output.
    
    Creates:
    - Log directory if it doesn't exist
    - Rotating file handler with size-based rotation
    - Console handler for standard output
    - Configured formatters for both handlers
    
    Also reduces logging verbosity for common third-party libraries.
    """
    if not os.path.exists('logs'):
        os.makedirs('logs')

    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    formatter = logging.Formatter(log_format)

    # Configure file handler with rotation
    file_handler = RotatingFileHandler(
        'logs/garmin_connect.log',
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5           # Keep 5 backup files
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.DEBUG)

    # Configure console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.INFO)

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    # Reduce noise from frequently chatty libraries
    logging.getLogger('urllib3').setLevel(logging.WARNING)
    logging.getLogger('requests').setLevel(logging.WARNING)