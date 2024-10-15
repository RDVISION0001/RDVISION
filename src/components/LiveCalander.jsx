import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';

function LiveCalander() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calenderData, setCalenderData] = useState([]);
  const [calenderDataForUploaded, setCalenderDataForuploaded] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const { followupState } = useAuth()

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

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const handleDateClick = (day) => {
    setCurrentDate(new Date(currentYear, currentMonth, day));
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">

        {/* <h4>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h4> */}
        <div className="d-flex justify-content-between m-3">
          <button className="btn btn-secondary" onClick={goToPreviousMonth}>Previous</button>
          <h2 >
            {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </h2>
          <button className="btn btn-secondary" onClick={goToNextMonth}>Next</button>
        </div>

        <div className="text-center" style={{ marginTop: "50px" }}>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {daysOfWeek.map((day) => (
              <div key={day} className="font-weight-bold">{day}</div>
            ))}

            {calendarDays.map((day, index) => {
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
            })}
          </div>

        </div>
      </div>
    </div>

  );
}

export default LiveCalander;
