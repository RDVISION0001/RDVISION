import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../auth/AuthContext";

function TicketStatusView({ userId, name }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liveTicketsActive, setLiveTicketsActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [ticketstatus, setTicketstatus] = useState({
    Not_Interested: 0,
    Not_Pickup: 0,
    New: 0, // Make sure other statuses are included
  });
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Set default to current date
  const [expandedTickets, setExpandedTickets] = useState({});
  const { dark } = useAuth();

  const handleToggle = (index) => {
    setExpandedTickets((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the visibility for the specific ticket index
    }));
  };
  // Fetch tickets based on active type
  const fetchTickets = async (url) => {
    setIsLoading(true);
    const payload = {
      date,
      userId,
    };

    try {
      const { data } = await axiosInstance.post(url, payload);
      setTickets(data || []);
      countTicketStatuses(data); // Count the ticket statuses after fetching tickets
    } catch (error) {
      toast.error("Failed to fetch tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  // Count ticket statuses
  const countTicketStatuses = (tickets) => {
    const counts = tickets.reduce((acc, ticket) => {
      const status = (ticket.ticketstatus || "Unknown").trim().toLowerCase(); // Normalize status
      acc[status] = acc[status] ? acc[status] + 1 : 1;
      return acc;
    }, {});

    const updatedStatusCounts = {
      Not_Interested: counts["not_interested"] || 0,
      Not_Pickup: counts["not_pickup"] || 0,
      New: counts["new"] || 0,
      Follow: counts["follw"] || 0,
      Sale: counts["sale"] || 0,
      Intersted: counts["intersted"] || 0,
      Wrong_Number: counts["wrong_number"] || 0,
    };

    setTicketstatus(updatedStatusCounts);
  };

  // Fetch tickets when toggling between live and uploaded tickets
  useEffect(() => {
    if (liveTicketsActive) {
      fetchTickets("/third_party_api/ticket/getAssignedTicketByDate");
    } else {
      fetchTickets("/upload/getAssignedTicketByDate");
    }
  }, [liveTicketsActive, userId, date]); // Re-fetch on date change

  // Handle radio button toggle
  const handleTicketTypeChange = (type) => {
    setCurrentPage(1); // Reset to first page
    setLiveTicketsActive(type === "live");
  };

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  // Handle page change with validation
  const handlePageChange = (page) => {
    if (page > totalPages || page < 1) return; // Prevent exceeding total pages
    setCurrentPage(page);
  };
  // console.log(name)

  const formatDateAndTime = (dateStr) => {
    const date = new Date(dateStr);

    // Format the date as '05-Jan-2025'
    const optionsDate = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", optionsDate);

    // Format the time as '2:07:32 AM'
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes}:${seconds} ${ampm}`;

    return (
      <>
        <div>{formattedDate}</div>
        <div>{formattedTime}</div>
      </>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "#588157"; // Green
      case "Sale":
        return "#ffc107"; // Yellow
      case "Interested":
        return "#007bff"; // Blue
      case "Not_Interested":
        return "#da627d"; // Red
      case "Not_Pickup":
        return "#ccd5ae"; // Light green
      case "Wrong_Number":
        return "#f44336"; // Red
      case "Follow":
        return "#4caf50"; // Dark green
      default:
        return "#f8f9fa"; // Light gray for "Unknown"
    }
  };

  return (
    <>
      {/* Ticket Type Selection */}
      <div
        className={`px-4 d-flex rounded  justify-content-between align-items-center mt-4 ${
          dark ? "bg-secondary text-light" : ""
        }`}
        style={{ height: 50 }}
      >
        <div className="d-flex ">
          <div className="form-check" style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="radio"
              name="ticketType"
              id="liveTickets"
              checked={liveTicketsActive}
              onChange={() => handleTicketTypeChange("live")}
            />
            <label className="form-check-label" htmlFor="liveTickets">
              Live Tickets
            </label>
          </div>
          <div className="form-check " style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="radio"
              name="ticketType"
              id="uploadedTickets"
              checked={!liveTicketsActive}
              onChange={() => handleTicketTypeChange("uploaded")}
            />
            <label className="form-check-label" htmlFor="uploadedTickets">
              Uploaded Tickets
            </label>
          </div>
        </div>
        <div>
          <div
            className={`d-flex justify-content-center align-items-center gap-2 border py-1 px-2 rounded position-relative ${
              dark ? "bg-primary border-0" : ""
            }`}
            style={{ backgroundColor: "#a2d6f9", cursor: "pointer" }}
          >
            <i className="fa-solid fa-user"></i>
            <h2 className="" style={{ fontSize: 20 }}>
              {name}
            </h2>

            {/* Cross icon, initially hidden */}
            <i
              className="fa-solid fa-xmark position-absolute end-0 top-50 translate-middle-y me-2"
              style={{
                display: "none",
                cursor: "pointer",
              }}
            ></i>
          </div>
        </div>
      </div>

      {/* Date Input */}
      <div className="d-flex justify-content-end">
        <div className="mt-3" style={{ width: "400px" }}>
          <label htmlFor="date" className="form-label" style={{ fontSize: 14 }}>
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            className={`form-control ${dark?"bg-secondary text-light":""} `}
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Ticket Status Count Buttons */}
      <div className="ticket-status-counts mt-3">
        <div className="d-flex justify-content-start flex-wrap gap-2">
          {ticketstatus.Not_Interested && (
            <p
              className="mx-2 px-2 rounded whitespace-nowrap"
              style={{ backgroundColor: "#da627d", fontSize: 14 }}
            >
              {" "}
              Not Interested({ticketstatus.Not_Interested || 0})
            </p>
          )}
          {ticketstatus.Not_Pickup && (
            <p
              className="mx-2 px-2 rounded whitespace-nowrap"
              style={{ backgroundColor: "#5aa9e6", fontSize: 14 }}
            >
              {" "}
              Not Pickup({ticketstatus.Not_Pickup || 0})
            </p>
          )}
          <p
            className="mx-2 px-2 text-light rounded"
            style={{ backgroundColor: "#6bf178", fontSize: 14 }}
          >
            {" "}
            New({ticketstatus.New || 0}){" "}
          </p>
          <p
            className="mx-2 px-2 text-light rounded"
            style={{ backgroundColor: "#2a9d8f", fontSize: 14 }}
          >
            {" "}
            Sale({ticketstatus.Sale || 0}){" "}
          </p>
          <p
            className="mx-2 px-2 text-light whitespace-nowrap rounded"
            style={{ backgroundColor: "#f7c59f", fontSize: 14 }}
          >
            {" "}
            Intersted({ticketstatus.Intersted || 0})
          </p>
          <p
            className="mx-2 px-2 text-light whitespace-nowrap rounded"
            style={{ backgroundColor: "#ca7df9", fontSize: 14 }}
          >
            {" "}
            Wrong_Number({ticketstatus.wrong_number || 0})
          </p>
          <p
            className="mx-2 px-2 text-light whitespace-nowrap rounded"
            style={{ backgroundColor: "#ffbd00", fontSize: 14 }}
          >
            {" "}
            Follow({ticketstatus.follow || 0})
          </p>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="admin-page tickets-page ">
        <div className="my-container main-content-block2658">
          <div className="container-fluid mt-3 ">
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid ">
                <div className="">
                  <div className="heading-wrapper d-flex justify-content-between align-items-center">
                    <h3 className={`${dark?"text-light":""}`}>All Tickets</h3>
                    <div>
                      <span className={`${dark?"text-light":""}`}>
                        Available Tickets (
                        {liveTicketsActive
                          ? "Live Tickets"
                          : "Uploaded Tickets"}
                        ):{" "}
                      </span>
                      <span>{tickets.length}</span>
                    </div>
                  </div>

                  <div className="tab-content recent-transactions-tab-body">
                    <div className="tab-pane fade show active">
                      <div className={`tickets-table table-responsive ${dark?"table-dark":""} `}>
                        <table className={`table w-100 border ${dark?"table-dark":""} `}>
                          <thead>
                            <tr>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                S.N.
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                Date/Time
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                Country
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                {" "}
                                Customer
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                Mob Number{" "}
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                {" "}
                                Customer Email
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                {" "}
                                Product{" "}
                              </th>
                              <th className={`whitespace-nowrap bordre border-dark ${dark?"bg-secondary":""} `}>
                                Ticket Status{" "}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading ? (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  <div className="spinner-border" role="status">
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ) : paginatedTickets.length > 0 ? (
                              paginatedTickets.map((ticket, index) => (
                                <tr key={index}>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {index + 1}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {ticket.queryTime
                                      ? formatDateAndTime(ticket.queryTime)
                                      : "N/A"}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {ticket.senderCountryIso || "N/A"}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {ticket.firstName || ticket.senderName}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {ticket.mobileNumber || ticket.senderMobile}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {ticket.email || ticket.senderEmail}
                                  </td>
                                  <td
                                    style={{
                                      whiteSpace: "wrap",
                                      maxWidth: "200px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {expandedTickets[index]
                                      ? ticket.subject
                                      : ticket.subject.slice(0, 10)}
                                    {ticket.subject.length > 10 && (
                                      <span
                                        style={{
                                          color: "blue",
                                          cursor: "pointer",
                                          fontSize: 10,
                                        }}
                                        onClick={() => handleToggle(index)}
                                      >
                                        {expandedTickets[index]
                                          ? " View Less"
                                          : " View More"}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <p
                                      style={{
                                        whiteSpace: "nowrap",
                                        backgroundColor: getStatusColor(
                                          ticket.ticketstatus
                                        ),
                                      }}
                                      className="px-1 rounded"
                                    >
                                      {ticket.ticketstatus || "Unknown"}
                                    </p>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No tickets available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="pagination d-flex flex-column align-items-center justify-content-center mt-3">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button
                            class="btn btn-outline-primary bg-primary  text-light"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i class="fa-solid fa-angle-left"></i> Prev
                          </button>

                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              className={`btn btn-sm ${
                                currentPage === i + 1
                                  ? "btn-primary"
                                  : "btn-light"
                              }`}
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </button>
                          ))}

                          <button
                            class="btn btn-outline-primary bg-primary text-light"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next <i class="fa-solid fa-angle-right"></i>
                          </button>
                        </div>

                        {/* Items Per Page Dropdown */}
                        <div className="d-flex justify-content-center align-items-center mt-3">
                          <label
                            htmlFor="itemsPerPage"
                            className={`form-label mr-2 ${dark?"text-light":""} `}
                          >
                            Items per page:
                          </label>
                          <select
                            id="itemsPerPage"
                            className={`form-select w-auto mx-2 ${dark? "bg-secondary":""}`}
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                          >
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </>
  );
}

export default TicketStatusView;
