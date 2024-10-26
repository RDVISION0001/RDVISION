import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function LiveCalander() {
  const [calenderData, setCalenderData] = useState([]);
  const [calenderDataForUploaded, setCalenderDataForuploaded] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const { followupState } = useAuth();

  const openInNewTab = (url, eventDate) => {
    // Format the event date to 'YYYY-MM-DD'
    const formattedDate = moment(eventDate).format('YYYY-MM-DD');
    console.log("Event Date:", formattedDate); // Log the formatted date
    window.open(`/in_negotiation/${formattedDate}`, '_blank', 'noopener,noreferrer');
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

  useEffect(() => {
    const combinedEvents = [
      ...calenderData.map((item) => ({
        title: `Live Follow-up: ${item['no of tickets']}`,
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: false,
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

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const goToToday = () => {
    handleViewChange('day');
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
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
            onSelectEvent={(event) => openInNewTab("/in_negotiation", event.start)}
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
