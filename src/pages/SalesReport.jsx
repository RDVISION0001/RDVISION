import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';  // Ensure toast is imported correctly if not already
import Swal from 'sweetalert2';

function SalesReport() {
    const [invoices, setInvoices] = useState([]);
    const [view, setView] = useState(false); // For the Verify modal
    const [showCustomerModal, setShowCustomerModal] = useState(false); // For Customer Details modal
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // Store the selected invoice ID for verification

    const handleCloseCustomerModal = () => setShowCustomerModal(false);
    const handleShowCustomerModal = (invoice) => {
        setSelectedCustomer({
            customerName: invoice.customerName,
            customerEmail: invoice.customerEmail,
            customerMobile: invoice.customerMobile,
            ticketId: invoice.orderDto?.ticketId || 'N/A',
        });
        setShowCustomerModal(true);
    };
    //VerificationModel States 
    const [selectedInvoiceIdForVerification, setSelectedInvoiceforVerification] = useState("")
    const [selectedCloser, setSelectedCloser] = useState('')
    const [selectedtSaleDate, setSelectedSaleDtae] = useState('')
    const [selectedPropductOrders, setSelectedProductOrders] = useState()
    const [selectedCustomerName, setSelectedCustomerName] = useState("")
    const [selectedCustomerEmal, setSelectedCustomerEmail] = useState("")
    const [selectedCustomerMObile, setSelectedCustomerMobile] = useState("")
    const [selectedOrderAmount, setSelectedOrderAmount] = useState(0)
    const [selectedAddress, setSelectedAddress] = useState()
    const [paymnet, setSelectedPaymnet] = useState()


    const handleCloses = () => setView(false);
    const handleView = (invoiceId, closerName, saleDate, productOrders, cMobile, cEmail, Cname, orderAmount, address, payment) => {
        setSelectedInvoiceforVerification(invoiceId)
        setSelectedCloser(closerName)
        setSelectedSaleDtae(saleDate)
        setSelectedProductOrders(productOrders)
        setSelectedCustomerName(Cname)
        setSelectedCustomerEmail(cEmail)
        setSelectedCustomerMobile(cMobile)
        setSelectedInvoiceId(invoiceId); // Store the selected invoice ID
        setSelectedOrderAmount(orderAmount)
        setSelectedAddress(address)
        setSelectedPaymnet(payment)
        setView(true);
    };


    useEffect(() => {
        fetchVerificationList()
    }, []);


    const fetchVerificationList = async () => {
        await axiosInstance.get('/invoice/verificationList')
            .then((response) => {
                setInvoices(response.data);
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp);

        // Array of month names for easy formatting
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Array of weekday names for easy formatting
        const weekdays = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ];

        const day = date.getDate().toString().padStart(2, '0');  // Add leading zero if day is single digit
        const month = months[date.getMonth()];  // Get the full month name
        const year = date.getFullYear();  // Get the year
        const weekday = weekdays[date.getDay()];  // Get the weekday name

        return `${weekday}, ${day}-${month}-${year}`;
    };
    const handleVerify = () => {

        Swal.fire({
            title: "Have you checked all details?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Verified!"
        }).then((result) => {
            if (result.isConfirmed) {
                if (selectedInvoiceId) {
                    // Send the invoiceId as part of the URL
                    axiosInstance.get(`/invoice/setVerified/${selectedInvoiceId}`)
                        .then((response) => {
                            toast.success("Verified successfully");
                            console.log('Invoice verified:', response.data);
                            setView(false); // Close the modal after verification
                        })
                        .catch((error) => {
                            console.error('Error verifying invoice:', error);
                            toast.error("Failed to verify the invoice"); // Optional error notification
                        });
                }
            }
        });
        fetchVerificationList()
    };

    function formatDateFromArray(dateArray) {
        // Create a new Date object from the array (Note: month is zero-indexed)
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6]);
        
        // Define options for the formatting
        const options = {
            weekday: 'long', // "Monday"
            year: 'numeric', // "2024"
            month: 'long',   // "November"
            day: 'numeric',  // "3"
            hour: 'numeric', // "3"
            minute: '2-digit', // "30"
            hour12: true // 12-hour format (AM/PM)
        };
    
        // Format the date using `toLocaleString` with the options
        return date.toLocaleString('en-GB', options);
    }
    return (
        <>
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">Today Sales Report</h3>
                        <div className="bg-white mx-3">
                            <div className="followups-table table-responsive table-height">
                                <table className="table table-borderless table-hover">
                                    <thead className="text-dark" style={{ backgroundColor: 'gray' }}>
                                        <tr>
                                            <th scope="col">Closer Name</th>
                                            <th scope="col">Sale Date</th>
                                            <th scope="col">Customer Name</th>
                                            <th scope="col">Customer Order</th>
                                            <th scope="col">Invoice ID</th>
                                            <th scope="col">Ticket ID</th>
                                            <th scope="col">Issue Date</th>
                                            <th scope="col">Order Amount</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr className="border" key={invoice.invoiceId}>
                                                <td>
                                                    {invoice.closerName}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleShowCustomerModal(invoice)} // Show customer details modal
                                                        className="btn btn-link p-0">....
                                                    </button>
                                                </td>
                                                <td>{formatDate(invoice.saleDate)}</td>
                                                <td>{invoice.customerName}</td>
                                                <td>
                                                    {invoice.orderDto?.productOrders?.map(order =>
                                                        order.product?.map((p, index) => (
                                                            <div key={index}>{p.name}</div>
                                                        ))
                                                    )}
                                                    {(!invoice.orderDto?.productOrders || invoice.orderDto.productOrders.length === 0) && 'No Products Available'}
                                                </td>
                                                <td>{invoice.invoiceId}</td>
                                                <td>{invoice.orderDto?.ticketId || 'N/A'}</td>
                                                <td>{formatDate(invoice.date)}</td>
                                                <td className="text-success bold-text">
                                                    {invoice.currency || 'USD'} {invoice.orderAmount}
                                                </td>
                                                <td>
                                                    <button type="button" onClick={() => handleView(invoice.invoiceId, invoice.closerName, invoice.saleDate, invoice.orderDto.productOrders, invoice.customerMobile, invoice.customerEmail, invoice.customerName, invoice.orderAmount, invoice.address, invoice.payment)} className="btn btn-success">Verify</button>
                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Details Modal */}
            <Modal show={showCustomerModal} onHide={handleCloseCustomerModal} centered>
                <div className="modal-header" style={{ backgroundColor: '#5f6368', color: '#fff', borderBottom: '2px solid #ccc' }}>
                    <h5 className="modal-title w-100 text-center" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                        Customer Details
                    </h5>
                    <button type="button" className="close" onClick={handleCloseCustomerModal} style={{ color: '#fff' }}>&times;</button>
                </div>
                <div className="modal-body" style={{ backgroundColor: '#f4f7fa', color: '#333' }}>
                    {selectedCustomer ? (
                        <div>
                            <p><strong>Name:</strong> <span className="text-muted">{selectedCustomer.customerName}</span></p>
                            <p><strong>Email:</strong> <span className="text-muted">{selectedCustomer.customerEmail}</span></p>
                            <p><strong>Mobile:</strong> <span className="text-muted">{selectedCustomer.customerMobile}</span></p>
                            <p><strong>Ticket ID:</strong> <span className="text-muted">{selectedCustomer.ticketId}</span></p>
                        </div>
                    ) : (
                        <p className="text-info">Loading customer details...</p>
                    )}
                </div>
                <div className="modal-footer justify-content-center" style={{ borderTop: '2px solid #ccc' }}>
                    <button className="btn btn-secondary" onClick={handleCloseCustomerModal} style={{ fontWeight: 'bold' }}>
                        Close
                    </button>
                </div>
            </Modal>


            <Modal show={view} onHide={handleCloses} centered>
                <div className="d-flex justify-content-between w-100" style={{ fontSize: "20px" }}>
                    <div className="border p-2 flex-fill text-center">
                        Close By :- {selectedCloser}
                    </div>
                    <div className="border p-2 flex-fill text-center">
                        Close Date :- {formatDate(selectedtSaleDate)}
                    </div>
                    {selectedPropductOrders && <div className="border p-2 flex-fill text-center">
                        Total Amount :- <span className="text-blue-600">{selectedPropductOrders[0].currency} {selectedOrderAmount}</span>
                    </div>}
                </div>

                <div className="text-muted m-3">Invoice ID: {selectedInvoiceIdForVerification}</div>

                <Modal.Body>
                    <div className="d-flex flex-column ">
                        <div className="contact-info">
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>Customer Details </div>
                                    <div>Name:-{selectedCustomerName}</div>
                                    <div>Email:- {selectedCustomerEmal}</div>
                                    <div>Mobile :- {selectedCustomerMObile}</div>
                                </div>
                                {selectedAddress && <div>
                                    <div style={{ fontWeight: "bold" }}>Customer Shipping Address </div>
                                    <div>House Number:-{selectedAddress.houseNumber}</div>
                                    <div>Landmark:- {selectedAddress.landmark}</div>
                                    <div>City :- {selectedAddress.city}</div>
                                    <div>State :- {selectedAddress.state}</div>
                                    <div>Country :- {selectedAddress.country}</div>
                                    <div>Zip Code :- {selectedAddress.zipCode}</div>
                                </div>}
                            </div>
                            <div class="container mt-4">
                                <div>Order Details</div>
                                <table class="table table-striped table-bordered">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th className='text-center' scope="col">Image</th>
                                            <th className='text-center' scope="col">Product Name</th>
                                            <th className='text-center' scope="col">Quantity</th>
                                            <th className='text-center' scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPropductOrders && selectedPropductOrders.map((product, index) => (
                                            <tr key={index}>
                                                <td className='text-center'>
                                                    <img style={{ height: "50px" }} src={product.product[0].images[0]} alt="Product Image" class="img-fluid" />
                                                </td>
                                                <td className='text-center'>{product.product[0].name}</td>
                                                <td className='text-center'>{product.quantity}</td>
                                                <td className='text-center'>{product.currency} {product.totalAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {paymnet && <div className='m-3'>
                                    <div>Payment Information</div>
                                    <div>
                                        <div>Payment Date :- {formatDateFromArray(paymnet.paymentDate)}</div>
                                        <div>Payment Intent id :- {paymnet.paymentIntentId}</div>
                                        <div>Payment Status :- <span className="text-green-600">{paymnet.paymentStatus}</span></div>
                                        <div>Paid Amount :- <span className="text-green-600">{paymnet.currency} {paymnet.amount}</span></div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloses}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleVerify}>
                        Verify Invoice
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    );
}

export default SalesReport;
