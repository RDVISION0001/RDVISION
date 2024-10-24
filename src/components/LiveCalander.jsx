import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize localizer for moment
const localizer = momentLocalizer(moment);

function LiveCalander() {
  const [calenderData, setCalenderData] = useState([]);
  const [calenderDataForUploaded, setCalenderDataForuploaded] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month'); // Default view is "month"
  const { followupState } = useAuth();

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    fetchData();
    fetchUploadedData();
  }, [followupState]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/third_party_api/ticket/followUpByDate/${localStorage.getItem("userId")}`);
      setCalenderData(response.data.response);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const fetchUploadedData = async () => {
    try {
      const response = await axiosInstance.get(`/upload/followUpByDate/${localStorage.getItem("userId")}`);
      setCalenderDataForuploaded(response.data.response);
    } catch (error) {
      console.error("Error fetching uploaded calendar data:", error);
    }
  };

  // Combine both calendar data and uploaded data into events array
  useEffect(() => {
    const combinedEvents = [
      ...calenderData.map((item) => ({
        title: `Live Follow-up: ${item['no of tickets']}`,
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: false, // Respect time slots
        type: 'live',
      })),
      ...calenderDataForUploaded.map((item) => ({
        title: `ABC Follow-up: ${item['no of tickets']}`,
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: false,
        type: 'uploaded',
      })),
    ];
    setEvents(combinedEvents);
  }, [calenderData, calenderDataForUploaded]);

  // Handle view change (Today, Week, Month)
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Move to today's date
  const goToToday = () => {
    handleViewChange('day');
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Calendar */}
        <div style={{ height: '80vh', width: '100%' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['day', 'week', 'month']}
            defaultView="month"
            view={currentView}
            onView={(view) => setCurrentView(view)}
            style={{ height: '100%' }}
            eventPropGetter={(event) => {
              let style = {};
              if (event.type === 'live') {
                style = { backgroundColor: '#f44336', color: 'white' };
              } else if (event.type === 'uploaded') {
                style = { backgroundColor: '#ff9800', color: 'white' };
              }
              return { style };
            }}
            onSelectEvent={(event) => openInNewTab("/in_negotiation")}            
            timeslots={2}
            step={30}
            showMultiDayTimes
          />
        </div>
      </div>
    </div>
  );
}

export default LiveCalander;
