import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../axiosInstance";

function TicketStatusView({ userId ,name}) {
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
            Not_Interested: counts['not_interested'] || 0,
            Not_Pickup: counts['not_pickup'] || 0,
            New: counts['new'] || 0,
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
    console.log(name)

    return (
        <>
            {/* Ticket Type Selection */}
            <div className=" d-flex justify-content-between">
                <div className="d-flex">
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
                <div className="form-check" style={{ marginLeft: "10px" }}>
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

                <h2>{name}</h2>
            </div>

            {/* Date Input */}
            <div className="mt-3">
                <label htmlFor="date" className="form-label">Select Date:</label>
                <input
                    type="date"
                    id="date"
                    className="form-control"
                    value={date}
                    onChange={handleDateChange}
                />
            </div>

            {/* Ticket Status Count Buttons */}
            <div className="ticket-status-counts mt-3">
                <div className="d-flex justify-content-start">
                    <p className="mx-2">
                        Not Interested({ticketstatus.Not_Interested || 0})
                    </p>

                    <p className="mx-2">
                        Not Pickup({ticketstatus.Not_Pickup || 0})
                    </p>

                    <p className="mx-2">
                        New({ticketstatus.New || 0})
                    </p>
                </div>
            </div>

            {/* Ticket Table */}
            <div className="admin-page tickets-page">
                <div className="my-container main-content-block2658">
                    <div className="container-fluid mt-3">
                        <section className="data-table-bgs_02x24 py-3">
                            <div className="container-fluid">
                                <div className="table-wrapper tabbed-table">
                                    <div className="heading-wrapper">
                                        <h3 className="title">All Tickets</h3>
                                        <div>
                                            <span>
                                                Available Tickets ({liveTicketsActive ? "Live Tickets" : "Uploaded Tickets"}):{" "}
                                            </span>
                                            <span>{tickets.length}</span>
                                        </div>
                                    </div>

                                    <div className="tab-content recent-transactions-tab-body">
                                        <div className="tab-pane fade show active">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Ser N.</th>
                                                            <th>Date/Time</th>
                                                            <th>Country</th>
                                                            <th>Customer Name</th>
                                                            <th>Customer Number</th>
                                                            <th>Customer Email</th>
                                                            <th>Product Name</th>
                                                            <th>Ticket Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {isLoading ? (
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    <div className="spinner-border" role="status">
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ) : paginatedTickets.length > 0 ? (
                                                            paginatedTickets.map((ticket, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{ticket.queryTime || "N/A"}</td>
                                                                    <td>{ticket.senderCountryIso || "N/A"}</td>
                                                                    <td>{ticket.firstName || ticket.senderName}</td>
                                                                    <td>{ticket.mobileNumber || ticket.senderMobile}</td>
                                                                    <td>{ticket.email || ticket.senderEmail}</td>
                                                                    <td>{ticket.subject || "N/A"}</td>
                                                                    <td>{ticket.ticketstatus || "Unknown"}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="8" className="text-center">No tickets available.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <div className="pagination d-flex justify-content-center mt-3">
                                                <button
                                                    className="btn btn-sm btn-light"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Prev
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-light"}`}
                                                        onClick={() => handlePageChange(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    className="btn btn-sm btn-light"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </button>
                                                
                                                {/* Items Per Page Dropdown */}
                                                <div className="d-flex justify-content-center mt-3">
                                                    <label htmlFor="itemsPerPage" className="form-label mr-2">Items per page:</label>
                                                    <select
                                                        id="itemsPerPage"
                                                        className="form-select w-auto"
                                                        value={itemsPerPage}
                                                        onChange={handleItemsPerPageChange}
                                                    >
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
