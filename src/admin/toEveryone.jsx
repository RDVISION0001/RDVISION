import React, { useState, useEffect } from 'react';


import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function toEveryone(props) {
    const params = {
        allTickets: {},
        ongoing: { ticketStatus: 'Sale' },
        newTickets: { ticketStatus: 'New' },
    };

    const [activeTab, setActiveTab] = useState("allTickets");
    const [apiResponse, setApiResponse] = useState(null);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [show, setShow] = useState(false);
    const [team, setTeam] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [data, setData] = useState([]);
    const [uploadedData, setUploadedData] = useState([])
    const [seletedUserType, setSelectedUserType] = useState(4)
    const [user, setUser] = useState([])
    const [selectedUserOfSelectedUserType, setSelectedUserOfSelectedUserType] = useState(props.userId)
    const handleClose = () => setShow(false);
    const [isLive, setIsLive] = useState(false)


    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    //Short Method
    const [shortValue, setShortValue] = useState("")
    const handleShortDataValue = (e) => {
        setShortValue(e.target.value)
    }

    const handleShow = () => {
        if (selectedTickets.length > 0) {
            setShow(true)
        } else {
            toast.info("Please select at least One Ticket")
        }
    }


    //handle select tickets
    const handleTicketSelect = (e, id) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedTickets([...selectedTickets, id]);
        } else {
            setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
        }
    };

    //hnadling multiple selection
    const handleMultipleTicketSelection = (e) => {
       if(isLive){
        const checked = e.target.checked; // Use `checked` instead of `value` to determine if the checkbox is checked
        if (checked) {
            let newSelectedTickets = [...selectedTickets]; // Start with the current state
            for (let i = 0; i < data.length; i++) {
                newSelectedTickets.push(data[i].uniqueQueryId); // Add the new elements
            }
            setSelectedTickets(newSelectedTickets); // Update the state once with the new array
        } else {
            setSelectedTickets([]); // Reset to an empty array
        }
       }else{
        handleMultipleUploadTicketSelection(e)
       }
    };

    //hnadling multiple selection
    const handleMultipleUploadTicketSelection = (e) => {
        const checked = e.target.checked; // Use `checked` instead of `value` to determine if the checkbox is checked
        if (checked) {
            let newSelectedTickets = [...selectedTickets]; // Start with the current state
            for (let i = 0; i < uploadedData.length; i++) {
                newSelectedTickets.push(uploadedData[i].uniqueQueryId); // Add the new elements
            }
            setSelectedTickets(newSelectedTickets); // Update the state once with the new array
        } else {
            setSelectedTickets([]); // Reset to an empty array
        }
    };


    const sendPostRequest = async () => {
        if(isLive){
            try {
                const payload = selectedTickets;
                const config = {
                    headers: {
                        // 'teamId': parseInt(selectedTeam)
                    }
                };
                const url = `/third_party_api/ticket/assignToUser/${selectedUserOfSelectedUserType}`;
                const response = await axiosInstance.post(url, payload, config);
                setApiResponse(response.data);
                console.log("Response is :", response.data)
                toast.success('Tickets assigned successfully!');
                handleClose();
    
                fetchTickets()
                setSelectedTickets([])
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to assign tickets.');
            }
        }else{
            try {
                const payload = selectedTickets;
                const config = {
                    headers: {
                        // 'teamId': parseInt(selectedTeam)
                    }
                };
                const url = `/upload/assignToUser/${selectedUserOfSelectedUserType}`;
                const response = await axiosInstance.post(url, payload, config);
                setApiResponse(response.data);
                console.log("Response is :", response.data)
                toast.success('Uploaded Tickets assigned successfully!');
                handleClose();
    
                fetchUploadedTickets()
                setSelectedTickets([])
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to assign tickets.');
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get('/team/getAllTeams');
            setTeam(response.data.dtoList);
        };
        fetchData();
    }, []);

    const handleSelectUserOfSelectedUserType = (e) => {
        setSelectedUserOfSelectedUserType(e.target.value)

    }
    const handleSelectUserType = (e) => {
        setSelectedUserType(e.target.value)

    }
    const fetchTickets = async (params, page, perPage) => {
        try {
            const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
                params: { ...params, page, size: perPage }
            });
            setData(response.data.dtoList);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const fetchUploadedTickets = async (page, perPage) => {
        try {
            const response = await axiosInstance.get('/upload/getABCTicketsNotAssigned', {
                params: { page, size: perPage }
            });
            setUploadedData(response.data.dtoList);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            await fetchTickets(params[activeTab], currentPage, itemsPerPage);

        };

        fetchData();
    }, [activeTab, currentPage, itemsPerPage]); // Ensure these dependencies are correct


    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get('/user/dropdown', {
                params: { roleId: seletedUserType }
            });
            setUser(response.data.dtoList);
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchUploadedTickets(currentPage, itemsPerPage);
    }, [itemsPerPage])


    //handle row click
    const handleRowClick = (tabName) => {
        setActiveTab(tabName);
        setCurrentPage(0);
        fetchTickets(params[tabName], 0, itemsPerPage);
        fetchUploadedTickets(0, itemsPerPage);
    };

    //handle Previous Page
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    //handle handle Next Page
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    //handle Items Per Page Change
    const handleItemsPerPageChange = (perPage) => {
        setItemsPerPage(perPage);
        setCurrentPage(0);
    };

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 9;
        const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(currentPage - halfMaxPagesToShow, 0);
        let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(endPage - maxPagesToShow + 1, 0);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const maskEmail = (email) => {
        const [user, domain] = email.split('@');
        const maskedUser = user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
        return `${maskedUser}@${domain}`;
    };
    // Masking mobile number
    const maskMobileNumber = (number) => {
        if (number.length < 4) return number;
        return number.slice(0, -4) + 'XXXX';
    };
    return (
        <>
            <div className='w-25 d-flex justify-content-center' >

                <div className="form-check" style={{ marginLeft: "10px" }}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexCheckDefault"
                        checked={isLive}
                        onChange={() => setIsLive(true)} // Call toggle method on change
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Live Tickets
                    </label>
                </div>
                <div className="form-check" style={{ marginLeft: "10px" }}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexCheckChecked"
                        checked={!isLive} // Checked if 'list' is false
                        onChange={() => setIsLive(false)} // Call toggle method on change
                    />
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                        Uploaded Tickets
                    </label>
                </div>
            </div>
            <div className="admin-page tickets-page">
                <div className="my-container main-content-block2658">
                    <div className="container-fluid mt-3">
                        <section className="data-table-bgs_02x24 py-3">
                            <div className="container-fluid">
                                <div className="table-wrapper tabbed-table">
                                    <div className="heading-wrapper">
                                        <h3 className="title">All Tickets</h3>
                                        <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal" id="assignButton">Assign Ticket</Button>
                                    </div>

                                    <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                                        <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" id='checkedInput' className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                                                            </th>
                                                            <th tabindex="0">Date/Time</th>
                                                            <th tabindex="0">Country</th>
                                                            <th tabIndex="0">Customer Name</th>
                                                            <th tabIndex="0">Customer Number</th>
                                                            <th tabIndex="0">Customer Email</th>
                                                            {/* <th tabIndex="0">Ticket ID</th> */}
                                                            {/* <th tabIndex="0">Requirement</th> */}
                                                            {isLive && <th tabIndex="0">Product Name</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {isLive && data.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="selection-cell">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTickets.includes(item.uniqueQueryId)}
                                                                        onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                                                                    />
                                                                </td>
                                                                <td>{item.queryTime}</td>
                                                                <td>{item.senderCountryIso}</td>
                                                                <td>{item.senderName}</td>
                                                                <td>{maskMobileNumber(item.senderMobile)}</td>
                                                                <td>{maskEmail(item.senderEmail)}</td>
                                                                {/* <td>{item.uniqueQueryId}</td> */}
                                                                {/* <td>{item.subject}</td> */}
                                                                <td>{item.queryProductName}</td>
                                                            </tr>
                                                        ))}
                                                        {!isLive && uploadedData.map((item) => (
                                                            <tr key={item.uniqueQueryId}>
                                                                <td className="selection-cell">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTickets.includes(item.uniqueQueryId)}
                                                                        onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                                                                    />
                                                                </td>
                                                                <td>{item.uploadDate}</td>
                                                                <td>NA</td>
                                                                <td>{item.firstName}</td>
                                                                <td>{maskMobileNumber(item.mobileNumber)}</td>
                                                                <td>{maskEmail(item.email)}</td>
                                                                {/* <td>{item.uniqueQueryId}</td> */}
                                                                {/* <td>{item.subject}</td> */}
                                                                <td>{item.queryProductName}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pagination-controls">
                                    <button className="next_prev" onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                                    {generatePageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`next_prev ${page === currentPage ? 'active' : ''}`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}
                                    <button className="next_prev" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>

                                    <span> Items per page:</span>{' '}
                                    <select className="next_prev" value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(e.target.value)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="500">500</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Tickets to Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="teamSelect">Select User Type</label>
                            <select className="form-control" id="teamSelect" onChange={handleSelectUserType} value={seletedUserType}>
                                <option value="4">Closer</option>
                            </select>
                            <label htmlFor="teamSelect">Select Team</label>
                            <select className="form-control" id="teamSelect" onChange={handleSelectUserOfSelectedUserType} value={selectedUserOfSelectedUserType}>
                                <option value="">Choose...</option>
                                {user.map((t) => (
                                    <option key={t.userId} value={t.userId}>{t.firstName + " " + t.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={sendPostRequest}>
                        Assign Tickets
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" />
        </>
    );
}


export default toEveryone
