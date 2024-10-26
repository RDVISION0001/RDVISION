import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';

function Paid() {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        // Fetch invoices from the API
        axiosInstance.get('/invoice/getinvoices')
            .then(response => {
                setInvoices(response.data); // Assuming response data is an array of invoices
            })
            .catch(error => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    return (
        <>
            <section className="sadmin-top-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="d-flex justify-content-around">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="shadow p-3 mb-5 bg-white rounded"
                                    style={{
                                        height: "120px",
                                        width: "260px",
                                        marginTop: "30px",
                                        marginBottom: "30px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <div className="card-body">
                                        <p>All Invoice <span>(70)</span></p>
                                        <h4>$23,642.00</h4>
                                        <p>Last week <span>5.90%</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">Invoice Table</h3>
                        <div className="bg-white" style={{ marginRight: "15px", marginLeft: "15px" }}>
                            <div className="followups-table table-responsive table-height">
                                <table className="table table-borderless table-hover">
                                    <thead className="text-dark" style={{ backgroundColor: 'gray' }}>
                                        <tr>
                                            <th scope="col" className="text-center">
                                                <input type="checkbox" />
                                            </th>
                                            <th scope="col">Invoice ID</th>
                                            <th scope="col">Ticket ID</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Issue Date</th>
                                            <th scope="col">Delivery Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr className="border" key={invoice.inviceId}>
                                                <td className="text-center">
                                                    <input type="checkbox" />
                                                </td>
                                                <td>{invoice.inviceId}</td>
                                                <td>{invoice.ticketId}</td>
                                                <td>{invoice.inviceStatus}</td>
                                                <td>{invoice.totalAmount}</td>
                                                <td>{invoice.createDate ? invoice.createDate.join('-') : 'N/A'}</td>
                                                <td>{invoice.deliveryStatus || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Paid;
