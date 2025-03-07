"""
Database connection management for the application.

This module provides functions for establishing and managing database connections
using SQLAlchemy. It sets up connection pooling and provides a context manager
pattern for handling database sessions.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import QueuePool
from .config import Config
import logging

logger = logging.getLogger(__name__)

# Create database engine with connection pooling for better performance
engine = create_engine(
    Config.SQLALCHEMY_DATABASE_URI,
    pool_size=5,  # Number of connections to keep open
    max_overflow=10,  # Maximum number of connections to create beyond pool_size
    pool_timeout=30,  # Seconds to wait before giving up on getting a connection
    pool_recycle=3600,  # Recycle connections after 1 hour to prevent stale connections
    pool_pre_ping=True  # Verify connections before using them
)

# Create session factory for creating new database sessions
SessionFactory = sessionmaker(bind=engine)

# Create thread-local session registry
Session = scoped_session(SessionFactory)

def get_db():
    """
    Context manager for database sessions.
    
    This generator function creates a database session, yields it for use in a
    with statement, and ensures the session is properly closed afterward, even
    if exceptions occur.
    
    Yields:
        SQLAlchemy Session: A database session for executing queries
        
    Example:
        ```python
        from backend.core.create_db import get_db
        
        # Using the session in a with statement
        with next(get_db()) as db:
            result = db.query(User).all()
            
        # Or as a simple variable
        db = next(get_db())
        try:
            result = db.query(User).all()
        finally:
            db.close()
        ```
    """
    db = Session()
    try:
        logger.debug("Database session created")
        yield db
    finally:
        db.close()
        logger.debug("Database session closed")