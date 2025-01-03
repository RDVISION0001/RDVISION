import React, { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';

const CloserSalesReport = (props) => {
    const [invoices, setInvoices] = useState([]);
    const { userId } = useAuth()
    const [currentSrc, setCurrentSrc] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
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
        fetchTicketSaleData();
    }, []);

    const fetchTicketSaleData = async () => {
        const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
            user: localStorage.getItem("roleName") === "Closer" ? localStorage.getItem("userId") : 0,
            stage: 3,
        });
        setSaleTicketData(response.data);
    };

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

    useEffect(() => {
        fetchInvoices();
    }, [props.stage]);

    const fetchInvoices = async () => {
        try {
            const response = await axiosInstance.get(`/invoice/getAssInvoice/${userId}`);
            setInvoices(response.data);
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

    const handleClickCallForticket = async (ticketId) => {
        try {
            const response = await axiosInstance.get(`${ticketId.length < 15 ? "/third_party_api/ticket/" : "/upload/"}clickToCall/${ticketId}`);
        } catch (error) {
            console.error("Error calling ticket:", error);
        }
    };

    const playRecording = useCallback((src, index) => {
        setSelectedIndex(index);
        let newUrl = `https:${src.split(":")[2].split("}")[0]}`;
        newUrl = newUrl.split(`"`)[0];

        if (currentSrc !== newUrl) {
            if (audioRef.current) {
                audioRef.current.pause();
            }

            audioRef.current.src = newUrl;
            setCurrentSrc(newUrl);
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(err => console.error("Error playing audio:", err));
        } else {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(err => console.error("Error resuming audio:", err));
            }
        }
    }, [currentSrc, isPlaying]);

    if (loading) return <p className='text-center'>Loading...</p>;
    if (error) return <p>{error}</p>;

    const setFormate = (date) => {
        let newdate = date && (JSON.stringify(date).split("[")[1]).split("]")[0];
        return newdate && `${newdate.split(",")[2]}-${convertNumberToStringMonth(newdate.split(",")[1])}-${newdate.split(",")[0]}`;
    };

    return (
        <>
            <section className="data-table-bgs_02x24 py-3">
                <div className="container-fluid">
                    <div className="table-wrapper">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Delivery Status</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Street Address</th>
                                        <th scope="col">City</th>
                                        <th scope="col">State</th>
                                        <th scope="col">Zip Code</th>
                                        <th scope="col">Country</th>
                                        <th scope="col" className='text-center'>Product Details  </th>
                                        <th scope="col">Doses</th>
                                        <th scope="col">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="overflow">
                                    {invoices.length > 0 ? (
                                        invoices.map((invoice, index) => (
                                            <tr className="border" key={index}>
                                                <td className="text-center">
                                                    {invoice.saleDate && `${invoice.saleDate[2]}-${convertNumberToStringMonth(invoice.saleDate[1])}-${invoice.saleDate[0]}`}
                                                </td>
                                                <td className="text-center">{invoice.deliveryStatus || "N/A"}</td>
                                                <td className="text-center">{invoice.customerName}</td>
                                                <td className="text-center">{invoice.address?.landmark || "N/A"}</td>
                                                <td className="text-center">{invoice.address?.city || "N/A"}</td>
                                                <td className="text-center">{invoice.address?.state || "N/A"}</td>
                                                <td className="text-center">{invoice.address?.zipCode || "N/A"}</td>
                                                <td className="text-center">
                                                    <img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}
                                                </td>
                                                <td className="text-center">
                                                    <div className="product-details">
                                                        <table className="table table-sm table-bordered table-striped table-hover">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th scope="col">Name</th>
                                                                    <th scope="col" className="text-center">Quantity</th>
                                                                    <th scope="col" className="text-center">Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {invoice.orderDto?.productOrders?.length > 0 ? (
                                                                    invoice.orderDto.productOrders.map((order, i) =>
                                                                        order.product?.map((product, index) => (
                                                                            <tr key={`${i}-${index}`}>
                                                                                <td>{product.name || "N/A"}</td>
                                                                                <td className="text-center">{order.quantity || "N/A"}</td>
                                                                                <td className="text-center">
                                                                                    {invoice.currency || "$"}{order.totalAmount || "0.00"}
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    )
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="3" className="text-center">No products found</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    {invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}
                                                </td>
                                                <td className="text-center">
                                                    {invoice.orderDto?.productOrders[0]?.quantity || "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="14" className="text-center">
                                                No invoices found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default CloserSalesReport;
