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
    const { setUserReportReloader } = useAuth()


    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [showSaleTransaction, setShowTransaction] = useState(false);
    const [showFollowUpDate, setShowFollowUpDate] = useState(false);
    const [error, setError] = useState(null);
    const [ticketId, setTicketId] = useState(null);
    const scrollRef = useRef(null);
    const [callId, setCallId] = useState(0)
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
                const response = await axiosInstance.get(`/history/getTickettrackhistory/${userId}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching ticket history:', error);
            }
        };

        fetchTicketHistory();
    }, [userId, userReportReloader]);

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);

        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
        const year = dateObj.getFullYear();
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    console.log(userReportReloader)
    return (
        <>
            <div className='text-center'>
                <div ref={scrollRef} style={{ overflowY: "auto", maxHeight: "110vh" }}>
                    {data && data.map((step, index) => (
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
                                <div style={{ fontSize: "12px" }}>{step.action.slice(0,15)}</div>
                                <div onClick={() => handleShow(step.ticketId)} >
                                    <a
                                        className="btn btn-info dropdown-toggle"
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ backgroundColor: getColorByStatus(step.ticketStatus),fontSize:"12px" }}
                                    >
                                        {step.ticketStatus.slice(0,10)}
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
                                id="status"
                                name="ticketStatus"
                                value={formData.ticketStatus}
                                onChange={handleStatusChange}
                                style={{ borderRadius: '4px' }}
                            >
                                <option>Choose Call-Status</option>
                                <option value="Sale">Sale</option>
                                <option value="Follow">Follow-up</option>
                                <option value="Interested">Interested</option>
                                <option value="Not_Interested">Not Interested</option>
                                <option value="Wrong_Number">Wrong Number</option>
                                <option value="Place_with_other">Place with other</option>
                                <option value="Not_Pickup">Not Pickup</option>
                                <option value="hang_up">Hang_up</option>
                            </select>
                        </div>

                        {showSaleTransaction && (
                            <div className="mb-3">
                                <label htmlFor="transactionDetails" className="form-label">Transaction ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter Transaction ID"
                                    className="form-control border-0 shadow-sm"
                                    id="transactionDetails"
                                    name="transactionDetails"
                                    value={formData.SaleTransaction}
                                    onChange={handleChange}
                                    required
                                    style={{ borderRadius: '4px' }}
                                />
                            </div>
                        )}

                        {showFollowUpDate && (
                            <div className="mb-3">
                                <label htmlFor="followUpDateTime" className="form-label">Follow Up Date and Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control border-0 shadow-sm"
                                    id="followUpDateTime"
                                    name="followUpDateTime"
                                    value={formData.followUpDateTime}
                                    onChange={handleChange}
                                    step="2"
                                    style={{ borderRadius: '4px' }}
                                />
                            </div>
                        )}

                        <div className="col-12 mb-3">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <textarea
                                rows="4"
                                className="form-control border-0 shadow-sm"
                                placeholder="Describe your conversation with client"
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                required
                                style={{ borderRadius: '4px' }}
                            ></textarea>
                        </div>

                        {error && <p className="text-danger">{error}</p>}

                        <div className="modal-footer justify-content-center border-0 mt-4">
                            <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal" onClick={handleClose}>
                                Close
                            </button>
                            <button className="btn btn-primary px-4" type="submit">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TicketTrack;
