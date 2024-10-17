import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';

function LiveCalander() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calenderData, setCalenderData] = useState([]);
  const [calenderDataForUploaded, setCalenderDataForuploaded] = useState([]);
  const [viewType, setViewType] = useState('month'); // State to manage the view type

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const { followupState } = useAuth();

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

  const getHighlightedDates = () => {
    const ticketMap = new Map(
      calenderData.map(item => [new Date(item.date).toDateString(), item['no of tickets']])
    );
    return ticketMap;
  };

  const getUploadedHighlightedDates = () => {
    const uploadedMap = new Map(
      calenderDataForUploaded.map(item => [new Date(item.date).toDateString(), item['no of tickets']])
    );
    return uploadedMap;
  };

  const highlightedDates = getHighlightedDates();
  const uploadedHighlightedDates = getUploadedHighlightedDates();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];

  const renderCalendarDays = () => {
    const daysToRender = [];
    const today = new Date();

    if (viewType === 'day') {
      daysToRender.push(today.getDate());
    } else if (viewType === 'workingWeek') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Set to Monday
      for (let i = 0; i < 7; i++) { // Only push 5 days (Monday to Friday)
        const dayToRender = new Date(weekStart);
        dayToRender.setDate(weekStart.getDate() + i);
        daysToRender.push(dayToRender.getDate());
      }
    } else if (viewType === 'week') {
      const weekStartFull = new Date(currentDate);
      weekStartFull.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday
      for (let i = 0; i < 7; i++) {
        const dayToRender = new Date(weekStartFull);
        dayToRender.setDate(weekStartFull.getDate() + i);
        daysToRender.push(dayToRender.getDate());
      }
    } else {
      for (let i = 1; i <= daysInMonth; i++) {
        daysToRender.push(i);
      }
    }

    return daysToRender.map((day, index) => {
      const dateString = day ? new Date(currentYear, currentMonth, day).toDateString() : '';
      const isHighlighted = dateString && highlightedDates.has(dateString);
      const isUploadedHighlighted = dateString && uploadedHighlightedDates.has(dateString);

      const ticketCount = isHighlighted ? highlightedDates.get(dateString) : 0;
      const uploadedTicketCount = isUploadedHighlighted ? uploadedHighlightedDates.get(dateString) : 0;

      let highlightClass = '';
      if (isHighlighted && isUploadedHighlighted) {
        highlightClass = 'text-success'; // Both datasets highlight the cell
      } else if (isHighlighted) {
        highlightClass = 'text-danger'; // Only calenderData highlights the cell
      } else if (isUploadedHighlighted) {
        highlightClass = 'text-warning'; // Only calenderDataForUploaded highlights the cell
      }

      return (
        <div key={index} className={`p-2 border text-center ${highlightClass}`}
          style={{ minWidth: '100px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {day ? `${day}/${currentMonth + 1}/${currentYear}` : ''}
          {isHighlighted && (
            <div className="text-white bg-danger px-2 rounded">
              Live follow-up tickets: {ticketCount}
            </div>
          )}
          {isUploadedHighlighted && (
            <div className="text-white bg-warning px-2 rounded m-2">
              ABC follow-up tickets: {uploadedTicketCount}
            </div>
          )}
        </div>
      );
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const handleDateClick = (day) => {
    setCurrentDate(new Date(currentYear, currentMonth, day));
  };

  const handleViewChange = (type) => {
    setViewType(type);
    const today = new Date();
    switch (type) {
      case 'day':
        setCurrentDate(today);
        break;
      case 'workingWeek':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
        setCurrentDate(weekStart);
        break;
      case 'week':
        const weekStartFull = new Date(today);
        weekStartFull.setDate(today.getDate() - today.getDay()); // Set to Sunday
        setCurrentDate(weekStartFull);
        break;
      case 'month':
        setCurrentDate(today);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">

        <div className="d-flex justify-content-between m-3">
          <button className="btn btn-secondary" onClick={goToPreviousMonth}>Previous</button>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </h2>
          <button className="btn btn-secondary" onClick={goToNextMonth}>Next</button>
        </div>

        <div className="d-flex justify-content-around mb-4">
          <button
            className={`btn ${viewType === 'day' ? 'bg-success text-white shadow-xl transform active:translate-y-1 transition-all' : 'btn-primary shadow-lg'} rounded`}
            onClick={() => handleViewChange('day')}
          >
            Day
          </button>
          <button
            className={`btn ${viewType === 'workingWeek' ? 'bg-success text-white shadow-xl transform active:translate-y-1 transition-all' : 'btn-primary shadow-lg'} rounded`}
            onClick={() => handleViewChange('workingWeek')}
          >
            Working Week
          </button>
          <button
            className={`btn ${viewType === 'week' ? 'bg-success text-white shadow-xl transform active:translate-y-1 transition-all' : 'btn-primary shadow-lg'} rounded`}
            onClick={() => handleViewChange('week')}
          >
            Week
          </button>
          <button
            className={`btn ${viewType === 'month' ? 'bg-success text-white shadow-xl transform active:translate-y-1 transition-all' : 'btn-primary shadow-lg '} rounded`}
            onClick={() => handleViewChange('month')}
          >
            Month
          </button>
        </div>

        <div className="text-center" style={{ marginTop: "50px" }}>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {daysOfWeek.map((day) => (
              <div key={day} className="font-weight-bold">{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveCalander;
