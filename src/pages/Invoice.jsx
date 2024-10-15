import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../auth/AuthContext';
import TrackPackage from './TrackPackage';

function Invoice(props) {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [ticketDetails, setTicketDetails] = useState(null)
    const [address, setAddress] = useState(null)
    const [totalAmount, setTotalAmount] = useState(null)
    const [currency, setCurrency] = useState(null)
    const [dateTimeStamp, setDatetimeStamp] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)
    const [selectedKey, setSelectedKeuy] = useState(null)
    const [trackingNumber,setTrackingNumber]=useState(null)

    // WebSocket for notifications
    useEffect(() => {
        const socket = new SockJS('https://rdvision.online/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe('/topic/invoice/', (message) => {
                    const newTicket = JSON.parse(message.body);
                    setTickets((prevTickets) => [newTicket, ...prevTickets]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker error: ', frame.headers['message']);
            },
        });
        stompClient.activate();

        return () => stompClient.deactivate();
    }, []);

    // Fetch invoices
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get("/invoice/getinvoices");
                setTickets(response.data.filter((invoice) => invoice.inviceStatus === props.status));
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, [props.status]);

    const handleCardClick = async (ticket) => {
        setSelectedTicketId(ticket.ticketId);
    };


    // Fetch order details from apiB when selectedTicketId changes
    useEffect(() => {
        if (selectedTicketId) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/order/getOrderDetails/${selectedTicketId}`);
                    setOrderDetails(response.data.dtoList);
                    setOrderDetails(response.data.orderDetails.productOrders)
                    setAddress(response.data.addresss)
                    setTicketDetails(response.data.ticketDetail)
                    setTotalAmount(response.data.orderDetails.totalPayableAmount)
                    setCurrency(response.data.orderDetails.productOrders[0].currency)
                    setDatetimeStamp(response.data.orderDetails.date)
                    setPaymentStatus(response.data.orderDetails.paymentStatus)
                    setTrackingNumber(response.data.orderDetails.trackingNumber)
                } catch (err) {
                    console.error('Error fetching order details:', err);
                }
            };

            fetchOrderDetails();
        }
    }, [selectedTicketId]);


    function formatTimestampToDate(timestamp) {
        // Convert the timestamp to a Date object
        const date = new Date(timestamp);

        // Format the date (yyyy-MM-dd HH:mm:ss)
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // 24-hour format
        });

        return formattedDate;
    }
    return (
        <>
            {/* <!--End Top Nav --> */}
            <div className="container-fluid mt-3">
                {/* <!-- Section one --> */}
                <section className="sadmin-top-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card">
                                    <div className="div-top">
                                        <h3 className="title">Total Sales</h3>
                                        <span className="sales">0<span className="indicators">0%</span></span>
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
                                        <span className="sales">0<span className="indicators">0%</span></span>
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
                                        <span className="sales">0<span className="indicators">0%</span></span>
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
                                        <span className="sales">0<span className="indicators">0%</span></span>
                                    </div>
                                    <div className="icon-wrapper">
                                        <i className="fa-solid fa-wallet"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- graphs and ranking --> */}
                <section className="orders-view-wrapper common-tab-view-section py-5">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-5">
                                <div className="order-menu-wrapper">
                                    <div className="nav flex-column vertical-tab-nav" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                        {/* <!-- ticket one ends here  --> */}
                                        {tickets.map((ticket, index) => (
                                            <div className={`nav-link ${index === selectedKey ? "bg-secondary text-white" : ""}`} key={index} onClick={() => setSelectedKeuy(index)} id="v-pills-ticket2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket2" type="button" role="tab" aria-controls="v-pills-ticket2" aria-selected="true">
                                                <div className="order-card" key={ticket.ticketId} onClick={() => handleCardClick(ticket)}>
                                                    <div className="left-part">
                                                        <h3 className="title">{ticket.inviceStatus}</h3>
                                                        <p className="sub-title ">
                                                            <i className="fa-solid fa-ticket"></i>
                                                            {ticket.ticketId}
                                                        </p>
                                                    </div>
                                                    <div className="right-part">AT : <span className="badge no-status">{ticket.inviceId}</span></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {dateTimeStamp && <div className="col-7">


                                <div className="container my-4">
                                    <div className="card shadow-sm p-4">
                                        <div className="d-flex justify-content-between">
                                            <h5>TKTID:{ticketDetails ? ticketDetails.uniqueQueryId : ""}</h5>
                                            {dateTimeStamp && <span>{formatTimestampToDate(dateTimeStamp)}</span>}
                                        </div>

                                        {/* Billing and Delivery Information */}
                                        <div className="card mt-3 p-3">
                                            <div className="row">
                                                {/* Icon or Placeholder */}
                                                <div className="col-2 d-flex align-items-center">
                                                    <img src="https://via.placeholder.com/50" alt="user" className="img-fluid rounded" />
                                                </div>

                                                {/* Billing Name and Info */}
                                                <div className="col-10">
                                                    <h6>Billing Name</h6>
                                                    <p className="mb-1">
                                                        <span className="me-3">📞 {ticketDetails ? ticketDetails.senderMobile : ""}</span>
                                                        <span>📧 {ticketDetails ? ticketDetails.senderEmail : ""}</span>
                                                    </p>
                                                    <p className="mb-0">
                                                        <strong>Billing Address : </strong>{ticketDetails ? ticketDetails.senderAddress : ""}
                                                    </p>
                                                    <p className="mb-0">
                                                        <strong>Delivery Address : </strong> {address && address.houseNumber},{address && address.landmark},{address && address.city},
                                                        {address && address.state},{address && address.country},{address && address.zipCode}

                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products Details */}
                                        {orderDetails && orderDetails.map((order, index) => (
                                            <div className="mt-4">
                                                <div className="d-flex justify-content-between">
                                                    <span>{order.product[0].name}</span>
                                                    <span>{order.currency} {order.totalAmount}</span>
                                                </div>
                                                <p>Qty: {order.quantity} </p>


                                            </div>
                                        ))}

                                        {/* Total Price */}
                                        <div className="d-flex justify-content-end mt-3">
                                            {currency && <h5>Total Ammount :-{currency} {totalAmount}</h5>}
                                        </div>

                                        {/* Payment Status and Action Buttons */}
                                        <div className="mt-4">
                                            {paymentStatus && <h6 >Payment Status :- <span className={`${paymentStatus === "PENDING" ? "text-danger" : "text-success"}`}>{paymentStatus}</span></h6>}
                                            {/* Buttons */}
                                            <div className="d-flex justify-content-between mt-3">
                                                <button className="btn btn-success">Mark as Paid</button>
                                                <button className="btn btn-warning">Hold</button>
                                                <button className="btn btn-primary">Send Invoice</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <TrackPackage trackingNumber={trackingNumber}/>
                            </div>}
                        </div>
                    </div>
                </section>

                {/* <!-- section 2 --> */}
                <section className="data-table-bgs_02x24 py-3">
                    <div className="container-fluid">
                        <div className="table-wrapper">
                            <h3 className="title">Recent Transactions</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="selection-cell-header" data-row-selection="true">
                                            <input type="checkbox" className="" />
                                        </th>
                                        <th tabindex="0">
                                            <a data-bs-toggle="modal" data-bs-target="#exampleModal">Name</a>
                                        </th>
                                        <th tabindex="0">Ticket ID</th>
                                        <th tabindex="0">Type/Status</th>
                                        <th tabindex="0">Contact</th>
                                        <th tabindex="0">Email</th>
                                        <th tabindex="0">Description/Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="selection-cell">
                                            <input type="checkbox" className="" />
                                        </td>
                                        <td>John Skrew</td>
                                        <td>#12548796</td>
                                        <td><span className="status">new</span></td>
                                        <td>+91 XXXXXXXX 90</td>
                                        <td>****@gmail.com</td>
                                        <td>Lorem ipsum dolor sit amet....</td>
                                    </tr>
                                    <tr>
                                        <td className="selection-cell">
                                            <input type="checkbox" className="" />
                                        </td>
                                        <td>John Skrew</td>
                                        <td>#12548796</td>
                                        <td><span className="status">new</span></td>
                                        <td>+91 XXXXXXXX 90</td>
                                        <td>****@gmail.com</td>
                                        <td>Lorem ipsum dolor sit amet....</td>
                                    </tr>
                                    <tr>
                                        <td className="selection-cell">
                                            <input type="checkbox" className="" />
                                        </td>
                                        <td>John Skrew</td>
                                        <td>#12548796</td>
                                        <td><span className="status">new</span></td>
                                        <td>+91 XXXXXXXX 90</td>
                                        <td>****@gmail.com</td>
                                        <td>Lorem ipsum dolor sit amet....</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>


            {/* <!-- Modal --> */}
            <div className="modal ticket-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="heading-area">
                                        <div className="vertical-write">
                                            <h2 className="title">Jenell D. Matney</h2>
                                            <p className="ticket-id"><i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="main-content-area">
                                        <div className="contact-info-row">
                                            <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                                            <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                                        </div>
                                        <div className="button-grp">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Invoice