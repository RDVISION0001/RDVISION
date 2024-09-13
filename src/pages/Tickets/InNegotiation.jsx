import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

// Authentication context
import { useAuth } from '../../auth/AuthContext'


function InNegotiation() {
  const [ticketData, setTicketData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(2); // Default stage is 2

  const { userId } = useAuth();


  // Define stages
  const stages = [
    { name: "Stage 1", color: "#ed1c24", stage: 1 },
    { name: "Stage 2", color: "#f7941e", stage: 2 },
    { name: "Stage 3", color: "#8dc63f", stage: 3 },
    // { name: "Stage 4", color: "#00aeef", stage: 4 },
  ];

  // Fetch data from API
  const fetchData = async (stage) => {
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
        userId,
        stage: stage,
      });
      setTicketData(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };

  useEffect(() => {
    fetchData(selectedStage);
  }, [selectedStage]);



  return (
    <>
      {/* Stages */}
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <div
              className="pipeline-container"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {stages.map((stage, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedStage(stage.stage)} // Set selected stage
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: `calc(100% / ${stages.length})`,
                    cursor: "pointer", // Add cursor pointer to indicate it's clickable
                  }}
                >
                  <div
                    style={{
                      backgroundColor: stage.color,
                      width: "100%",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      flexDirection: "column",
                      clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
                      marginRight: "-25px",
                      zIndex: 1,
                    }}
                  >
                    <div>{stage.count}</div>
                    <div>{stage.name}</div>
                  </div>

                  {index < stages.length - 1 && (
                    <div
                      style={{
                        width: "0",
                        height: "0",
                        borderTop: "50px solid transparent",
                        borderBottom: "50px solid transparent",
                        borderLeft: `25px solid ${stages[index + 1].color}`,
                        position: "absolute",
                        right: "-25px",
                        zIndex: 0,
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <div className="followups-table table-responsive table-height">
              <table className="table">
                <thead className="sticky-header">
                  <tr>
                    <th tabIndex="0">Date/Time</th>
                    <th tabIndex="0">Country</th>
                    <th tabIndex="0">Customer Name</th>
                    <th tabIndex="0">Customer Number</th>
                    <th tabIndex="0">Customer Email</th>
                    <th tabIndex="0">Status</th>
                    <th tabIndex="0">Requirement</th>
                    <th tabIndex="0">Action</th>
                    {selectedStage === 2 && <th tabIndex="0">FollowUp Date Time</th>
                    }
                    <th tabIndex="0">Ticket ID</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketData.map((nego, index) => (
                    <tr key={index}>
                      <td><span className="text">{nego.queryTime}</span></td>
                      <td><img src={`https://flagcdn.com/${nego.country && nego.country.toLowerCase()}.svg`} alt={`${nego.senderCountryIso} flag`} style={{ width: '30px' }} /><span className="text">{nego.country}</span></td>

                      <td><span className="text">{nego.senderName ? nego.senderName : nego.firstName}</span></td>
                      <td>
                        <CopyToClipboard text={nego.senderMobile}>
                          <button>Copy</button>
                        </CopyToClipboard>
                        <span className="text">{nego.senderMobile ? nego.senderMobile : nego.mobileNumber}</span>
                      </td>
                      <td>
                        <CopyToClipboard text={nego.email}>
                          <button>Copy</button>
                        </CopyToClipboard>
                        <span className="text">{nego.email}</span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <a className="btn btn-info dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: nego.ticketstatus === 'Open' ? 'green' : 'red' }}>
                            {nego.ticketstatus}
                          </a>
                        </div>
                      </td>
                      <td><span className="comment">{nego.subject}</span></td>
                      <td>
                        <span className="actions-wrapper">
                          <Button className="btn-action call bg-danger" title="Get connect on call">
                            <i className="fa-solid fa-info"></i>
                          </Button>
                          <Button className="btn-action call" title="Get connect on call">
                            <i className="fa-solid fa-phone"></i>
                          </Button>
                          <a href={`sms:${nego.senderMobile}?body=Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}.`} className="btn-action message" title="Send SMS">
                            <i className="fa-solid fa-message"></i>
                          </a>
                          <Button className="btn-action email" title="Send Email">
                            <i className="fa-solid fa-envelope"></i>
                          </Button>
                          <a href={`https://wa.me/${nego.senderMobile}?text=Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}.`} target='_blank' className="btn-action whatsapp" title="WhatsApp">
                            <i className="fa-brands fa-whatsapp"></i>
                          </a>
                        </span>
                      </td>
                      <td><span className="text">{nego.followupDateTime && [nego.followupDateTime[2], nego.followupDateTime[1], nego.followupDateTime[0]].join("-")}</span></td>

                      <td className="ticket-id"><i className="fa-solid fa-ticket"></i> {nego.uniqueQueryId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {error && <div className="api-error">Error: {error.message}</div>}
    </>
  );
}

export default InNegotiation;
