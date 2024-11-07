import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function ActionMode() {
    const [ticket, setTicket] = useState(null); // Holds the current ticket
    const [loading, setLoading] = useState(true); // To track loading state

    // Function to fetch the next ticket
    const fetchNextTicket = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/third_party_api/ticket/next/302');
            setTicket(response.data); // Assuming the response contains a single ticket
        } catch (error) {
            console.error("Error fetching next ticket:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch the previous ticket
    const fetchPreviousTicket = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/third_party_api/ticket/previous/302');
            setTicket(response.data); // Assuming the response contains a single ticket
        } catch (error) {
            console.error("Error fetching previous ticket:", error);
        } finally {
            setLoading(false);
        }
    };

    // Call next API by default on mount
    useEffect(() => {
        fetchNextTicket();
    }, []);



    return (
        <section className="followup-table-section py-3">
            <div className="container-fluid">
                <div className="d-flex justify-content-center">
                    <div
                        className="card shadow border"
                        style={{ width: "80rem", height: "auto" }}
                    >
                        <div className="card-body">
                            {loading ? (
                                <p>Loading ticket...</p>
                            ) : ticket ? (
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="card-text"><strong>Name: </strong> {ticket.senderName}</p>
                                        <p className="card-text"><strong>Mobile: </strong> {ticket.senderMobile}</p>
                                        <p className="card-text"><strong>Eamil: </strong> {ticket.senderEmail}</p>
                                        <p className="card-text"><strong>Country: </strong> {ticket.senderEmail}</p>


                                    </div>
                                    <div className="col-md-6">
                                    <p className="card-text"><strong>Ticket Id: </strong>{ticket.uniqueQueryId}</p>
                                        <p className="card-text"><strong>Date: </strong>{ticket.queryTime}</p>
                                        <p className="card-text"><strong>Status: </strong>{ticket.ticketstatus}</p>
                                        <p className="card-text"><strong>Requirement: </strong>{ticket.subject}</p>

                                    </div>
                                </div>
                            ) : (
                                <p>No ticket data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={fetchPreviousTicket}
                        disabled={loading}
                    >
                        Prev
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={fetchNextTicket}
                        disabled={loading}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ActionMode;
