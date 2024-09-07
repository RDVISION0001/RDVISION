import React, { useState, useEffect } from 'react';


import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function toEveryone() {
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
    const [seletedUserType, setSelectedUserType] = useState(0)
    const [user, setUser] = useState([])
    const [selectedUserOfSelectedUserType, setSelectedUserOfSelectedUserType] = useState(0)
    const handleClose = () => setShow(false);


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
    };

    const sendPostRequest = async () => {
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
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to assign tickets.');
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

    //iteam par page
    useEffect(() => {
        fetchTickets(params[activeTab], currentPage, itemsPerPage);
    }, [activeTab, currentPage, itemsPerPage]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get('/user/dropdown', {
                params: { roleId: seletedUserType }
            });
            setUser(response.data.dtoList);
        };

        fetchData();
    }, [seletedUserType]);


    //handle row click
    const handleRowClick = (tabName) => {
        setActiveTab(tabName);
        setCurrentPage(0);
        fetchTickets(params[tabName], 0, itemsPerPage);
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

    const disableTcket = () => {
        return selectedTickets.length === 0 ? "disabled" : ""
    }



    return (
        <>
            <div className="admin-page tickets-page">
                <div className="my-container main-content-block2658">
                    <div className="container-fluid mt-3">
                        <section className="sadmin-top-section">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Total Tickets</h3>
                                                <span className="sales"
                                                >0<span className="indicators">0%</span></span
                                                >
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">In negotation</h3>
                                                <span className="sales"
                                                >0<span className="indicators">0%</span></span
                                                >
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Total Sales</h3>
                                                <span className="sales"
                                                >0<span className="indicators">0%</span></span
                                                >
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Projected Sales</h3>
                                                <span className="sales"
                                                >0<span className="indicators">0%</span></span
                                                >
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="sadmin-top-section">
                            <div className="container-fluid">
                                <div className="row g-3">
                                    {/* Cards here */}
                                </div>
                            </div>
                        </section>
                        <section className="filter-section">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="search-wrapper">
                                            <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search Department or Name..." value={shortValue} onChange={handleShortDataValue} />
                                            <div className="search-icon">
                                                <i className="fa-solid fa-magnifying-glass"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="filter-wrapper d-flex gap-3">
                                            {/* Filters here */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="data-table-bgs_02x24 py-3">
                            <div className="container-fluid">
                                <div className="table-wrapper tabbed-table">
                                    <div className="heading-wrapper">
                                        <h3 className="title">All Tickets</h3>
                                        <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal" id="assignButton">Assign Ticket</Button>
                                    </div>
                                    <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                                                onClick={() => handleRowClick("allTickets")} id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                                                onClick={() => handleRowClick("ongoing")} id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabIndex="-1">Ongoing</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                                                onClick={() => handleRowClick("newTickets")} id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabIndex="-1">New Tickets</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                                        <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                                                            </th>
                                                            <th tabindex="0">Date/Time</th>
                                                            <th tabindex="0">Country</th>
                                                            <th tabIndex="0">Customer Name</th>
                                                            <th tabIndex="0">Customer Number</th>
                                                            <th tabIndex="0">Customer Email</th>
                                                            <th tabIndex="0">Ticket ID</th>
                                                            <th tabIndex="0">Requirement</th>
                                                            <th tabIndex="0">Product Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.filter(
                                                            (item) =>
                                                                item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                                                item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                                                item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                                                        ).map((item) => (
                                                            <tr key={item.uniqueQueryId}>
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
                                                                <td>{item.senderMobile}</td>
                                                                <td>{item.senderEmail}</td>
                                                                <td>{item.uniqueQueryId}</td>
                                                                <td>{item.subject}</td>
                                                                <td>{item.queryProductName}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/* Pending tab */}
                                        <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                                                            </th>
                                                            <th tabIndex="0">Query ID</th>
                                                            <th tabIndex="0">Query McatName</th>
                                                            <th tabIndex="0">Sender Company</th>
                                                            <th tabIndex="0">Sender Name</th>
                                                            <th tabIndex="0">Sender Mobile</th>
                                                            <th tabIndex="0">Sender Address</th>
                                                            <th tabIndex="0">Query Message</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.filter(
                                                            (item) =>
                                                                item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                                                item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                                                item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                                                        ).map((item) => (
                                                            <tr key={item.uniqueQueryId}>
                                                                <td className="selection-cell">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTickets.includes(item.uniqueQueryId)}
                                                                        onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                                                                    />
                                                                </td>
                                                                <td>{item.uniqueQueryId}</td>
                                                                <td>{item.queryMcatName}</td>
                                                                <td>{item.senderCompany}</td>
                                                                <td>{item.senderName}</td>
                                                                <td>{item.senderMobile}</td>
                                                                <td>{item.senderAddress}</td>
                                                                <td>{item.queryMessage}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/* New tab */}
                                        <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                                                            </th>
                                                            <th tabindex="0">Date/Time</th>
                                                            <th tabindex="0">Country</th>
                                                            <th tabIndex="0">Customer Name</th>
                                                            <th tabIndex="0">Customer Number</th>
                                                            <th tabIndex="0">Query ID</th>
                                                            <th tabIndex="0">Requirement</th>
                                                            <th tabIndex="0">Product Name</th>
                                                            <th tabIndex="0">Customer Email</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.filter(
                                                            (item) =>
                                                                item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                                                item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                                                item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                                                        ).map((item) => (
                                                            <tr key={item.uniqueQueryId}>
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
                                                                <td>{item.senderMobile}</td>
                                                                <td>{item.uniqueQueryId}</td>
                                                                <td>{item.queryMessage}</td>
                                                                <td>{item.queryProductName}</td>
                                                                <td>{item.senderEmail}</td>
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
                                <option value="">Choose...</option>
                                <option value="3">Captain</option>
                                <option value="4">Closer</option>
                                <option value="5">Senior SuperVisor</option>

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
