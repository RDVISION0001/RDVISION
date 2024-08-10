import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

// Authentication context
import { useAuth } from '../auth/AuthContext';

const Cardinfo = () => {
    const { userId } = useAuth();
    const [data, setData] = useState({
        totalTickets: 0,
        totalSale: 0,
        totalNew: 0,
        totalFollow: 0,
    });

    useEffect(() => {


        //total tickets
        const TotalTickets = async () => {
            try {
                const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
                    params: {}
                });
                const totalTickets = response.data.totalElement;
                setData(prevData => ({ ...prevData, totalTickets }));
            } catch (error) {
                console.error('Error fetching total tickets:', error);
            }
        };


        //total sale tickets
        const TotalSale = async () => {
            try {
                const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
                    params: { ticketStatus: 'Sale' }
                });
                const totalSale = response.data.totalElement;
                setData(prevData => ({ ...prevData, totalSale }));
            } catch (error) {
                console.error('Error fetching in negotiation:', error);
            }
        };


        //total new tickets
        const TotalNew = async () => {
            try {
                const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
                    params: { ticketStatus: 'New' }
                });
                const totalNew = response.data.totalElement;
                setData(prevData => ({ ...prevData, totalNew }));
            } catch (error) {
                console.error('Error fetching in negotiation:', error);
            }
        };


        //total sale tickets
        const TotalFollow = async () => {
            try {
                const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
                    params: { ticketStatus: 'Follow' }
                });
                const totalFollow = response.data.totalElement;
                setData(prevData => ({ ...prevData, totalFollow }));
            } catch (error) {
                console.error('Error fetching in negotiation:', error);
            }
        };


        TotalTickets();
        TotalSale();
        TotalNew();
        TotalFollow();
    }, []);

    return (
        <>
            <section className="sadmin-top-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="div-top">
                                    <h3 className="title">Total Tickets</h3>
                                    <span className="sales">
                                        {data.totalTickets}<span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
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
                        <div className="col-md-3">
                            <div className="card">
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
                        <div className="col-md-3">
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
        </>
    );
};

export default Cardinfo;
