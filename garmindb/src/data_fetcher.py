from models import Session, Activities
from garmin_client import initialize_garmin_client
from datetime import timedelta
from sqlalchemy.exc import SQLAlchemyError

client = initialize_garmin_client()

def seconds_to_time(seconds):
    """Convert seconds to HH:MM:SS format."""
    return str(timedelta(seconds=seconds))

def fetch_and_store_activities():
    session = Session()
    try:
        activities = client.get_activities(start=0, limit=100)
        
        for activity in activities:
            existing_activity = session.query(Activities).filter_by(activity_id=activity.get("activityId")).first()
            
            if not existing_activity:
                new_activity = Activities(
                    activity_id=activity["activityId"],
                    locationName=activity["locationName"],
                    start_time=activity["startTimeLocal"],
                    sport=activity["activityType"]["typeKey"],
                    distance=round(activity["distance"] / 1000, 2),
                    elapsed_time=seconds_to_time(activity["duration"]),
                    avg_speed = round(activity["averageSpeed"] * 3.6, 2),
                    max_speed = round(activity["maxSpeed"] * 3.6, 2),
                    calories=activity["calories"],
                    avg_hr=activity.get("averageHR"),
                    max_hr=activity.get("maxHR"),
                    steps=activity.get("steps"),
                    training_effect=round(activity.get("aerobicTrainingEffect", 0), 2),
                    training_load=round(activity.get("activityTrainingLoad", 0), 2),
                    vO2MaxValue=round(activity.get("vO2MaxValue", 0), 2),
                )
                session.add(new_activity)
        
        session.commit()
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error fetching or storing activities: {e}")
    finally:
        session.close()
