"""
Database models for the application.

This module defines the SQLAlchemy ORM models that represent the database
tables used in the application. Each class corresponds to a database table,
and includes column definitions, relationships, and helper methods.
"""

import os
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Time, Date, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session, relationship
from sqlalchemy.ext.declarative import declared_attr
from datetime import datetime, time
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database connection string from environment
DATABASE_CONNECTION_STRING = os.getenv('DATABASE_CONNECTION_STRING')
if not DATABASE_CONNECTION_STRING:
    raise ValueError("DATABASE_CONNECTION_STRING environment variable is not set.")

# Create database engine with optimized connection settings
engine = create_engine(
    DATABASE_CONNECTION_STRING,
    connect_args={'login_timeout': 30, 'timeout': 90},
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_use_lifo=True
)

# Create session factories
SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)
Base = declarative_base()

class Activities(Base):
    """
    Model representing activity data from fitness trackers.
    
    Each record represents a single activity (workout, run, etc.)
    with its associated metrics.
    """
    
    __tablename__ = 'activities'
    
    activity_id = Column(String(255), primary_key=True, doc="Unique identifier for the activity")
    locationName = Column(String(255), doc="Location name of the activity")
    start_time = Column(DateTime, doc="Start time of the activity")
    sport = Column(String(255), doc="Type of sport/activity")
    distance = Column(Float, doc="Distance in kilometers")
    elapsed_time = Column(Time, nullable=False, default=time.min, doc="Total elapsed time")
    avg_speed = Column(Float, doc="Average speed in km/h")
    max_speed = Column(Float, doc="Maximum speed in km/h")
    calories = Column(Integer, doc="Calories burned during activity")
    avg_hr = Column(Integer, doc="Average heart rate during activity")
    max_hr = Column(Integer, doc="Maximum heart rate during activity")
    steps = Column(Integer, doc="Total steps during activity")
    training_effect = Column(Float, doc="Training effect score")
    training_load = Column(Float, doc="Training load score")
    vO2MaxValue = Column(Float, doc="VO2 Max value")
    
    # Define relationship to ActivityRecords
    records = relationship("ActivityRecords", back_populates="activity", 
                          cascade="all, delete-orphan")

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the model instance to a dictionary for API responses.
        
        Returns:
            Dictionary representation of the activity
        """
        return {
            'activity_id': self.activity_id,
            'locationName': self.locationName,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'sport': self.sport,
            'distance': self.distance,
            'elapsed_time': str(self.elapsed_time) if self.elapsed_time else None,
            'avg_speed': self.avg_speed,
            'max_speed': self.max_speed,
            'calories': self.calories,
            'avg_hr': self.avg_hr,
            'max_hr': self.max_hr,
            'steps': self.steps,
            'training_effect': self.training_effect,
            'training_load': self.training_load,
            'vO2MaxValue': self.vO2MaxValue
        }


class ActivityRecords(Base):
    """
    Model representing individual data points within an activity.
    
    Each record corresponds to a single measurement point during an activity,
    typically recorded at regular intervals (e.g., every second or few seconds).
    """
    
    __tablename__ = 'activity_records'
    
    id = Column(Integer, primary_key=True, autoincrement=True, doc="Unique identifier for the record")
    activity_id = Column(String(255), ForeignKey('activities.activity_id'), doc="Reference to parent activity")
    record = Column(Integer, doc="Sequential record number within the activity")
    timestamp = Column(DateTime, doc="Timestamp when the data point was recorded")
    position_lat = Column(Float, doc="Latitude coordinate")
    position_long = Column(Float, doc="Longitude coordinate")
    altitude = Column(Float, doc="Altitude in meters")
    heart_rate = Column(Integer, doc="Heart rate in beats per minute")
    speed = Column(Float, doc="Instantaneous speed in km/h")
    
    # Define relationship to Activities
    activity = relationship("Activities", back_populates="records")

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the model instance to a dictionary for API responses.
        
        Returns:
            Dictionary representation of the activity record
        """
        return {
            'id': self.id,
            'activity_id': self.activity_id,
            'record': self.record,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'position': {
                'lat': self.position_lat,
                'lng': self.position_long
            } if self.position_lat and self.position_long else None,
            'altitude': self.altitude,
            'heart_rate': self.heart_rate,
            'speed': self.speed
        }


