import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//// Auth ////
import { useAuth } from '../auth/AuthContext';

function QuotationBox(props) {
    const { userId } = useAuth();

    // State for modal visibility
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // State for tickets
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(props.ticketId);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [addressData, setAddressData] = useState({
        houseNumber: '',
        landmark: '',
        city: '',
        zipCode: '',
        state: '',
        country: '',
    });


    useEffect(() => {
        if (selectedTicketId) {
            const fetchTicketDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/${selectedTicketId.length < 15 ? "third_party_api/ticket" : "upload"}/getTicket/${selectedTicketId}`);
                    setTicketDetails(response.data.dtoList);
                } catch (err) {
                    console.error('Error fetching ticket details:', err);
                }
            };
            fetchTicketDetails();
        }
    }, [selectedTicketId]);


    // Form state for adding products
    const [formData, setFormData] = useState({
        quantity: '',
        selectedProductId: '',
        ticketId: '',
        userId: '',
        price: '0',
        currency: ''
    });

    const [selectedProductPrice, setSelectedProductPrice] = useState()

    useEffect(() => {
        fetchProductPrice()
    }, [formData.selectedProductId])


    const fetchProductPrice = async () => {
        if (formData.selectedProductId) {
            const response = await axiosInstance.get(`/product/getProduct/${formData.selectedProductId}`)
            setSelectedProductPrice(response.data.dtoList.price)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/order/addToOrder', {
                quantity: formData.quantity,
                productId: formData.selectedProductId,
                ticketId: selectedTicketId,
                userId: userId,
                price: formData.price,
                currency: formData.currency

            });
            toast.success('Add order successfully!');
            handleClose();
            fatchaddedproduct()
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add order');
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // State for products
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/product/getAllProducts');
                setProducts(response.data.dtoList);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchData();
    }, [selectedTicketId]);

    const [orderDetails, setOrderDetails] = useState(true);

    // Fetch order details from apiB when selectedTicketId changes
    useEffect(() => {
        fatchaddedproduct()
    }, []);

    const fatchaddedproduct = () => {
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
    }

    const [response, setResponse] = useState(null);
    const handleshipChange = (e) => {
        setAddressData({
            ...addressData,
            [e.target.name]: e.target.value
        });
    };

    // Function to handle sending invoice
    const handleSendInvoice = async () => {
        try {
            const response = await axiosInstance.post(`/invoice/send_quotation?ticketId=${selectedTicketId}`);
            toast.success('Invoice sent successfully!');
        } catch (error) {
            console.error('Error sending invoice:', error);
            toast.error('Failed to send invoice');
        }
    };
    const [isCollapsed, setIsCollapsed] = useState(false); // State to track collapse/expand

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed); // Toggle the collapse state
    };
    const handleDeleteProduct = async (productOrderId) => {
        const response = await axiosInstance.delete(`/order/deleteProductOrder/${productOrderId}`)
        if (response.data === "deleted") {
            document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-lg")
            document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-bounce")
            document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-xl")
            toast.success("Product Deleted")
            fatchaddedproduct()
            setTimeout(() => {
                document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-bounce")
                document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-xl")
                document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-bounce,fa-lg")

            }, 1000)
        }

    }



    return (
        <>
            <div className="">
                <div className="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                    {/* <!-- tab one  --> */}
                    <div className="tab-pane fade show active" id="v-pills-ticket1" role="tabpanel" aria-labelledby="v-pills-ticket1-tab" tabindex="0">
                        <div className="order-s-details-wrapper-main">
                            {ticketDetails ? (
                                <div className="order-details-">
                                    <div className="">
                                        <div className="content-wrapper d-flex justify-content-between">
                                            <div className='p-4 border rounded m-2'>
                                                <h5 className="-title text-center mb-4">Customer Detail</h5>
                                                <div className="user-info">
                                                    <div><strong>Name:</strong> {props.name}</div>
                                                    <div><strong>Ticket ID:</strong> {selectedTicketId}</div>
                                                    <div><strong>Email:</strong> {props.email}</div>
                                                    <div><strong>Mobile Number:</strong> {props.mobile}</div>
                                                </div>
                                            </div>
                                            <div className='border rounded p-4 m-2'>
                                                <h3 className="title">{ticketDetails.queryProductName}</h3>
                                                <div className="address-items mt-2">
                                                    <small>Billing Address</small>
                                                    <address>
                                                        {ticketDetails.senderAddress ? ticketDetails.senderAddress : "No address found"}
                                                    </address>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <p></p>
                            )}
                            {/* <!-- ticket details ends here --> */}
                            <div className="accordion status-wrappers" id="accordionExample">

                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                        <div className="">
                                            <div className="order-lists p-3">
                                                <div className="items-wrapper">
                                                    <div className="list-item header">
                                                        <p className="title"></p>
                                                        <p className="cost"></p>
                                                    </div>
                                                    {/* <div className="list-item otr-list">
                                                            <p className="item">TicketId: <span>{orderDetails.ticketId}</span></p>
                                                            <p className="item">Quantity : <span>{orderDetails.quantity}</span></p>
                                                            <p className="item">UserId: <span>{orderDetails.userId}</span></p>
                                                        </div> */}
                                                </div>
                                                {orderDetails && orderDetails.productOrders && orderDetails.productOrders.length > 0 ? <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Brand</th>
                                                            <th scope="col">Composition</th>
                                                            <th scope="col">Size</th>
                                                            <th scope="col">Pills Qty</th>
                                                            <th scope="col">Price</th>
                                                            <th scope='col'>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderDetails && orderDetails.productOrders.map((productOrder, index) => (
                                                            productOrder.product && productOrder.product[0] ? (
                                                                <tr key={productOrder.productorderId}> {/* Use unique id as key */}
                                                                    <td>{productOrder.product[0].name}</td>
                                                                    <td>{productOrder.product[0].brand}</td>
                                                                    <td>{productOrder.product[0].composition}</td>
                                                                    <td>{productOrder.product[0].packagingSize}</td>
                                                                    <td>{productOrder.product[0].pillsQty}</td>
                                                                    <td>{productOrder.totalAmount}</td>
                                                                    <td className='h-100 text-center'>
                                                                        <i
                                                                            onClick={() => handleDeleteProduct(productOrder.productorderId)}
                                                                            id={`deleteIcon-${productOrder.productorderId}`}
                                                                            className="fa-solid fa-trash fa-lg"
                                                                            style={{ color: "#ec2222", cursor: "pointer" }}
                                                                        ></i>
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                <tr key={index}>
                                                                    <td colSpan="7">Product details not available</td> {/* Ensure colSpan matches number of columns */}
                                                                </tr>
                                                            )
                                                        ))}
                                                    </tbody>
                                                </table> : <div className='d-flex justify-content-center'>No prduct Adedd</div>}
                                                {orderDetails && <div className="total d-flex justify-content-end">
                                                    <div className='d-flex'>
                                                        <p className='fw-semibold'>Total:- </p>
                                                        <p>$ {orderDetails.totalPayableAmount}</p>
                                                    </div>
                                                </div>}
                                                <div className="add-more-products-wrapper ">
                                                    <Button onClick={handleShow} data-bs-toggle="modal" data-bs-target="#addMoreItemsModal" className="btn btn-primary">Add Product</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- order items details ends here --> */}
                                <div className='d-flex justify-content-center '>
                                    <button onClick={handleSendInvoice} className='bg-primary mt-1'>Send Mail</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="addMoreItemsModal" tabindex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h1 className="modal-title fs-5 w-100 text-center" id="addMoreItemsLabel">Add Items</h1>
                            <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="#" onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label htmlFor="Varient" className="form-label">Product Name</label>
                                        <select
                                            name="selectedProductId"
                                            value={formData.selectedProductId}
                                            onChange={handleChange}
                                            id="varient"
                                            className="form-select">
                                            <option value="">Choose...</option>
                                            {products.map((productname) => (
                                                <option key={productname.productId} value={productname.productId}>{productname.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="Quantity" className="form-label">Quantity</label>
                                        <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} id="Quantity" className="form-control" placeholder="0" />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="price" className="form-label">Add Total Price</label>
                                        <input type="number" name="price" min="0" value={formData.price} onChange={handleChange} id="Quantity" className="form-control" placeholder="0" />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="currency" className="form-label">Currency</label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            id="currency"
                                            className="form-control"
                                        >
                                            <option value="" disabled>Select Currency</option>
                                            <option value="INR">INR - Indian Rupee</option>
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="AUD">AUD - Australian Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="JPY">JPY - Japanese Yen</option>
                                        </select>
                                    </div>
                                    <div className='w-100 d-flex justify-content-between p-4 text-primary'>
                                    </div>
                                    <div className="modal-footer justify-content-center border-0">
                                        <button type="button" onClick={handleClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" disabled={formData.price === "0" ? true : false} className="btn btn-primary">Add</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>

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
export default QuotationBox
