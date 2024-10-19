import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import ToEveryOne from '../admin/toEveryone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserReport = () => {
    const [users, setUsers] = useState([]);
    const [noOfAssignedTickets, setnumberOfassinedticket] = useState({});
    const [selectedUser, setSelectedUser] = useState(0);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [loading, setLoading] = useState(false); // State to handle loading text
    const [fetchingUsers, setFetchingUsers] = useState(true); // Loading state for fetchUsers
    const [Closer, setCloser] = useState("")
    useEffect(() => {
        fetchUsers();
        fetchNoOfAssigned();
    }, []);

    const fetchUsers = async () => {
        setFetchingUsers(true); // Start fetching, show loading
        try {
            const response = await axiosInstance.get('/user/getAllUsers', { params: { page: 100 } });
            setUsers(response.data.dtoList);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users.');
        } finally {
            setFetchingUsers(false); // End fetching, hide loading
        }
    };

    const fetchNoOfAssigned = async () => {
        try {
            const response = await axiosInstance.get(`/user/getNoOfTodayAssinedTicket/${localStorage.getItem("userId")}`);
            setnumberOfassinedticket(response.data);
        } catch (error) {
            console.error('Error fetching assigned tickets:', error);
            toast.error('Failed to fetch assigned tickets.');
        }
    };

    // Function to convert byte code to image URL
    function convertToImage(imageString) {
        if (!imageString) return null;
        const byteCharacters = atob(imageString);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;
    }

    const findNoOfAssignedTicketsToUser = (userId) => {
        return noOfAssignedTickets[userId] || 0; // Return 0 if no tickets are assigned
    };

    // Function to open the modal and set the selected user
    const openModal = (userId,user) => {
        setSelectedUser(userId);
        setCloser(user)
        setShowModal(true); // Show the modal
    };

    // Function to close the modal
    const closeModal = () => {
        setShowModal(false); // Hide the modal
        setSelectedUser(0); // Reset selected user
    };

    return (
        <>
            <div className="d-flex justify-content-center p-3">
                {fetchingUsers ? ( // Show loading text if users are still being fetched
                    <div>Loading users, please wait...</div>
                ) : (
                    users.filter((user) => user.roleId === 4).map((user, index) => (
                        <div key={index} className="text-center w-25">
                            <div className="shadow-sm py-3 d-flex align-items-center flex-column" style={{ height: "70vh", borderTop: "2px solid rgb(211, 211, 211)" }}>
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                        height: '150px',
                                        width: '150px',
                                        overflow: 'hidden',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0',
                                    }}
                                >
                                    {convertToImage(user.imageData) ? (
                                        <img
                                            src={convertToImage(user.imageData)}
                                            className="img-fluid"
                                            alt={`${user.firstName} ${user.lastName}`}
                                            style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '50%' }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </div>

                                <div>
                                    <div className="fw-bold" style={{ fontSize: '30px' }}>
                                        {user.firstName}
                                    </div>

                                    {findNoOfAssignedTicketsToUser(user.userId) > 0 ? (
                                        <div className='d-flex flex-column'>
                                            <span style={{ border: "1px solid black", borderRadius: "5px", padding: "5px", marginTop: "5px" }}>
                                                Today Assigned: {findNoOfAssignedTicketsToUser(user.userId)}
                                            </span>
                                            <span className='text-primary ' onClick={() => openModal(user.userId,user.firstName)} style={{ cursor: "pointer" }}>Assign more....</span>
                                        </div>
                                    ) : (
                                        <button style={{ backgroundColor: "rgb(15,7,76)" }} onClick={() => openModal(user.userId,user.firstName)}>
                                            Assign Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for ToCaptain */}
            <Modal show={showModal} onHide={closeModal} centered dialogClassName="custom-modal-width">
                <Modal.Header closeButton>
                    <Modal.Title>Assign Ticket to {Closer}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ToEveryOne userId={selectedUser} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
};

export default UserReport;
