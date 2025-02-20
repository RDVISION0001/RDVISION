import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';  // Ensure toast is imported correctly if not already
import Swal from 'sweetalert2';
import AddressForm from '../components/AddressForm';
import { useAuth } from '../auth/AuthContext';

function SalesReport() {
    const [invoices, setInvoices] = useState([]);
    const { userId } = useAuth()
    const [view, setView] = useState(false); // For the Verify modal
    const [showCustomerModal, setShowCustomerModal] = useState(false); // For Customer Details modal
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // Store the selected invoice ID for verification
    const [addressFrom, setAddressForm] = useState(false)
    const handleCloseCustomerModal = () => setShowCustomerModal(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [nameEdit, setNameEdit] = useState(false)
    const [newName,setNewName]=useState("")
    const [oldName,setOldName]=useState("")
    const handleShowCustomerModal = (invoice) => {
        setSelectedCustomer({
            customerName: invoice.customerName,
            customerEmail: invoice.customerEmail,
            customerMobile: invoice.customerMobile,
            ticketId: invoice.orderDto?.ticketId || 'N/A',
        });
        setShowCustomerModal(true);
    };

    const [formValues, setFormValues] = useState({
        customerName: selectedCustomer?.customerName || '',
        customerEmail: selectedCustomer?.customerEmail || '',
        customerMobile: selectedCustomer?.customerMobile || ''
    });

    const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

    const [users, setUsers] = useState([]);  // State to hold user data
    const [selectedUser, setSelectedUser] = useState("");  // State to hold the selected user
    const [selectedUserForChangeCloser, setSelectedUserForChange] = useState(0)

    useEffect(() => {
        // Replace with your API endpoint
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/user/getAllUsers');
                console.log('API Response:', response);

                // Ensure dtoList exists and filter users based on roleId
                if (response.data && Array.isArray(response.data.dtoList)) {
                    const filteredUsers = response.data.dtoList.filter(user => user.roleId === 4);
                    setUsers(filteredUsers);  // Set filtered users data to state
                } else {
                    console.error('Error: No users found in the response');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    //change closer function 
    const updateCloserName = async () => {
        try {
            await axiosInstance.post('/invoice/updateCloserName', {
                userId: selectedUserForChangeCloser,
                invoiceId: selectedInvoiceIdForVerification
            })
            toast.success("Closer Updated")
        } catch (e) {
            toast.error("Some Error ...")
        }
    }


    useEffect(() => {
        // Call the API on component mount
        axiosInstance.get('/paymentwindow/getAll')
            .then((response) => {
                setOptions(response.data);  // Assuming the response data is an array
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching payment windows:', error);
                setLoading(false);
            });
    }, []);

    const [isPriceEditorOpen, setIsPriceEditorOpen] = useState(false)

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCustomerEditModelOpen, setIsCustomerEditModelOpen] = useState(false)



    const handleOpenPaymentModel = () => {
        setIsModalOpen(true)
        setFormData({
            id: paymnet && paymnet.id,
            paymentIntentId: paymnet && paymnet.paymentIntentId,
            amount: paymnet && paymnet.amount,
            currency: paymnet && paymnet.currency, // Default currency
            paymentWindow: paymnet && paymnet.paymentWindow,
            userId,
            ticketId: paymnet && paymnet.ticketId, // Added uniqueQueryId to the formData
        })
    }
    const [formData, setFormData] = useState({
        id: paymnet && paymnet.id,
        paymentIntentId: paymnet && paymnet.paymentIntentId,
        amount: paymnet && paymnet.amount,
        currency: paymnet && paymnet.currency, // Default currency
        paymentWindow: paymnet && paymnet.paymentWindow,
        userId,
        ticketId: paymnet && paymnet.ticketId, // Added uniqueQueryId to the formData
    });

    const handleInputChangeOfFromrData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


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

    const fetchAddewss = async (orderid) => {
        const response = await axiosInstance.get(`/address/getAddress/${orderid}`)
        setSelectedAddress(response.data.dto)
    }

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
            'Jan', 'Feb', 'March', 'April', 'May', 'June',
            'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Array of weekday names for easy formatting
        const weekdays = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ];

        const day = date.getDate().toString().padStart(2, '0');  // Add leading zero if day is single digit
        const month = months[date.getMonth()];  // Get the full month name
        const year = date.getFullYear();  // Get the year
        const weekday = weekdays[date.getDay()];  // Get the weekday name

        return ` ${day}-${month}-${year}`;
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

    const openModel = () => {

        setAddressForm(true)
    }
    const closeModal = async (id) => {
        fetchAddewss(id)
        setAddressForm(false)
    }

    const openPriceEditor = (product) => {
        setEditedData(product)
        setIsPriceEditorOpen(true)
    }

    const [editedData, setEditedData] = useState();
    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...editedData];
        updatedProducts[index][field] = value;
        setEditedData(updatedProducts);
    };

    const handleSubmit = async () => {

        try {
            const response = await axiosInstance.put("/product/updateProductOrders", editedData)
            setIsPriceEditorOpen(false)
            toast.success("Price and quantity updated")
            setEditedData(false);
        } catch (e) {
            toast.error("Some Error occurs ")
        }
        // Add your save logic here
    };

    const handleUpdatePayment = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put("/payment/update_payment", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setSelectedPaymnet(response.data);
            toast.success("Payment processed successfully!");
        } catch (error) {
            console.error("Error:", error.response || error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsModalOpen(false);
        }
    };

    const openCustomerEditModel = (ticket) => {
        setIsCustomerEditModelOpen(true)
        setFormValues({
            customerName: selectedCustomerName,
            customerMobile: selectedCustomerMObile,
            customerEmail: selectedCustomerEmal,
            uniqueQueryId: ticket
        })
    }

    const closeCustomerEditModel = () => {
        setIsCustomerEditModelOpen(false)

    }
    const handleCustomerEditSubmit = async (e) => {
        e.preventDefault();
        try {
            axiosInstance.put("/third_party_api/ticket/updateCustomer", formValues)
            toast.success("New Info Saved")
            setSelectedCustomerName(formValues.customerName)
            setSelectedCustomerEmail(formValues.customerEmail)
            setSelectedCustomerMobile(formValues.customerMobile)
            fetchVerificationList()
        } catch (e) {
            toast.error("Some Error Occures")
        }

        closeCustomerEditModel(); // Close modal after saving
    };
    const handleNameChange=async()=>{
      try{
        await axiosInstance.put("/product/updateProductName",{
            existingName:oldName,
            newName
        })
        toast.success("Name Changed")
        fetchVerificationList()
        setOldName("")
        setNewName("")
        handleCloses()
        setNameEdit(false)
      }catch(e){
        toast.error("Some Error")
      }
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
                                            <th className='text-center border border-dark px-2 ' scope="col">Closer Name</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Sale Date</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Tracking Number</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Payment Status</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Order ID</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Customer Name</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Street</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">City</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">State</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Zip Code</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Country</th>
                                            <th className='text-center border border-dark px-2 ' scope="col" >Product Details                                            </th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Doses</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Paid Amount</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Payment Windows</th>
                                            <th className='text-center border border-dark px-2 ' scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    {invoices.length > 0 ?
                                        <tbody>
                                            {invoices.slice().map((invoice) => (
                                                <tr className="border" key={invoice.invoiceId}>
                                                    <td className='text-center border border-dark px-2'> {invoice.closerName} </td>
                                                    <td className='text-center border border-dark px-2'>{formatDate(invoice.saleDate)}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.trackingNumber || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.paymentStatus || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.invoiceId || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.customerName}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleShowCustomerModal(invoice)} // Show customer details modal
                                                            className="btn btn-link p-0">....
                                                        </button>
                                                    </td>
                                                    <td className='text-center border border-dark px-2'>{invoice.address?.landmark || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.address?.city || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.address?.state || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>{invoice.address?.zipCode || "N/A"}</td>
                                                    <td className='text-center border border-dark px-2'>
                                                        <img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}
                                                    </td>
                                                    <td className='text-center border border-dark'>
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th className='text-center border border-dark px-3'>Name</th>
                                                                    <th className='text-center border border-dark px-3'>Quantity</th>
                                                                    <th className='text-center border border-dark px-3'>Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {invoice.orderDto.productOrders.map((order, i) =>
                                                                    order.product?.map((product, index) => (
                                                                        <tr key={`${i}-${index}`} className="table table-bordered">
                                                                            <td className="border border-dark px-2">{product.name}</td>
                                                                            <td className="border border-dark px-2">{order.quantity || 'N/A'}</td>
                                                                            <td className="border border-dark px-2">{invoice.currency}{order.totalAmount || 'N/A'}</td>
                                                                        </tr>
                                                                    ))
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td className='text-center border border-dark px-2'>
                                                        {invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}
                                                    </td>
                                                    <td className="text-success border border-dark px-2 bold-text">
                                                        {invoice.orderDto.productOrders[0].currency} {invoice.payment?.amount}
                                                    </td>
                                                    <td className='text-center border border-dark px-2'>{invoice.payment?.paymentWindow || 'N/A'}</td>
                                                    <td className='text-center border border-dark px-2'>
                                                        <button type="button" onClick={() => handleView(invoice.invoiceId, invoice.closerName, invoice.saleDate, invoice.orderDto.productOrders, invoice.customerMobile, invoice.customerEmail, invoice.customerName, invoice.orderAmount, invoice.address, invoice.payment)} className="btn btn-success">Verify</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody> : <div className='text-center'>No Invoices Pending For Verification</div>}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Details Modal */}
            <Modal show={showCustomerModal} onHide={handleCloseCustomerModal} centered>
                <div className="modal-header" style={{ backgroundColor: '#5f6368', color: '#fff', borderBottom: '2px solid #ccc' }}>
                    <h5 className="modal-title  text-center" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
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
                <div className="d-flex justify-content-between " style={{ fontSize: "20px" }}>
                    <div className="border p-2 flex-fill text-center">
                        Close By :- {selectedCloser} <span>
                            <select
                                id="userDropdown"
                                value={selectedUserForChangeCloser}
                                onChange={(e) => setSelectedUserForChange(e.target.value)}
                                style={{ backgroundColor: "white", color: "black", padding: "3px", margin: "2px" }}
                            >
                                <option value="">--Select a user--</option>
                                {users.map((user) => (
                                    <option key={user.userId} value={user.userId}>
                                        {user.firstName + " " + user.lastName}
                                    </option>
                                ))}
                            </select>

                            <button disabled={selectedUserForChangeCloser === 0} style={{ height: "30px", padding: "2px", margin: "2px", color: "white" }} onClick={updateCloserName}>update</button>
                        </span>
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
                                    <button onClick={() => openCustomerEditModel(selectedAddress.ticketId)} style={{ height: "25px", padding: "1px 5px", fontSize: "15px" }}>Edit</button>
                                </div>
                                {selectedAddress && <div>
                                    <div style={{ fontWeight: "bold" }}>Customer Shipping Address </div>
                                    <div>House Number:-{selectedAddress.houseNumber}</div>
                                    <div>Landmark:- {selectedAddress.landmark}</div>
                                    <div>City :- {selectedAddress.city}</div>
                                    <div>State :- {selectedAddress.state}</div>
                                    <div>Country :- {selectedAddress.country}</div>
                                    <div>Zip Code :- {selectedAddress.zipCode}</div>
                                    <button onClick={() => openModel(selectedAddress)} style={{ height: "25px", padding: "1px 5px", fontSize: "15px" }}>Edit</button>
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
                                            <th className='text-center' scope="col">Action</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPropductOrders && selectedPropductOrders.map((product, index) => (
                                            <tr key={index}>
                                                <td className='text-center'>
                                                    <img style={{ height: "50px" }} src={
                                                        `https://image.rdvision.in/images/getProductImage/${product.productId}`
                                                    } alt="Product Image" class="img-fluid" />

                                                </td>
                                                <td className='text-center'>
                                                    <div className='d-flex flex-column '>
                                                        <div> <span>{product.product[0].name}</span><i class="fa-solid fa-pen-to-square fa-lg" onClick={() => {
                                                            setNameEdit(!nameEdit)
                                                            setOldName(product.product[0].name)

                                                        }} style={{ marginLeft: "5px" }}></i></div>
                                                        {(nameEdit && product.product[0].name === oldName) && <div className='d-flex justify-content-between ' style={{paddingLeft:"10px"}}><input type='text' value={newName} onChange={(e)=>setNewName(e.target.value)} placeholder='Enter new name of product' style={{padding:"5px"}} className='bg-white text-black w-75 ' /><button style={{ width: "60px", padding: "2px" }} onClick={handleNameChange}>save</button></div>}
                                                    </div>


                                                </td>
                                                <td className='text-center'>{product.quantity}</td>
                                                <td className='text-center'>{product.currency} {product.totalAmount}</td>
                                                <td className='text-center text-primary' onClick={() => openPriceEditor(selectedPropductOrders)}>Edit</td>

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
                                        <div>Payment Windows :- <span className="text-green-600">{paymnet.paymentWindow}</span></div>
                                        <button onClick={handleOpenPaymentModel} style={{ height: "25px", padding: "1px 5px", fontSize: "15px" }}>Edit</button>

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

            <Modal show={addressFrom} onHide={fetchVerificationList} className="modal assign-ticket-modal fade " id="addMoreItemsModal" tabindex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">
                <div className='d-flex justify-content-center'>
                    <AddressForm ticketId={selectedAddress && selectedAddress.ticketId} close={() => closeModal(selectedAddress.ticketId)} address={selectedAddress} />
                </div>
                <div className="d-flex justify-content-end">
                    <button style={{ maxWidth: "70px" }} onClick={() => setAddressForm(false)}>close</button>
                </div>
            </Modal>
            <Modal
                show={isPriceEditorOpen}
                onHide={fetchVerificationList}
                className="modal assign-ticket-modal fade"
                id="addMoreItemsModal"
                tabIndex="-1"
                aria-labelledby="addMoreItemsLabel"
                aria-hidden="true"
            >
                <div className="modal-header">
                    <h5 className="modal-title" id="addMoreItemsLabel">Edit Quantity and Price</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setIsPriceEditorOpen(false)}
                    />
                </div>
                <div className="modal-body">
                    <form>
                        {editedData && editedData.map((item, index) => (
                            <div key={item.productorderId} className="mb-4">
                                <div className="mb-2">
                                    <strong>Product Name:</strong> {item.product[0]?.name}
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="me-2">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={item.quantity}
                                            onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Total Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={item.totalAmount}
                                            onChange={(e) => handleInputChange(index, "totalAmount", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
                <div className="modal-footer d-flex justify-content-end">
                    <button className="btn btn-secondary me-2" onClick={() => setIsPriceEditorOpen(false)}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Save Changes
                    </button>
                </div>
            </Modal>

            <Modal show={isModalOpen} onHide={fetchVerificationList} className="modal assign-ticket-modal fade " id="addMoreItemsModal" tabindex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">
                <div className='d-flex justify-content-center'>
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        id="addTicketModal"
                        tabIndex="-1"
                        aria-labelledby="addTicketModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-lg">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title" id="addTicketModalLabel">
                                        Mark as Paid
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close text-white"
                                        onClick={() => setIsModalOpen(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <form onSubmit={handleUpdatePayment}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="paymentIntentId" className="form-label">Transaction ID</label>
                                            <input
                                                type="text"
                                                id="paymentIntentId"
                                                className="form-control"
                                                name="paymentIntentId"
                                                value={formData.paymentIntentId}
                                                onChange={handleInputChangeOfFromrData}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="amount" className="form-label">Amount</label>
                                            <input
                                                type="text"
                                                id="amount"
                                                className="form-control"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChangeOfFromrData}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="paymentWindow" className="form-label">
                                                Payment Window
                                            </label>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                <select
                                                    id="paymentWindow"
                                                    name="paymentWindow"
                                                    className="form-control"
                                                    value={formData.paymentWindow}
                                                    onChange={handleInputChangeOfFromrData}
                                                    required
                                                >
                                                    <option value="">Select Payment Window</option>
                                                    {options.map((option) => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.paymentWindowName}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="currency" className="form-label">Currency</label>
                                            <select
                                                id="currency"
                                                className="form-select"
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleInputChangeOfFromrData}
                                                required
                                            >
                                                <option value="">Select Currency</option>
                                                <option value="INR">INR - Indian Rupee</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="GBP">GBP - British Pound</option>
                                                <option value="AUD">AUD - Australian Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="JPY">JPY - Japanese Yen</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Mark as Paid
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button style={{ maxWidth: "70px" }} onClick={() => setIsModalOpen(false)}>close</button>
                </div>
            </Modal>

            {/* //customer Edit modal */}

            <Modal show={isCustomerEditModelOpen} onHide={closeCustomerEditModel} centered>
                <form onSubmit={handleCustomerEditSubmit}>
                    <div className="modal-header" style={{ backgroundColor: '#5f6368', color: '#fff', borderBottom: '2px solid #ccc' }}>
                        <h5 className="modal-title  text-center" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                            Edit Customer Details
                        </h5>
                        <button type="button" className="close" onClick={closeCustomerEditModel} style={{ color: '#fff' }}>&times;</button>
                    </div>
                    <div className="modal-body" style={{ backgroundColor: '#f4f7fa', color: '#333' }}>

                        <div>
                            <div className="form-group">
                                <label htmlFor="customerName"><strong>Name:</strong></label>
                                <input
                                    type="text"
                                    id="customerName"
                                    className="form-control"
                                    value={formValues.customerName}
                                    onChange={(e) => setFormValues({ ...formValues, customerName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="customerEmail"><strong>Email:</strong></label>
                                <input
                                    type="email"
                                    id="customerEmail"
                                    className="form-control"
                                    value={formValues.customerEmail}
                                    onChange={(e) => setFormValues({ ...formValues, customerEmail: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="customerMobile"><strong>Mobile:</strong></label>
                                <input
                                    type="text"
                                    id="customerMobile"
                                    className="form-control"
                                    value={formValues.customerMobile}
                                    onChange={(e) => setFormValues({ ...formValues, customerMobile: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer justify-content-center" style={{ borderTop: '2px solid #ccc' }}>
                        <button type="button" className="btn btn-secondary" onClick={closeCustomerEditModel} style={{ fontWeight: 'bold' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ fontWeight: 'bold' }}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>


        </>
    );
}

export default SalesReport;

