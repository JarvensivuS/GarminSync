from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import Config
import datetime

engine = create_engine(Config.DATABASE_CONNECTION_STRING)
Session = sessionmaker(bind=engine)
Base = declarative_base()

class Activities(Base): 
    __tablename__ = 'activities'
    
    activity_id = Column(String(255), primary_key=True)
    locationName = Column(String(255))
    start_time = Column(DateTime)
    sport = Column(String(255))
    distance = Column(Float)
    elapsed_time = Column(Time, nullable=False, default=datetime.time.min)
    avg_speed = Column(Float)
    max_speed = Column(Float)
    calories = Column(Integer)
    avg_hr = Column(Integer)
    max_hr = Column(Integer)
    steps = Column(Integer)
    training_effect = Column(Float)
    training_load = Column(Float)
    vO2MaxValue = Column(Float)

# Create all tables
Base.metadata.create_all(engine)
