import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

function LiveCalander() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calenderData, setCalenderData] = useState([]);
  const [calenderDataForUploaded, setCalenderDataForuploaded] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    fetchData();
    fetchUploadedData();
  }, []);

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

  return (
    <div>
      <div className="container mt-4" style={{ maxWidth: '1200px' }}>
        <div className="text-center">
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </h2>
          <div className="d-flex justify-content-between my-3">
            <button className="btn btn-primary" onClick={goToPreviousMonth}>
              Previous
            </button>
            <button className="btn btn-primary" onClick={goToNextMonth}>
              Next
            </button>
          </div>

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
                highlightClass = 'bg-success'; // Both datasets highlight the cell
              } else if (isHighlighted) {
                highlightClass = 'bg-danger'; // Only calenderData highlights the cell
              } else if (isUploadedHighlighted) {
                highlightClass = 'bg-warning'; // Only calenderDataForUploaded highlights the cell
              }

              return (
                <div key={index} className={`dateHover p-2 border text-center ${highlightClass}`}>
                  <div className='detailsBox'>
                    {day ? `${day}/${currentMonth + 1}/${currentYear}` : ""}
                    <span>
                      {isHighlighted && (
                        <div className='text-black bg-danger px-2 rounded'>
                          Live follow-up tickets: {ticketCount}
                        </div>
                      )}
                      {isUploadedHighlighted && (
                        <div className='text-black bg-warning px-2 rounded m-2'>
                          ABC follow-up tickets: {uploadedTicketCount}
                        </div>
                      )}
                      {!isHighlighted && !isUploadedHighlighted && (
                        <div className='text-black bg-warning px-2 rounded m-2'>No Followup today</div>
                      )}
                    </span>

                  </div>
                  {day}
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
