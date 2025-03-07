# Fitness Activity Tracker

A full-stack application that integrates with Garmin Connect to track and analyze fitness activities, designed to demonstrate API integration, data processing, and visualization capabilities.

## Project Overview

This project showcases my backend and frontend development skills by implementing a system that:

- Integrates with the Garmin Connect API to retrieve fitness activity data
- Processes and stores activity data in a SQL database using SQLAlchemy ORM
- Exposes REST API endpoints for data retrieval and manipulation
- Visualizes activity data with charts and statistics
- Provides a responsive React-based frontend

## Architecture

The application follows a modern layered architecture:

1. **Data Layer**
   - Connects to Garmin Connect API
   - Processes activity data
   - Stores data in a SQL database using SQLAlchemy ORM

2. **Service Layer**
   - Implements business logic
   - Performs data analysis
   - Manages data transformation

3. **API Layer**
   - RESTful endpoints for data access
   - JSON response formatting
   - Error handling

4. **Presentation Layer**
   - React-based responsive UI
   - Data visualization with Recharts
   - Material UI components

## Technology Stack

- **Backend**: Python, Flask
- **Database**: SQLAlchemy with Azure SQL Database
- **APIs**: Garmin Connect API integration
- **Data Processing**: Python data analysis tools
- **Frontend**: React, Material UI, Recharts
- **Deployment**: Azure Web App

## Core Features

- **Automated Data Acquisition**: Connects to Garmin Connect to fetch activity data
- **Data Analysis**: Extracts meaningful insights from fitness data
- **API Endpoints**: Provides access to activity data through REST endpoints
- **Visualization**: Interactive dashboard showing activity metrics
- **Profile Page**: Displays user's fitness statistics and performance trends

## Project Structure

```
fitness-tracker/
├── backend/           # Flask application
│   ├── core/          # Core functionality
│   ├── routes/        # API endpoints
│   ├── models/        # Database models
│   ├── data/          # Data processing
│   └── utils/         # Utility functions
├── frontend/          # React application
│   ├── public/        # Static files
│   └── src/           # React components
│       ├── components/# UI components
│       ├── hooks/     # Custom React hooks
│       ├── utilities/ # Helper functions
│       └── styles/    # CSS files
└── garmindb/          # Third-party Garmin database library
```

## Sample API Endpoints

- `GET /api/activities` - Retrieve all activities
- `GET /api/activities/<activity_id>` - Get a specific activity
- `GET /api/activities/<activity_id>/gps` - Get GPS data for an activity
- `POST /api/activities/sync` - Trigger new data fetch from Garmin

## Frontend Features

- Dashboard with activity statistics
- Activity list with filtering and sorting options
- Detailed activity view with performance metrics
- Interactive maps showing activity routes
- Performance trends over time

## Project Setup (For Reference Only)

This repository is primarily intended as a code showcase and not for direct deployment. However, for reference, here are the basic requirements to run this application:

### Requirements
- Python 3.9+
- Node.js 16+
- Azure SQL Database or SQL Server
- Garmin Connect account

### Environment Setup
1. Copy `.env.example` to `.env` and configure the environment variables
2. Backend requires the Python packages listed in `requirements.txt`
3. Frontend requires React with dependencies listed in the frontend package.json

Note: The third-party Garmin API integration requires valid Garmin Connect credentials.

## Credits

This project uses the [GarminDB](https://github.com/tcgoetz/GarminDB) library for Garmin data handling, extending it with a modern web interface and custom analysis capabilities.