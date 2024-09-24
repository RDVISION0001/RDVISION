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
    const [orderDetails, setOrderDetails] = useState(null);

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

    // Fetch ticket details when selectedTicketId changes
    useEffect(() => {
        if (selectedTicketId) {
            const fetchTicketDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/third_party_api/ticket/getTicket/${selectedTicketId}`);
                    setOrderDetails(response.data.dtoList);
                } catch (error) {
                    console.error('Error fetching ticket details:', error);
                }
            };
            fetchTicketDetails();
        }
    }, [selectedTicketId]);

    const handleCardClick = (ticket) => {
        setSelectedTicketId(ticket.ticketId);
        console.log(ticket.ticketId)
    };


    // Fetch order details from apiB when selectedTicketId changes
    useEffect(() => {
        if (selectedTicketId) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/order/getOrder/${selectedTicketId}`);
                    setOrderDetails(response.data.dtoList);
                } catch (err) {
                    console.error('Error fetching order details:', err);
                }
            };

            fetchOrderDetails();
        }
    }, [selectedTicketId]);


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
                                        {tickets.map(ticket => (
                                            <div className="nav-link" id="v-pills-ticket2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket2" type="button" role="tab" aria-controls="v-pills-ticket2" aria-selected="true">
                                                <div className="order-card" key={ticket.ticketId} onClick={() => handleCardClick(ticket)}>
                                                    <div className="left-part">
                                                        <h3 className="title">{ticket.inviceStatus}</h3>
                                                        <p className="sub-title text-warning-emphasis">
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
                            <div className="col-7">
                                <div className="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                                    {/* <!-- tab one  --> */}
                                    <div className="tab-pane fade show active" id="v-pills-ticket1" role="tabpanel" aria-labelledby="v-pills-ticket1-tab" tabindex="0">
                                        <div className="order-cards-details-wrapper-main">
                                            {/* <!-- ticket details ends here --> */}
                                            <div className="accordion status-wrappers" id="accordionExample">

                                                <div className="accordion-item payment">
                                                    <h2 className="accordion-header">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="#collapseTwo">
                                                            <span>Payment Details</span>
                                                            <span className="status-icon pending">
                                                                <i className="fa-solid fa-hourglass-end"></i>
                                                                <i className="fa-solid fa-check"></i>
                                                            </span>
                                                        </button>
                                                    </h2>
                                                    <div id="collapseTwo" className="accordion-button collapsed" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <p className="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                                            <div className="btns-group d-flex gap-3 justify-content-center mt-4">
                                                                <a href="#" className="btn btn-primary">Check Status</a>
                                                                <a href="#" className="btn btn-warning">Send Invoice</a>
                                                                <a href="#" className="btn btn-success">Mark As Paid</a>
                                                                <a href="#" className="btn btn-danger">Mark As Hold</a>
                                                            </div>
                                                            <div className="form-hold p-3">
                                                                <form action="">
                                                                    <div className="form-group mb-3">
                                                                        <label className="form-label" htmlFor="holdReason">Define Reason</label>
                                                                        <textarea name="holdReason" id="holdReason" cols="20" rows="5" className="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                                                    </div>
                                                                    <a href="#" className="btn btn-danger">Hold Now</a>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <TrackPackage />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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