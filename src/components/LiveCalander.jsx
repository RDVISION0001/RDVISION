import React, { useState } from 'react'

function LiveCalander() {
    const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const date ="2024-08-22"

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create an array to hold the calendar days
  const calendarDays = [];

  // Add empty slots for days of the previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add the days of the current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };
console.log(date.split("-")[2])
  return (
    <div><div className="container mt-4" style={{ maxWidth: '1200px' }}>
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

        {calendarDays.map((day, index) => (
          <div key={index} className="dateHover p-2 border text-center " >
            <div className='detailsBox'>{day}/{currentMonth}/{currentYear}
              <span>
              {
              (day===parseInt(date.split("-")[2]) && currentYear===parseInt(date.split("-")[0]) && (currentMonth+1)===parseInt(date.split("-")[1]))?<div className='text-white bg-danger'>followup-22</div>:""
            }
              </span>
            </div>
           

          {day}
        </div>
        ))}
      </div>
    </div>
  </div></div>
  )
}

export default LiveCalander