import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button } from "react-bootstrap";

const localizer = momentLocalizer(moment);

function LiveCalander(props) {
  const [calenderData, setCalenderData] = useState([]);
  const [calenderDataForUploaded, setCalenderDataForuploaded] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const { followupState } = useAuth();
  const [isTicketJourneyOpen, setIsTicketJourneyOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [comments, setComments] = useState("")
  const [usrl, setUrl] = useState("")
  const [eventDate, setEventDate] = useState("")
  const openInNewTab = (url, eventDate) => {
    // Format the event date to 'YYYY-MM-DD'
    closeTicketJourney()
    const formattedDate = moment(eventDate).format('YYYY-MM-DD');
    console.log("Event Date:", formattedDate); // Log the formatted date
    window.open(`/in_negotiation/${formattedDate}`, '_blank', 'noopener,noreferrer');
  };

  const openTicketJourney = (url, event, title, comments) => {
    if (props.model) {
      openInNewTab(url, event)
    } else {
      setUrl("/in_negotiation")
      setEventDate(event)
      setTitle(title)
      setComments(comments)
      setIsTicketJourneyOpen(true)
    }
  }


  const closeTicketJourney = () => {
    // document.getElementById("ticketjourney").close()
    setIsTicketJourneyOpen(false)
  }

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
        comment: item.comments.split(","), // Add comment field
      })),
      ...calenderDataForUploaded.map((item) => ({
        title: `ABC Follow-up: ${item['no of tickets']}`,
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: false,
        type: 'uploaded',
        comment: item.comments.split(","), // Add comment field
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
            tooltipAccessor={(event) => `${event.title} - Comment: ${event.comment}`}
            onSelectEvent={(event) => openTicketJourney("/in_negotiation", event.start, event.title, event.comment)}
            timeslots={2}
            step={30}
            showMultiDayTimes
          />

        </div>
      </div>
      <Modal
        show={isTicketJourneyOpen}
        onHide={closeTicketJourney}
        id="followUpModal"
        tabIndex="-1"
        aria-labelledby="followUpModalLabel"
        aria-hidden="true"
        dialogClassName="fullscreen-modal rounded-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="followUpModalLabel">
            {title || "Ticket Journey"} {/* Default title if none provided */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          {/* Check if comments is available */}
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => {
              // Split the comment into text and name
              const [text, name] = comment.split("(");
              const formattedName = name ? name.split(")")[0] : "Unknown";

              return (
                <div key={index} className="mb-3">
                  {/* Display Name and Comment as "Name: Comment" */}
                  <div className="d-flex flex-column">
                    <div className="fw-bold text-primary">{formattedName}:</div> {/* Name in bold and primary color */}
                    <div className="bg-light text-dark p-2 rounded-3 mt-1" style={{ wordWrap: "break-word", maxWidth: "80%" }}>
                      {text.trim()} {/* Comment text */}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No comments available.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeTicketJourney}>
            Close
          </button>
          <button className="btn btn-primary w-25" onClick={() => openInNewTab(usrl,eventDate)}>
            Go to Tickets
          </button>
        </Modal.Footer>
      </Modal>




    </div>
  );
}

export default LiveCalander;