class SleepMetrics(Base):
    """
    Model representing sleep data from fitness trackers.
    
    Each record represents a single night's sleep with detailed metrics
    about sleep quality, duration, and patterns.
    """
    
    __tablename__ = 'sleep_metrics'
    
    date = Column(Date, primary_key=True, doc="Date of the sleep record")
    start_time = Column(DateTime, doc="Sleep start time") 
    end_time = Column(DateTime, doc="Sleep end time")
    total_sleep = Column(Time, nullable=False, default=time.min, doc="Total sleep duration")
    deep_sleep = Column(Time, nullable=False, default=time.min, doc="Time spent in deep sleep")
    light_sleep = Column(Time, nullable=False, default=time.min, doc="Time spent in light sleep")
    rem_sleep = Column(Time, nullable=False, default=time.min, doc="Time spent in REM sleep")
    awake_time = Column(Time, nullable=False, default=time.min, doc="Time spent awake during sleep session")
    avg_respiration = Column(Float, doc="Average respiration rate during sleep") 
    stress_during_sleep = Column(Float, doc="Average stress level during sleep") 

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the model instance to a dictionary for API responses.
        
        Returns:
            Dictionary representation of the sleep metrics
        """
        return {
            'date': self.date.isoformat() if self.date else None,
            'start_time': self.start_time.strftime("%Y-%m-%dT%H:%M:%S") if self.start_time else None,
            'end_time': self.end_time.strftime("%Y-%m-%dT%H:%M:%S") if self.end_time else None,
            'total_sleep': str(self.total_sleep) if self.total_sleep else "00:00:00",
            'deep_sleep': str(self.deep_sleep) if self.deep_sleep else "00:00:00",
            'light_sleep': str(self.light_sleep) if self.light_sleep else "00:00:00",
            'rem_sleep': str(self.rem_sleep) if self.rem_sleep else "00:00:00",
            'awake_time': str(self.awake_time) if self.awake_time else "00:00:00",
            'avg_respiration': self.avg_respiration,
            'stress_during_sleep': self.stress_during_sleep,
        }


class HealthSummary(Base):
    """
    Model representing daily health summary data.
    
    Each record contains aggregated health metrics for a single day,
    including heart rate, stress, activity, and body battery information.
    """
    
    __tablename__ = 'health_summary'
    
    id = Column(Integer, primary_key=True, autoincrement=True, doc="Unique identifier for the health summary")
    date = Column(Date, nullable=False, doc="Date of the health summary")
    resting_heart_rate = Column(Integer, doc="Daily resting heart rate")
    max_heart_rate = Column(Integer, doc="Maximum heart rate recorded for the day")
    avg_heart_rate = Column(Integer, doc="Average heart rate for the day")
    avg_stress = Column(Integer, doc="Average stress level for the day")
    max_stress = Column(Integer, doc="Maximum stress level recorded for the day")
    steps = Column(Integer, doc="Total steps for the day")
    intensity_minutes = Column(Integer, doc="Minutes of moderate to vigorous physical activity")
    active_calories = Column(Integer, doc="Calories burned from activity (excluding BMR)")
    body_battery_charged = Column(Integer, doc="Body battery points gained during the day")
    body_battery_drained = Column(Integer, doc="Body battery points used during the day")

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the model instance to a dictionary for API responses.
        
        Returns:
            Dictionary representation of the health summary
        """
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'resting_heart_rate': self.resting_heart_rate,
            'max_heart_rate': self.max_heart_rate,
            'avg_heart_rate': self.avg_heart_rate,
            'avg_stress': self.avg_stress,
            'max_stress': self.max_stress,
            'steps': self.steps,
            'intensity_minutes': self.intensity_minutes,
            'active_calories': self.active_calories,
            'body_battery': {
                'charged': self.body_battery_charged,
                'drained': self.body_battery_drained,
                'net': (self.body_battery_charged - self.body_battery_drained) if self.body_battery_charged and self.body_battery_drained else None
            }
        }


class User(Base):
    """
    Model representing user information.
    
    Stores basic user data and preferences for the application.
    """
    
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True, doc="Unique identifier for the user")
    username = Column(String(255), unique=True, nullable=False, doc="User's username")
    email = Column(String(255), unique=True, nullable=False, doc="User's email address")
    first_name = Column(String(255), doc="User's first name")
    last_name = Column(String(255), doc="User's last name")
    created_at = Column(DateTime, default=datetime.utcnow, doc="Account creation timestamp")
    last_login = Column(DateTime, doc="Last login timestamp")
    
    # User preferences
    measurement_system = Column(String(50), default="metric", doc="User's preferred measurement system (metric/imperial)")
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the model instance to a dictionary for API responses.
        
        Returns:
            Dictionary representation of the user
        """
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': f"{self.first_name} {self.last_name}".strip() if self.first_name or self.last_name else None,
            'preferences': {
                'measurement_system': self.measurement_system
            },
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


def get_db():
    """
    Generator function that yields a database session and ensures it's closed properly.
    
    This function is designed to be used with a context manager or dependency injection
    system to manage database session lifecycle.
    
    Yields:
        SQLAlchemy session object
    """
    db = Session()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize the database by creating all defined tables.
    
    This function should be called when setting up the application for the first time
    or after modifying the database schema.
    """
    Base.metadata.create_all(engine)