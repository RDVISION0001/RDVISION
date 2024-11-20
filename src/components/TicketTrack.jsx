import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";
// Authentication context
import { useAuth } from '../auth/AuthContext';
// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketTrack = () => {
    // Get userId and reloader from Auth context
    const { userId, userReportReloader } = useAuth();
    const { setUserReportReloader } = useAuth();

    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [showSaleTransaction, setShowTransaction] = useState(false);
    const [showFollowUpDate, setShowFollowUpDate] = useState(false);
    const [error, setError] = useState(null);
    const [ticketId, setTicketId] = useState(null);
    const scrollRef = useRef(null);
    const [callId, setCallId] = useState(0);
    const [response, setResponse] = useState(null);

    const [formData, setFormData] = useState({
        ticketStatus: '',
        comment: '',
        followUpDateTime: '',
        SaleTransaction: ''
    });

    const handleClose = () => setShow(false);
    const handleShow = (queryId) => {
        setTicketId(queryId);
        setShow(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getColorByStatus = (ticketStatus) => {
        const colors = {
            'New': '#5DA3FA',            // Soft Blue
            'Sale': '#53BF9D',           // Soft Green
            'Follow': '#5DA3FA',         // Soft Blue
            'Interested': '#F6A641',     // Muted Orange
            'Not_Interested': '#F55C47', // Soft Red
            'Wrong_Number': '#D3D3D3',   // Light Gray
            'Not_Pickup': '#B4C6E7',     // Light Blue
            'hang_up': '#FFD580'         // Soft Yellow
        };
        return colors[ticketStatus] || 'white';
    };

    const getColorbuttByStatus = (ticketStatus) => {
        const colors = {
            // 'New': '#A3D8F4',            // Light Soft Blue
            // 'Sale': '#9FE2BF',           // Light Soft Green
            // 'Follow': '#A3D8F4',         // Light Soft Blue
            // 'Interested': '#FFD3B5',     // Light Muted Orange
            // 'Not_Interested': '#FFB6B9', // Light Soft Red
            // 'Wrong_Number': '#E0E0E0',   // Lighter Gray
            // 'Not_Pickup': '#E0EFF6',     // Lighter Blue
            // 'hang_up': '#FFF8E1'         // Lighter Yellow
        };
        return colors[ticketStatus] || 'white';
    };


    const handleStatusChange = (event) => {
        handleChange(event);
        const { value } = event.target;

        setShowFollowUpDate(value === "Follow");
        setShowTransaction(value === "Sale");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ticketId) {
            setError('Unique Query ID is not defined');
            return;
        }

        try {
            const params = {
                userId,
                ticketStatus: formData.ticketStatus,
                comment: formData.comment,
                followUpDateTime: formData.followUpDateTime,
                call_id: callId
            };

            const res = await axiosInstance.post(
                `/third_party_api/ticket/updateTicketResponse/${ticketId}`,
                {},
                { params }
            );

            toast.success('Update successfully!');
            handleClose();
            setUserReportReloader((prev) => prev + 1);
            fetchTicketHistory();
            setError(null);
            setCallId(0);
            setFolowupUpdate(ticketId);
        } catch (err) {
            setError(err.message);
            setResponse(null);
        }
    };

    useEffect(() => {
        const fetchTicketHistory = async () => {
            try {
                const response = await axiosInstance.get(`/history/getTickettrackhistory/${localStorage.getItem("userId")}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching ticket history:', error);
            }
        };

        fetchTicketHistory();
    }, [userId, userReportReloader]);

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
            return 'NA'; // Invalid date format
        }

        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
        const year = dateObj.getFullYear();
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };


    // Count distinct ticket statuses
    const countStatuses = () => {
        const statusCounts = data.reduce((acc, step) => {
            const status = step.ticketStatus;
            acc[status] = acc[status] ? acc[status] + 1 : 1;
            return acc;
        }, {});
        return statusCounts;
    };

    const statusCounts = countStatuses();
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, userId: '', userName: '', count: '' });
    const handleMouseEnter = (e, userId, userName, ticketCount) => {
        const rect = e.currentTarget.getBoundingClientRect(); // Use e.currentTarget for the element the event handler is bound to
        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2, // Horizontal center
            y: rect.top - 10, // Position tooltip above the bar
            userId: userId,
            userName: userName,
            count: ticketCount,
        });
    };
    const handleMouseLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, userId: '', userName: '', count: '' });
    };
    return (
        <>
            <div className='text-center' style={{ width: "200px", marginLeft: "2px" }}>
                {/* Display ticket status counts */}
                <div className="status-summary d-flex justify-content-center flex-wrap">
                    {/* // Example usage within the `status-summary` div */}
                    {Object.keys(statusCounts).map((status) => (
                        <div
                            key={status}
                            className="status-count p-2 border"
                            style={{
                                backgroundColor: `${getColorByStatus(status)}`,
                                height: "40px",
                                width: "40px",
                                minWidth: "40px", // Ensure circle size
                                minHeight: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%", // Makes the div a circle
                            }}
                            onMouseEnter={(e) =>
                                handleMouseEnter(e, userId, "User Name Placeholder", statusCounts[status])
                            }
                            onMouseLeave={handleMouseLeave}
                        >
                            <strong>{statusCounts[status]}</strong>
                        </div>

                    ))}
                    {tooltip.visible && (
                        <div
                            className="custom-tooltip"
                            style={{
                                position: 'absolute',
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: 'translate(-50%, -100%)',
                                backgroundColor: '#007bff', // Blue background
                                color: '#fff', // White text for contrast
                                padding: '8px 16px', // Adjusted padding for better spacing
                                borderRadius: '8px', // Rounded corners
                                fontSize: '14px', // Font size
                                fontWeight: 'bold', // Bold text
                                whiteSpace: 'nowrap',
                                zIndex: 1000,
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                                opacity: 0.9, // Slight transparency
                                transition: 'all 0.2s ease-in-out', // Smooth transition
                                border: '1px solid rgba(255, 255, 255, 0.2)', // Light border
                            }}
                        >
                            {/* {localStorage.getItem("roleName") !== "Closer" && <><div style={{ fontWeight: 'bold' }}>User: {tooltip.userName}</div>
                                <div style={{ fontWeight: 'bold' }}>ID: {tooltip.userId}</div></>} */}
                            <div style={{ fontWeight: 'bold' }}>Counts: {tooltip.count}</div>

                            {/* Triangle pointer */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '-8px', // Positioning the triangle just below the tooltip
                                    left: '50%',
                                    transform: 'translateX(-50%)', // Center the triangle horizontally
                                    width: '0',
                                    height: '0',
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderTop: '8px solid #007bff', // Blue triangle matching the background
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                <div ref={scrollRef} style={{ overflowY: "auto", maxHeight: "110vh" }}>
                    {data && data.slice().reverse().map((step, index) => (
                        <div key={index}>
                            <div
                                className='text-center'
                                style={{
                                    height: "100px",
                                    width: "200px",
                                    backgroundColor: getColorbuttByStatus(step.ticketStatus),
                                    borderRadius: "50px",
                                    marginTop: "10px",
                                    border: "2px solid", // Ensure the border is visible
                                    animation: "borderChange 6s ease-in-out infinite", // Smooth transition applied
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                <div className='fw-bold'>
                                    {step.customerName.length > 15 ? `${step.customerName.slice(0, 15)}...` : step.customerName}
                                </div>
                                <div style={{ fontSize: "12px" }}>{step.action.slice(0, 15)}</div>
                                <div onClick={() => handleShow(step.ticketId)} >
                                    <a
                                        className="btn btn-info dropdown-toggle"
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ backgroundColor: getColorByStatus(step.ticketStatus), fontSize: "12px" }}
                                    >
                                        {step.ticketStatus.slice(0, 10)}
                                    </a>
                                </div>
                                <div style={{ fontSize: "12px" }}>{formatDate(step.queryDate)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status update modal */}
            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="followUpModal" tabIndex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
                <Modal.Header closeButton className="bg-primary text-white text-center">
                    <h1 className="modal-title fs-5 w-100" id="followUpModalLabel">
                        Update Ticket Status
                    </h1>
                </Modal.Header>
                <Modal.Body className="p-4" style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                                className="form-select border-0 shadow-sm"
                                name="ticketStatus"
                                value={formData.ticketStatus}
                                onChange={handleStatusChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="New">New</option>
                                <option value="Sale">Sale</option>
                                <option value="Follow">Follow</option>
                                <option value="Interested">Interested</option>
                                <option value="Not_Interested">Not Interested</option>
                                <option value="Wrong_Number">Wrong Number</option>
                                <option value="Not_Pickup">Not Pickup</option>
                                <option value="hang_up">Hang Up</option>
                            </select>
                        </div>
                        {showSaleTransaction && (
                            <div className="mb-3">
                                <label htmlFor="SaleTransaction" className="form-label">Sale Transaction</label>
                                <input
                                    type="text"
                                    name="SaleTransaction"
                                    className="form-control"
                                    value={formData.SaleTransaction}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {showFollowUpDate && (
                            <div className="mb-3">
                                <label htmlFor="followUpDateTime" className="form-label">Follow-Up Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="followUpDateTime"
                                    className="form-control"
                                    value={formData.followUpDateTime}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <textarea
                                className="form-control"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="text-center">
                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TicketTrack;
