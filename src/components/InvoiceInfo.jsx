import React, { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

const InvoiceInfo = (props) => {
    const [invoices, setInvoices] = useState([]);
    const { userId } = useAuth()
    const [currentSrc, setCurrentSrc] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const audioRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0)

    const [invoiceData, setInvoiceData] = useState({
        totalInvoices: null,
        totalPaidInvoices: null,
        totalPendingInvoices: null,
        totalAwaitingPaidInvoices: null,
    });
    const [trackingNumber, setTrackingNumber] = useState("");
    const [selectedTicket, setSelectedTicket] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;
    // Fetch Invoice Count Data
    useEffect(() => {
        fetchInvoiceData();
        fetchTicketSaleData()
    }, []);

    function formatFollowUpDate(followUpDateTime) {
        const [year, month, day] = followUpDateTime;
        // Convert month to 2-digit format and day to 2-digit format
        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        return `${year}-${convertNumberToStringMonth(formattedMonth)}-${formattedDay}`;
    }


    const [saleTicketData, setSaleTicketData] = useState([])

    const fetchTicketSaleData = async () => {
        const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
            user: localStorage.getItem("roleName") === "Closer" ? localStorage.getItem("userId") : 0,
            stage: 3,
        });
        setSaleTicketData(response.data);
    }

    const fetchInvoiceData = async () => {
        try {
            const response = await axiosInstance.get('/invoice/invoideCOunt');
            setInvoiceData({
                totalInvoices: response.data.totalInvoices,
                totalPaidInvoices: response.data.totalPaidInvoices,
                totalPendingInvoices: response.data.totalPendingInvoices,
                totalAwaitingPaidInvoices: response.data.totalAwaitingPaidInvoices,
            });
        } catch (err) {
            setError('Failed to fetch invoice data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Invoice Details
    useEffect(() => {
        fetchInvoices();
    }, [props.stage]);

    const fetchInvoices = async () => {
        try {
            const response = await axiosInstance.get(`/invoice/getAssInvoice/${userId}`);
            setInvoices(response.data)
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setError("Failed to fetch invoices");
        }
    };

    const convertNumberToStringMonth = (number) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[number - 1] || 'Invalid month';
    };

    const openTrackingBox = (ticketId) => {
        setSelectedTicket(ticketId);
        document.getElementById("trackingInput").classList.add("d-flex");
        document.getElementById("trackingInput").showModal();
    };

    const closeTrackingBox = () => {
        document.getElementById("trackingInput").classList.remove("d-flex");
        document.getElementById("trackingInput").close();
    };

    const addTrackingNumber = async () => {
        try {
            const response = await axiosInstance.post('/invoice/addTrackingNumber', {
                ticketId: selectedTicket,
                trackingNumber
            });

            if (response.data === "Tracking Number Added") {
                fetchInvoices();
                closeTrackingBox();
                toast.success(response.data);
                setTrackingNumber("");
            }
        } catch (err) {
            toast.error('Failed to add tracking number');
        }
    };

    const handleClick = async (ticketId) => {
        try {
            const response = await axiosInstance.get(`/invoice/clickToCall/${ticketId}`);

        } catch (error) {
            console.error("Error calling ticket:", error);
        }
    };

    const handleClickCallForticket = async (ticketId) => {
        try {
            const response = await axiosInstance.get(`${ticketId.length < 15 ? "/third_party_api/ticket/" : "/upload/"}clickToCall/${ticketId}`);

        } catch (error) {
            console.error("Error calling ticket:", error);
        }
    };



    const playRecording = useCallback((src, index) => {
        // Construct the new URL from src
        setSelectedIndex(index)
        let newUrl = `https:${src.split(":")[2].split("}")[0]}`; // Ensure proper URL formation
        newUrl = newUrl.split(`"`)[0];

        // Check if the new URL is different from the current source
        if (currentSrc !== newUrl) {
            // Pause the audio if it's currently playing
            if (audioRef.current) {
                audioRef.current.pause();
            }

            // Set the new source and play
            audioRef.current.src = newUrl;
            setCurrentSrc(newUrl);


            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true); // Update playing state on successful play
                })
                .catch(err => console.error("Error playing audio:", err)); // Handle any play errors
        } else {
            // Toggle play/pause based on current playing state
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true)) // Update playing state on successful play
                    .catch(err => console.error("Error resuming audio:", err)); // Handle any play errors
            }
        }
    }, [currentSrc, isPlaying]);


    // Move loading and error checks here, after all hooks
    if (loading) return <p className='text-center'>Loading...</p>;
    if (error) return <p>{error}</p>;

    const setFormate = (date) => {
        let newdate = date && (JSON.stringify(date).split("[")[1]).split("]")[0]
        return newdate && `${newdate.split(",")[2]}-${convertNumberToStringMonth(newdate.split(",")[1])}-${newdate.split(",")[0]}`;
    }
    console.log(invoices)
    return (
        <>
            {props.stage !== 4 && <section className="sadmin-top-section">
                <div className="container-fluid">
                    <div className="row">
                        {/* Total Invoices */}
                        <div className="col-md-3">
                            <div className="card position-relative">
                                <div className="div-top">
                                    <h3 className="title">Total Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalInvoices !== null ? invoiceData.totalInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="d-flex justify-content-center flex-column align-items-center">
                                    <div className="icon-wrapper">
                                        <i className="fa-solid fa-wallet" style={{ cursor: "pointer" }} onClick={() => setShowDetails(!showDetails)}></i>
                                    </div>
                                </div>
                                <div
                                    className={`details-box position-absolute bg-white border rounded p-3 shadow transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0 invisible'}`}
                                    style={{ top: '100%', left: '0', width: '100%' }}
                                >
                                    <p className="text-gray-800">Total Follow-ups: 50</p>
                                    <p className="text-gray-800">Total New: 30</p>
                                    <p className="text-gray-800">Total Sale: 20</p>
                                </div>
                            </div>
                        </div>

                        {/* Paid Invoices */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="div-top">
                                    <h3 className="title">Paid Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalPaidInvoices !== null ? invoiceData.totalPaidInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                        </div>

                        {/* Pending Invoices */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="div-top">
                                    <h3 className="title">Pending Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalPendingInvoices !== null ? invoiceData.totalPendingInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                        </div>

                        {/* Awaiting Invoices */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="div-top">
                                    <h3 className="title">Awaiting Tracking</h3>
                                    <span className="sales">
                                        {invoiceData.totalAwaitingPaidInvoices !== null ? invoiceData.totalAwaitingPaidInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>}

            <section className="data-table-bgs_02x24 py-3">
                <div className="container-fluid">
                    <div className="table-wrapper">
                        {props.stage === 4 ? <h3 className="title">Invoice Tracking</h3> : <h3 className="title">Invoices for after sales service</h3>}
                        <table className="table">
                            <thead>
                                <tr className='border'>
                                    <th className='text-center'>Created Date</th>
                                    <th className='text-center'>Total Amount</th>
                                    <th className='text-center'>Customer Name</th>
                                    <th className='text-center'>Country</th>
                                    <th className='text-center'>Order Details</th>
                                    {localStorage.getItem("roleName") === "SeniorSuperVisor" && <th className='text-center'>Tracking Number</th>}
                                    <th className='text-center'>Delivery Status</th>
                                    <th className='text-center'>Last Call Status</th>
                                    <th className='text-center'>Action</th>
                                    <th className='text-center'>Recording</th>
                                </tr>
                            </thead>
                            <tbody className='overflow'>
                                {invoices.length > 0 ? (
                                    invoices.map((invoice, index) => (
                                        <tr key={index} className='border'>
                                            <td className='text-center'>
                                                {invoice.saleDate && invoice.saleDate[2]}-{convertNumberToStringMonth(invoice.saleDate && invoice.saleDate[1])}-{invoice.saleDate && invoice.saleDate[0]}
                                            </td>
                                            <td className='text-center'>{invoice.orderDto.productOrders[0].currency} {invoice.orderDto.totalPayableAmount}</td>
                                            <td className='text-center'>{invoice.customerName}</td>
                                            <td className='text-center'><img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}</td>
                                            <td className='text-center'>{
                                                invoice.orderDto.productOrders.map((order, index) => (
                                                    <span>{order.product[0].name}</span>
                                                ))
                                            }</td>
                                            {localStorage.getItem("roleName") === "SeniorSuperVisor" && <td className='text-center'>{invoice.trackingNumber?invoice.trackingNumber: <button className='bg-primary' onClick={() => openTrackingBox(invoice.uniqueQueryId)}>Add Tracking Number</button>}</td>}

                                            <td className='text-center'>{invoice.deliveryStatus ? invoice.deliveryStatus : "N/A"}</td>
                                            <td className='text-center'>{invoice.assCallStatus}</td>
                                            <td className='text-center'>
                                                <Button
                                                    onClick={() => handleClick(invoice.uniqueQueryId)}
                                                    className="btn-action call rounded-circle"
                                                    title="Get connect on call"
                                                >
                                                    <i className="fa-solid fa-phone"></i>
                                                </Button>
                                            </td>
                                            <td className='text-center'>
                                                {invoice.callRecording ? <Button
                                                    className=""
                                                    onClick={() => playRecording(invoice.callRecording, index)}
                                                >
                                                    {isPlaying && selectedIndex === index ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}
                                                </Button> : "Recording not Available"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">
                                            No invoices found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <dialog id='trackingInput' className='w-100 h-100 bg-transparent justify-content-center align-items-center' style={{ height: '100vh' }}>
                            <div className='d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded'>
                                <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}>
                                    <i className="fa-solid fa-xmark fa-xl" onClick={closeTrackingBox} style={{ color: "#ff1900", cursor: "pointer" }}></i>
                                </div>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    autoFocus
                                    className='p-2 bg-white text-black'
                                    style={{ width: "500px" }}
                                    placeholder='Enter Tracking Number'
                                />
                                <button className='bg-primary text-white m-2' onClick={addTrackingNumber}>
                                    Add Tracking Number
                                </button>
                            </div>
                        </dialog>
                    </div>
                </div>
            </section>


            {/* 2nd table */}
            <section className="data-table-bgs_02x24 py-3">
                <div className="container-fluid">
                    <div className="table-wrapper">
                        {props.stage === 4 ? <h3 className="title">Ticket Tracking</h3> : <h3 className="title">Tickets for after sales service</h3>}
                        <table className="table">
                            <thead>
                                <tr className='border'>
                                    <th className='text-center'>Sale Date</th>
                                    <th className='text-center'>Name</th>
                                    <th className='text-center'>Tracking Id</th>
                                    <th className='text-center'>Delivery Status</th>
                                    <th className='text-center'>Comment</th>
                                    <th className='text-center'>Action</th>
                                    <th className='text-center'>Recording</th>
                                </tr>
                            </thead>
                            <tbody className='overflow'>
                                {saleTicketData.length > 0 ? (
                                    saleTicketData.map((invoice, index) => (
                                        <tr key={index} className='border'>
                                            <td className='text-center'>
                                                {invoice.lastActionDate ? formatFollowUpDate(invoice.lastActionDate) : "N/A"}
                                            </td>
                                            <td className='text-center'>{invoice.senderName ? invoice.senderName : invoice.firstName}</td>
                                            <td className='text-center'>{invoice.trackingNumber ? invoice.trackingNumber : localStorage.getItem("roleName") === "SeniorSuperVisor" ? <button className='bg-primary' onClick={() => openTrackingBox(invoice.uniqueQueryId)}>Add Tracking Number</button> : "Awaiting for Tracking..."}</td>

                                            <td className='text-center'>{invoice.deliveryStatus ? invoice.deliveryStatus : "NA"}</td>
                                            <td className='text-center'>{invoice.comment && invoice.comment.slice(0, 20)}</td>
                                            <td className='text-center'>
                                                <Button
                                                    onClick={() => handleClickCallForticket(invoice.uniqueQueryId)}
                                                    className="btn-action call rounded-circle"
                                                    title="Get connect on call"
                                                >
                                                    <i className="fa-solid fa-phone"></i>
                                                </Button>
                                            </td>
                                            <td className='text-center'>
                                                {invoice.recordingFile ? <Button
                                                    className=""
                                                    onClick={() => playRecording(invoice.recordingFile, index)}
                                                >
                                                    {isPlaying && selectedIndex === index ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}
                                                </Button> : "Recording not Available"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">
                                            No Sales found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center">
                        <dialog id='trackingInput' className='w-100 h-100 bg-transparent justify-content-center align-items-center' style={{ height: '100vh' }}>
                            <div className='d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded'>
                                <div style={{ width: "100%", textAlign: "right", marginBottom: "4px" }}>
                                    <i className="fa-solid fa-xmark fa-xl" onClick={closeTrackingBox} style={{ color: "#ff1900", cursor: "pointer" }}></i>
                                </div>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    autoFocus
                                    className='p-2 bg-white text-black'
                                    style={{ width: "500px" }}
                                    placeholder='Enter Tracking Number'
                                />
                                <button className='bg-primary text-white m-2' onClick={addTrackingNumber}>
                                    Add Tracking Number
                                </button>
                            </div>
                        </dialog>
                    </div>
                </div>
            </section>

            {/* Hidden audio element for playing recordings */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </>
    );
};

export default InvoiceInfo;
