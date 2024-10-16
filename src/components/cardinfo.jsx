import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cardinfo = () => {
    const { userId } = useAuth();
    const [data, setData] = useState({
        totalTickets: 0,
        totalSale: 0,
        totalNew: 0,
        totalFollow: 0,
    });
    const [showDetails, setShowDetails] = useState(false); // State to toggle the details box
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalTicketsResponse = await axiosInstance.get('/third_party_api/ticket/ticketByStatus');
                const totalTickets = totalTicketsResponse.data.totalElement;

                const totalSaleResponse = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', { params: { ticketStatus: 'Sale' } });
                const totalSale = totalSaleResponse.data.totalElement;

                const totalNewResponse = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', { params: { ticketStatus: 'New' } });
                const totalNew = totalNewResponse.data.totalElement;

                const totalFollowResponse = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', { params: { ticketStatus: 'Follow' } });
                const totalFollow = totalFollowResponse.data.totalElement;

                setData({ totalTickets, totalSale, totalNew, totalFollow });
            } catch (error) {
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchData();
    }, []);
const nevigateToNegotiation =()=>{
    navigate("/in_negotiation")
}


    return (
        <section className="sadmin-top-section">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="card position-relative">
                            <div className="div-top">
                                <h3 className="title">Total Tickets</h3>
                                <span className="sales">
                                    {data.totalTickets}<span className="indicators"></span>
                                </span>
                            </div>
                            <div className="d-flex justify-content-center flex-column align-items-center">
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet " style={{ cursor: "Pointer" }} onClick={() => setShowDetails(!showDetails)}></i>
                                </div>
                                {/* <i
                                    className="fa-solid fa-eye cursor-pointer text-blue-500 mt-1 text-xl"
                                    onClick={() => setShowDetails(!showDetails)} // Toggle the details box
                                ></i> */}
                            </div>
                            <div
                                className={`details-box position-absolute bg-white border rounded p-3 shadow transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0 invisible'
                                    }`}
                                style={{ top: '100%', left: '0', width: '100%' }}
                            >
                                <p className="text-gray-800">Total Follow-ups: {data.totalFollow}</p>
                                <p className="text-gray-800">Total New: {data.totalNew}</p>
                                <p className="text-gray-800">Total Sale: {data.totalSale}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card">
                            <div className="div-top">
                                <h3 className="title">Total Sale</h3>
                                <span className="sales">
                                    {data.totalSale}<span className="indicators"></span>
                                </span>
                            </div>
                            <div className="icon-wrapper">
                                <i className="fa-solid fa-wallet"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 d-flex justify-content-between align-items-center">
                        <div className="card d-flex justify-content-between w-100">
                            <div className="div-top">
                                <h3 className="title">Total New</h3>
                                <span className="sales">
                                    {data.totalNew}<span className="indicators"></span>
                                </span>
                            </div>
                            <div className="icon-wrapper">
                                <i className="fa-solid fa-wallet"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3" style={{cursor:"Pointer"}} onClick={nevigateToNegotiation}>
                        <div className="card">
                            <div className="div-top">
                                <h3 className="title">Total Follow-up</h3>
                                <span className="sales">
                                    {data.totalFollow}<span className="indicators"></span>
                                </span>
                            </div>
                            <div className="icon-wrapper">
                                <i className="fa-solid fa-wallet"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cardinfo;