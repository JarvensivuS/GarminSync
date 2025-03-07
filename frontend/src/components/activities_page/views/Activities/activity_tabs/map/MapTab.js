/**
 * MapTab Component
 * 
 * Displays a map visualization of an activity's GPS route using Leaflet.
 * The map automatically adjusts to fit the GPS data points and handles
 * responsive resizing.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.gpsData - Array of [latitude, longitude] points
 */
import React, { useRef, useEffect } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';

/**
 * Helper component to ensure map resizes correctly when container dimensions change
 */
function MapResizer() {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      // Set up a ResizeObserver to handle map container resizing
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(map.getContainer());

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [map]);

  return null;
}

const MapTab = ({ gpsData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const mapRef = useRef(null);

  useEffect(() => {
    // Ensure map invalidates its size when data changes
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [gpsData]);

  return (
    <Box 
      sx={{ 
        height: isSmallScreen ? 'calc(100vh - 200px)' : 'calc(100vh - 100px)', 
        width: '100%', 
        maxHeight: '600px',
        minHeight: '300px'
      }}
    >
      {gpsData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <MapContainer
            center={gpsData[0] || [0, 0]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={gpsData} color="red" />
            <MapResizer />
          </MapContainer>
        </ResponsiveContainer>
      ) : (
        <Typography>No GPS data available for this activity.</Typography>
      )}
    </Box>
  );
};

export default MapTab;