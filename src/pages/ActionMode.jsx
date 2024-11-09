import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Button, Modal } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';
import TicketJourney from '../components/TicketJourney';
import InvoiceBox from '../components/InvoiceBox';
import temp1 from '../assets/emailtemp/temp1.png';
import temp2 from '../assets/emailtemp/temp2.png';
import temp3 from '../assets/emailtemp/temp3.png';

// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopyToClipboard from 'react-copy-to-clipboard';

function ActionMode() {
    const [ticket, setTicket] = useState(null); // Holds the current ticket
    const [loading, setLoading] = useState(true); // To track loading state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [showSaleTransaction, setShowTransaction] = useState(false);
    const [showFollowUpDate, setShowFollowUpDate] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(0)
    const [text, setText] = useState("")
    const [serchValue, setserchValue] = useState("")
    const [productsIds, setProductIds] = useState([])
    const { userId } = useAuth();
    const { setFolowupUpdate } = useAuth()
    const [currentTicket, setCurrentTicket] = useState(0)
    const [totalTicket, setTotalTicket] = useState(0)
    const [searchString, setSearchString] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("New")
    const [ticketNumber, setTicketNumber] = useState(localStorage.getItem("currentWorkingTicket") ? localStorage.getItem("currentWorkingTicket") : 0)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Form data state
    const [response, setResponse] = useState(null);
    const [uniqueQueryId, setUniqueQueryId] = useState(null);

    // Modal state
    const [productsList, setProductsList] = useState([]);
    const [on, setOn] = useState(false);
    const [view, setView] = useState(false);
    const [activeTab, setActiveTab] = useState("newTickets");
    const [callId, setCallId] = useState(0)
    const [selectTicketForInvoice, setSelectTicketForInvoice] = useState(null)
    const [selectNameForInvoice, setSelectNameForInvoice] = useState(null)
    const [selectMobileForInvoice, setSelectMobileForInvoice] = useState(null)
    const [selectEmailForInvoice, setSelectEmailForInvoice] = useState(null)
    const handleCloses = () => setView(false);
    const closeTicketJourney = () => {
        // document.getElementById("ticketjourney").close()
        setIsTicketJourneyOpen(false)
    }

    //ticket journey
    const [selctedTicketInfo, setSelectedTicketInfo] = useState("")
    const [isTicketJourneyOpen, setIsTicketJourneyOpen] = useState(false)
    const openTicketJourney = (ticketId) => {
        setSelectedTicketInfo(ticketId)
        setIsTicketJourneyOpen(true)
        // document.getElementById("ticketjourney").showModal()
    }

    const getColorByStatus = (ticketStatus) => {
        const colors = {
            'New': 'dodgerblue',
            'Sale': 'green',
            'Follow': 'RoyalBlue',
            'Interested': 'orange',
            'Not_Interested': 'red',
            'Wrong_Number': 'gray',
            'Not_Pickup': 'lightblue',
            ' hang_up': 'yellow'
        };
        return colors[ticketStatus] || 'white';
    };


    const handleShow = (queryId) => {
        setUniqueQueryId(queryId);
        setShow(true);
    };

    // Masking mobile number
    const maskMobileNumber = (number) => {
        if (number.length < 4) return number;
        return number.slice(0, -4) + 'XXXX';
    };

    const [isInvoiceOn, setIsInvoiceOn] = useState(false)
    const handleInvoice = (ticketId, name, email, mobile) => {
        setSelectTicketForInvoice(ticketId)
        setSelectNameForInvoice(name)
        setSelectEmailForInvoice(email)
        setSelectMobileForInvoice(mobile)
        setIsInvoiceOn(!isInvoiceOn)
    }

    // Function to fetch the next ticket
    const [formData, setFormData] = useState({ ticketStatus: '', comment: '', followUpDateTime: '' });

    const fetchFirstTicket = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/third_party_api/ticket/getFirstTicket/${userId}`);
            setTicket(response.data.ticket);
            setTotalTicket(response.data.totalTickets) // Assuming the response contains a single ticket
            setCurrentTicket(response.data.currentTicketNo)
        } catch (error) {
            console.error("Error fetching next ticket:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchSpecifiTicketByNumber = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/third_party_api/ticket/getSpecificTicketByNumber', {
                userId,
                number: ticketNumber,
                status:selectedStatus
            });
            setTicket(response.data.ticket);
            setTotalTicket(response.data.totalTickets) // Assuming the response contains a single ticket
            setCurrentTicket(response.data.currentTicketNo)
        } catch (error) {
            console.error("Error fetching next ticket:", error);
        } finally {
            setLoading(false);
            localStorage.setItem("currentWorkingTicket", ticketNumber)
        }
    };
    const fetchNextTicket = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/third_party_api/ticket/next`,{
                userId,
                number: ticketNumber,
                status:selectedStatus
            });
            setTicket(response.data.ticket);
            setTotalTicket(response.data.totalTickets) // Assuming the response contains a single ticket
            setCurrentTicket(response.data.currentTicketNo)
            localStorage.setItem("currentWorkingTicket", response.data.currentTicketNo)

        } catch (error) {
            console.error("Error fetching next ticket:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        setserchValue(e.target.value); // Update state with the input's value
        console.log('Input Value:', e.target.value); // Log the current input value
    };
    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!uniqueQueryId) {
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
            const res = await axiosInstance.post(`/third_party_api/ticket/updateTicketResponse/${uniqueQueryId}`, {}, { params });
            setResponse(res.data.dtoList);
            toast.success('Update successfully!');
            handleClose();
            fetchData(params[activeTab], currentPage, itemsPerPage);
            setError(null);
            setCallId(0)
            setFolowupUpdate(uniqueQueryId)
        } catch (err) {
            setError(err.message);
            setResponse(null);
        }
    };
    const handleOff = () => {
        setOn(false)
        setProductArray([])
    };
    // Update handleStatusChange function
    const handleStatusChange = (event) => {
        handleChange(event);
        const { value } = event.target;

        // Show folloeupdatetime input when 'Follow' is selected
        if (value === "Follow") {
            setShowFollowUpDate(true);
        } else {
            setShowFollowUpDate(false);
        }

        // Show transaction details input when 'Sale' is selected
        if (value === "Sale") {
            setShowTransaction(true);
        } else {
            setShowTransaction(false);
        }
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleClick = async (number) => {
        try {
            const response = await axiosInstance.post('/third_party_api/ticket/clickToCall', {
                number: formatNumberAccordingToHodu(number),
                userId
            });
            setCallId(response.data.call_id)
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };
    const handleOn = (ticketId, name, email, mobile) => {
        setSelectTicketForInvoice(ticketId)
        setSelectNameForInvoice(name)
        setSelectEmailForInvoice(email)
        setSelectMobileForInvoice(mobile)
        setOn(!isInvoiceOn)
    }

    const formatNumberAccordingToHodu = (number) => {
        if (number.includes("+")) {
            return number.replace(/[+-]/g, "")
        } else {
            return "1" + number
        }
    }

    const maskEmail = (email) => {
        const [user, domain] = email.split('@');
        const maskedUser = user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
        return `${maskedUser}@${domain}`;
    };

    // Function to fetch the previous ticket
    const fetchPreviousTicket = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/third_party_api/ticket/previous`,{
                userId,
                number: ticketNumber,
                status:selectedStatus
            });
            setTicket(response.data.ticket); // Assuming the response contains a single ticket
            setTotalTicket(response.data.totalTickets) // Assuming the response contains a single ticket
            setCurrentTicket(response.data.currentTicketNo)
            localStorage.setItem("currentWorkingTicket", response.data.currentTicketNo)
        } catch (error) {
            console.error("Error fetching previous ticket:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchbyNameOrEmailOfNumber = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/third_party_api/ticket/getBySearchQuery`, {
                userId,
                searchQuery: searchString,
                status:selectedStatus
            });
            setTicket(response.data.ticket); // Assuming the response contains a single ticket
            setTotalTicket(response.data.totalTickets) // Assuming the response contains a single ticket
            setCurrentTicket(response.data.currentTicketNo)
            localStorage.setItem("currentWorkingTicket", response.data.currentTicketNo)
        } catch (error) {
            console.error("Error fetching previous ticket:", error);
        } finally {
            setLoading(false);
        }
    };
    // Call next API by default on mount
    useEffect(() => {
        if (localStorage.getItem("currentWorkingTicket")) {
            fetchSpecifiTicketByNumber()
        } else {
            fetchFirstTicket();
        }
        fetchProducts()
    }, [selectedStatus]);

    const fetchProducts = async () => {
        const response = await axiosInstance.get("product/getAllProducts");
        setProductsList(response.data.dtoList);
    };
    const handleSendTemplateMail = async () => {
        if (selectedTemplate < 1) {
            toast.info("Please Select one Template ")
        } else if (productsIds.length < 1) {
            toast.info("Please Select At least one Product ")

        } else if (text.length < 1) {
            toast.info("Please Enter Message")
        } else {
            try {
                const response = await axiosInstance.post("/email/sendsugetionmail", {
                    ticket: {
                        uniqueQueryId: selectTicketForInvoice
                    },
                    text: text,
                    temp: selectedTemplate,
                    productsIds: productsIds,
                    userId
                })
                toast.success("Email Sent")
            } catch (e) {
                toast.error("Some Error Occurs")
            }
        }
    }
    const handleToggleProduct = (id) => {
        setProductIds((prevIds) => {
            if (prevIds.includes(id)) {
                // Remove the ID if it already exists
                return prevIds.filter((prevId) => prevId !== id);
            } else {
                // Add the ID if it does not exist
                return [...prevIds, id];
            }
        });
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);

        // Get day, month, and year
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getUTCFullYear();

        // Get hours and minutes in 12-hour format
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format

        return `${day}-${month}-${year} ${formattedHours}:${minutes.toString().padStart(2, '0')}${period}`;
    };
    const [copiedId, setCopiedId] = useState(null); // Track copied uniqueQueryId
    const [copiedType, setCopiedType] = useState(null); // Track if mobile or email is copied

    const handleCopy = (uniqueQueryId, text, type) => {
        setCopiedId(uniqueQueryId); // Set the copied ID
        setCopiedType(type); // Track whether it's a mobile number or email
        addCopyRecord(uniqueQueryId, text); // Log the copied record
    };
    const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;


    return (
        <>
            <section className="min-vh-100 bg-light py-3 ">
                <div className="container-fluid">
                    <div className="d-flex justify-content-center flex-column">
                        <div className='text-center d-flex justify-content-center m-3'>
                            <button className="bg-light text-success border"  onClick={()=>setSelectedStatus("New")}>{selectedStatus==="New" && "✅"} New Tickets</button>
                            <button className="bg-light text-success border" style={{marginLeft:"15px"}} onClick={()=>setSelectedStatus("Follow")}>{selectedStatus!=="New" && "✅"} Negotiations</button>
                        </div>
                        <div className="shadow border p-3 rounded bg-white w-100" style={{ minHeight: '40vh', maxHeight: "90vh", overflowY: "auto" }}>
                            <div className="card " style={{minHeight:"60vh"}}>
                            <div className="w-25 rounded py-2 bg-primary text-white text-center position-absolute" style={{ top: "-20px", left: "-20px" }}>
                                   {ticket&& <h5>Query Id:-{ticket.uniqueQueryId && ticket.uniqueQueryId}</h5>}
                                </div>
                                <div className="w-25 rounded py-2 bg-primary text-white text-center position-absolute" style={{ top: "-20px", right: "-20px" }}>
                                   {ticket&& <h5>Query Date Time :-{ticket.queryTime && formatDateTime(ticket.queryTime)}</h5>}
                                </div>
                                <div className='d-flex justify-content-between mt-3'>
                                    <div className="d-flex align-items-center">
                                        <span className='fw-bold text-muted'>Total Tickets:</span>
                                        <span className="ms-2 h4 text-primary">{totalTicket}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className='fw-bold text-muted'>Current Ticket Number:</span>
                                        <span className="ms-2 h4 text-success">{currentTicket} / {totalTicket}</span>
                                    </div>
                                </div>


                                <div className="card-body" style={{ minHeight: "35vh" }}>
                                    {ticket && (
                                        <div className="d-flex gap-2 justify-content-center" style={{ marginBottom: "30px" }}>
                                            {/* Info Button */}
                                            <button
                                                onClick={() => openTicketJourney(ticket.uniqueQueryId)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#followUpModal"
                                                className="btn btn-danger d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: "45px", height: "45px" }}
                                                title="Get connect on call"
                                            >
                                                <i className="fa-solid fa-info text-white"></i>
                                            </button>

                                            {/* Call Button */}
                                            <button
                                                onClick={() => handleClick(ticket.senderMobile)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#followUpModal"
                                                className="btn btn-success d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: "45px", height: "45px" }}
                                                title="Get connect on call"
                                            >
                                                <i className="fa-solid fa-phone text-white"></i>
                                            </button>

                                            {/* SMS Button */}
                                            <a
                                                href={`sms:${ticket.senderMobile}?&body=${`Hey ${ticket.senderName}, I just received the inquiry from your ${ticket.subject}. If you're looking for a good deal, please type YES👍`}`}
                                                className="btn btn-info d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: "45px", height: "45px" }}
                                                title="Get connect on message"
                                            >
                                                <i className="fa-solid fa-message text-white"></i>
                                            </a>

                                            {/* Email Button */}
                                            <button
                                                onClick={() => handleOn(ticket.uniqueQueryId)}
                                                className="btn btn-secondary d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: "45px", height: "45px" }}
                                                title="Get connect on email"
                                            >
                                                <i className="fa-solid fa-envelope text-white"></i>
                                            </button>

                                            {/* WhatsApp Button */}
                                            <a
                                                href={`https://wa.me/${ticket.senderMobile.replace(/[+-]/g, '')}?text=${`Hey ${ticket.senderName}, I just received the inquiry from your ${ticket.subject}. If you're looking for a good deal, please type YES👍`}`}
                                                target="_blank"
                                                className="btn btn-success d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: "45px", height: "45px" }}
                                                title="Get connect on WhatsApp"
                                            >
                                                <i className="fa-brands fa-whatsapp text-white"></i>
                                            </a>

                                            {/* Invoice Button */}
                                            <button
                                                onClick={() => handleInvoice(ticket.uniqueQueryId)}
                                                className="btn btn-secondary d-flex align-items-center justify-content-center rounded-circle"
                                                style={{ width: "45px", height: "45px" }}
                                                title="Get invoice"
                                            >
                                                <i className="fa-solid fa-file-invoice text-white"></i>
                                            </button>
                                        </div>
                                    )}

                                    {loading ? (
                                        <p className="text-center text-muted">Loading ticket...</p>
                                    ) : ticket ? (
                                        <>
                                            <div className="row mb-3" style={{marginTop:"50px"}}>
                                                <div className="col-md-6">
                                                    <p><strong>Ticket ID:</strong> {ticket.id}</p>
                                                    <p><strong>Unique Query ID:</strong> {ticket.uniqueQueryId}</p>
                                                    <p><strong>Name:</strong> {ticket.senderName}</p>
                                                    <p><strong>Mobile:</strong> {maskMobileNumber(ticket.senderMobile)}  <CopyToClipboard
                                                        text={ticket.senderMobile}
                                                        onCopy={() => handleCopy(ticket.uniqueQueryId, ticket.senderMobile,
                                                            'mobile')}
                                                    >
                                                        <button
                                                            style={{
                                                                backgroundColor:
                                                                    copiedId === ticket.uniqueQueryId && copiedType === 'mobile' ? 'green' : 'black',
                                                                color: copiedId === ticket.uniqueQueryId && copiedType === 'mobile' ? 'white' : 'white',
                                                            }}
                                                        >
                                                            {copiedId === ticket.uniqueQueryId && copiedType === 'mobile' ? 'Copied!' : 'Copy'}
                                                        </button>
                                                    </CopyToClipboard></p>
                                                    <p><strong>Email:</strong> {maskEmail(ticket.senderEmail)}  {/* For Email */}
                                                        <CopyToClipboard
                                                            text={ticket.senderEmail}
                                                            onCopy={() => handleCopy(ticket.uniqueQueryId, ticket.senderEmail, 'email')}
                                                        >
                                                            <button
                                                                style={{
                                                                    backgroundColor:
                                                                        copiedId === ticket.uniqueQueryId && copiedType === 'email' ? 'green' : 'black',
                                                                    color: copiedId === ticket.uniqueQueryId && copiedType === 'email' ? 'white' : 'white',
                                                                }}
                                                            >
                                                                {copiedId === ticket.uniqueQueryId && copiedType === 'email' ? 'Copied!' : 'Copy'}
                                                            </button>
                                                        </CopyToClipboard>
                                                    </p>
                                                    {ticket.senderAddress &&<p><strong>Address:</strong> {ticket.senderAddress}</p>}
                                                    <p><strong>Country:</strong> {ticket.senderCountryIso}  <img src={getFlagUrl(ticket.senderCountryIso === "UK" ? "gb" : ticket.senderCountryIso)} alt={`${ticket.senderCountryIso} flag`} /></p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Enquiry Date:</strong> {formatDateTime(ticket.queryTime)}</p>
                                                    <p onClick={() => handleShow(ticket.uniqueQueryId)} >
                                                        <b>Status:</b> <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                                            style={{ backgroundColor: getColorByStatus(ticket.ticketstatus) }}>
                                                            {ticket.ticketstatus}
                                                        </a>
                                                    </p>
                                                    <p><strong>Requirement:</strong> {ticket.subject}</p>
                                                    <p><strong>Query Message:</strong> {ticket.queryMessage}</p>
                                                    {ticket.lastActionDate && <p><strong>Last Action:</strong> {ticket.lastActionDate}</p>}
                                                    {ticket.lastActionDate && <p><strong>Last Action:</strong> {ticket.lastActionDate}</p>}
                                                    {ticket.comment &&<p><strong>Last Comment:</strong> {ticket.comment}</p>}

                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-center text-muted">No ticket data available.</p>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mt-3">
                                <button className="btn btn-primary" onClick={fetchPreviousTicket} disabled={currentTicket == 1}>Prev</button>
                                <div>
                                    <label htmlFor="number ">Enter ticket number </label>
                                    <input value={ticketNumber} className='bg-white text-black p-2 rounded' style={{ width: "100px", margin: '5px' }} onChange={(e) => setTicketNumber(e.target.value)} type="number" />
                                    <button className="btn btn-primary" onClick={fetchSpecifiTicketByNumber} min="0" disabled={ticketNumber < 1}>Go To</button>

                                </div>
                                <div>
                                    {/* <label htmlFor="search "><i class="fa-solid fa-magnifying-glass fa-2xl"></i></label> */}
                                    <input value={searchString} className='bg-white text-black p-2 rounded' style={{ width: "200px", margin: '5px' }} onChange={(e) => setSearchString(e.target.value)} type="text" placeholder='enter number/email/name' />
                                    <button className="btn btn-primary" onClick={searchbyNameOrEmailOfNumber} min="0" disabled={searchString.length === 0}>Search</button>

                                </div>
                                <button className="btn btn-primary" onClick={fetchNextTicket} disabled={currentTicket == totalTicket}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="followUpModal" tabIndex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
                <Modal.Header closeButton>
                    <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
                        Call Status
                    </h1>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                                className="form-select"
                                id="status"
                                name="ticketStatus"
                                value={formData.ticketStatus}
                                onChange={handleStatusChange}
                            >
                                <option>Choose Call-Status</option>
                                <option value="Sale">Sale</option>
                                {/* <option value="New">New</option> */}
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
                                    type="transaction-details"
                                    placeholder="Enter Transaction id "
                                    className="form-control"
                                    id="transactionDetails"
                                    name="transactionDetails"
                                    value={formData.SaleTransaction}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {showFollowUpDate && (
                            <div className="mb-3">
                                <label htmlFor="followUpDateTime" className="form-label">Follow Up Date and Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="followUpDateTime"
                                    name="followUpDateTime"
                                    value={formData.followUpDateTime}
                                    onChange={handleChange}
                                    step="2"
                                />
                            </div>
                        )}
                        <div className="col-12">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <textarea
                                rows="4"
                                className="form-control"
                                placeholder="Discribe your conversation with client"
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="modal-footer justify-content-center border-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                                Close
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="followUpModal" tabIndex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
                <Modal.Header closeButton>
                    <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
                        Call Status
                    </h1>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                                className="form-select"
                                id="status"
                                name="ticketStatus"
                                value={formData.ticketStatus}
                                onChange={handleStatusChange}
                            >
                                <option>Choose Call-Status</option>
                                <option value="Sale">Sale</option>
                                {/* <option value="New">New</option> */}
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
                                    type="transaction-details"
                                    placeholder="Enter Transaction id "
                                    className="form-control"
                                    id="transactionDetails"
                                    name="transactionDetails"
                                    value={formData.SaleTransaction}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {showFollowUpDate && (
                            <div className="mb-3">
                                <label htmlFor="followUpDateTime" className="form-label">Follow Up Date and Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="followUpDateTime"
                                    name="followUpDateTime"
                                    value={formData.followUpDateTime}
                                    onChange={handleChange}
                                    step="2"
                                />
                            </div>
                        )}
                        <div className="col-12">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <textarea
                                rows="4"
                                className="form-control"
                                placeholder="Discribe your conversation with client"
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="modal-footer justify-content-center border-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                                Close
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            {/* <!-- Modal ticket popup --> */}
            < Modal
                show={view} onHide={handleCloses}
                className="modal ticket-modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="ticket-content-spacing">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="heading-area">
                                        <div className="vertical-write">
                                            <h2 className="title">Jenell D. Matney</h2>
                                            <p className="ticket-id">
                                                <i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div
                                        className="contact-info-row d-flex align-items-center justify-content-between"
                                    >
                                        <a href="" className="contact-info phone"
                                        ><i className="fa-solid fa-phone"></i> +91 9918293747</a
                                        >
                                        <a className="contact-info email" href="#"
                                        ><i className="fa-solid fa-envelope-open-text"></i>
                                            example@email.com</a
                                        >
                                    </div>
                                    <div className="main-content-area">
                                        <form>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                <label className="form-check-label" for="flexCheckDefault">
                                                    Default checkbox
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                                                <label className="form-check-label" for="flexCheckChecked">
                                                    Checked checkbox
                                                </label>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="comment" className="form-label">Comment</label>
                                                <textarea
                                                    rows="4"
                                                    className="form-control"
                                                    placeholder="Discribe your conversation with client"
                                                    id="comment"
                                                    name="comment"
                                                ></textarea>
                                            </div>
                                            <div className="modal-footer justify-content-center border-0">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloses}>
                                                    Close
                                                </button>
                                                <button className="btn btn-primary" type="submit">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <dialog
                id="ticketjourney"
                className="bg-white rounded shadow"
                style={{ width: '80%', maxWidth: '600px', border: 'none' }}
            >

                <div className="position-fixed vh-100 vw-100 d-flex flex-coloumn justify-content-center align-items-center">
                    <TicketJourney tktid={selctedTicketInfo} closeFun={closeTicketJourney} />
                </div>
            </dialog>


            {/* //invoice modal */}
            <Modal
                show={isInvoiceOn}
                onHide={handleInvoice}
                id="followUpModal"
                tabindex="-1"
                aria-labelledby="followUpModalLabel"
                aria-hidden="true"
                dialogClassName="fullscreen-modal" // Add a custom class here
            >
                <h1 className="w-100 text-center mb-3" id="followUpModalLabel">
                    <u> Raise Invoice</u>
                </h1>
                <InvoiceBox
                    ticketId={selectTicketForInvoice}
                    name={selectNameForInvoice}
                    email={selectEmailForInvoice}
                    mobile={selectMobileForInvoice}
                />
            </Modal>

            <Modal
                show={isTicketJourneyOpen}
                onHide={closeTicketJourney}
                id="followUpModal"
                tabindex="-1"
                aria-labelledby="followUpModalLabel"
                aria-hidden="true"
                dialogClassName="fullscreen-modal rounded-modal" // Add custom classes
            >
                <TicketJourney tktid={selctedTicketInfo} closeFun={closeTicketJourney} />
            </Modal>
            <Modal show={on} onHide={handleOff} className="modal assign-ticket-modal fade" id="followUpModal" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
                <Modal.Header closeButton>
                    <h4 className="w-100 text-center" id="followUpModalLabel">
                        Send Quotation Mail to Customer
                    </h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="shadow p-3 mb-5 bg-white rounded">
                                    <div className="card-body d-flex flex-column align-items-start">
                                        <input
                                            type="checkbox"
                                            className="bg-info mt-2"
                                            style={{ height: "40px", fontSize: "12px" }}
                                            checked={selectedTemplate === 1}
                                            onChange={() => handleToggleProduct(1)}
                                            onClick={() => setSelectedTemplate(1)}
                                        />
                                        <img
                                            onClick={() => setSelectedTemplate(1)}
                                            src={temp1}
                                            style={{ height: "150px", cursor: "pointer" }}
                                            alt="Template 1"
                                            className="img-fluid hoverEffectToTemp"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="shadow p-3 mb-5 bg-white rounded">
                                    <div className="card-body d-flex flex-column align-items-start">
                                        <input
                                            type="checkbox"
                                            className="bg-info mt-2"
                                            style={{ height: "40px", fontSize: "12px" }}
                                            checked={selectedTemplate === 2}
                                            onChange={() => handleToggleProduct(2)}
                                            onClick={() => setSelectedTemplate(2)}
                                        />
                                        <img
                                            onClick={() => setSelectedTemplate(2)}
                                            src={temp2}
                                            style={{ height: "150px", cursor: "pointer" }}
                                            alt="Template 2"
                                            className="img-fluid hoverEffectToTemp"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="shadow p-3 mb-5 bg-white rounded">
                                    <div className="card-body d-flex flex-column align-items-start">
                                        <input
                                            type="checkbox"
                                            className="bg-info mt-2"
                                            style={{ height: "40px", fontSize: "12px" }}
                                            checked={selectedTemplate === 3}
                                            onChange={() => handleToggleProduct(3)}
                                            onClick={() => setSelectedTemplate(3)}
                                        />
                                        <img
                                            onClick={() => setSelectedTemplate(3)}
                                            src={temp3}
                                            style={{ height: "150px", cursor: "pointer" }}
                                            alt="Template 3"
                                            className="img-fluid hoverEffectToTemp"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div>
                            <>
                                <div className='d-flex justify-content-between px-5'>
                                    <input
                                        type='text'
                                        placeholder='Enter product Name'
                                        value={serchValue}
                                        onChange={handleInputChange}
                                        className='p-2 bg-white text-black'
                                    />
                                    {productsIds.length > 0 && (
                                        <div
                                            className='bg-primary text-white rounded p-2 hover:shadow-lg'
                                            style={{ height: "30px", fontSize: "12px", cursor: "Pointer" }}
                                            onClick={() => setProductIds([])}
                                        >
                                            Deselect All
                                        </div>
                                    )}


                                </div>

                                <div className="container mt-3 border p-3 rounded">
                                    <div className="row" style={{ height: "500px" }}>
                                        {productsList && productsList
                                            .filter(product =>
                                                serchValue.length > 0
                                                    ? product.name.toLowerCase().includes(serchValue.toLowerCase())
                                                    : true
                                            )
                                            .filter((product) => product.images !== null).map((product, index) => (
                                                <div key={index} className="col-12 col-md-6 mb-3 d-flex justify-content-center " onClick={() => handleToggleProduct(product.productId)}>
                                                    <div className={`card p-2 position-relative ${productsIds.includes(product.productId) && "shadow-lg bg-info"}`} style={{ width: '100%', maxWidth: '300px', height: '80px' }}>
                                                        {/* Brand Tag */}
                                                        <div
                                                            className="position-absolute bottom-0 start-0 bg-success text-white px-2 py-1"
                                                            style={{ fontSize: '10px', borderTopLeftRadius: '4px', borderBottomRightRadius: '4px' }}
                                                        >
                                                            {product.brand}
                                                        </div>

                                                        <div className="d-flex flex-column flex-md-row align-items-center">
                                                            <div>
                                                                <img
                                                                    src={product.images && product.images[0]}
                                                                    alt="Product"
                                                                    className="img-fluid rounded"
                                                                    style={{ maxWidth: '60px' }}
                                                                />
                                                            </div>

                                                            {/* Product Details Section */}
                                                            <div className="ms-2 w-100 ">
                                                                <h6 className="card-title mb-1" style={{ fontSize: '12px' }}>
                                                                    {product.name} {product.Price}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}
                                    </div>
                                </div>
                            </>

                            <div className='mt-3'>
                                <label htmlFor="textarea fw-bold" style={{ fontSize: "20px", fontWeight: "bold" }}>Enter Message</label>
                                <textarea style={{ height: "150px", width: "100%" }} value={text} onChange={(e) => setText(e.target.value)} className='text-black bg-white p-3' placeholder='PLease Enter Meassage To Client' ></textarea>
                            </div>

                            <button onClick={() => handleSendTemplateMail()}>Send Mail</button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>


        </>
    );
}

export default ActionMode;

