"""
Sleep data fetcher module.

This module handles retrieving sleep data from Garmin Connect,
processing it through the appropriate processors, and storing
it in the database.
"""

import logging
from datetime import datetime, timedelta
from backend.core.garmin_client import GarminClient
from backend.core.create_db import get_db
from backend.models.models import SleepMetrics
from backend.data.processors.sleep_processor import process_sleep_data

logger = logging.getLogger(__name__)

def fetch_and_store_sleep_data(client=None):
    """
    Fetch sleep data from Garmin Connect and store it in the database.
    
    Args:
        client: Optional GarminClient instance. If None, a new instance will be created.
    """
    if client is None:
        client = GarminClient()
    
    db = next(get_db())
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        current_date = start_date
        records_processed = 0
        
        while current_date.date() <= end_date.date():
            try:
                sleep_data = client.get_sleep_data(current_date.strftime("%Y-%m-%d"))
                
                if sleep_data and isinstance(sleep_data, dict):
                    if sleep_data.get('privacyProtected'):
                        logger.warning(f"Sleep data for {current_date.date()} is privacy protected")
                        sleep_data = client.get_user_summary(current_date.strftime("%Y-%m-%d"))
                    
                    if not sleep_data.get('privacyProtected'):
                        new_sleep = process_sleep_data(sleep_data, current_date)
                        
                        # Add null check here
                        if new_sleep is not None:
                            existing = db.query(SleepMetrics).filter_by(
                                date=current_date.date()
                            ).first()
                            
                            if existing:
                                for key, value in new_sleep.__dict__.items():
                                    if key != '_sa_instance_state':
                                        setattr(existing, key, value)
                            else:
                                db.add(new_sleep)
                                
                            db.commit()
                            records_processed += 1
                        else:
                            logger.debug(f"No valid sleep data for {current_date.date()}")
                        
            except Exception as e:
                logger.error(f"Error processing sleep data for {current_date}: {e}")
                db.rollback()
            
            current_date += timedelta(days=1)
            
        logger.info(f"Processed {records_processed} sleep records")
        
    except Exception as e:
        logger.error(f"Error in sleep data fetch: {e}")
        raise
    finally:
        db.close()