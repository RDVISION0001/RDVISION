import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function AssignTktReport() {

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const [fromDate, setFromDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);
    const [reportData, setReportData] = useState({});
    const [expandedNode, setExpandedNode] = useState(null);

    const colors = {
        'New': '#5DA3FA',            // Soft Blue
        'Sale': '#53BF9D',           // Soft Green
        'Follow': '#5DA3FA',         // Soft Blue
        'Interested': '#F6A641',     // Muted Orange
        'Not_Interested': '#F55C47', // Soft Red
        'Wrong_Number': '#D3D3D3',   // Light Gray
        'Not_Pickup': '#B4C6E7',     // Light Blue
        'hang_up': '#FFD580'         // Soft Yellow
    };

    const handleFilterChange = () => {
        const requestData = {
            startDate: fromDate,
            endDate: toDate
        };

        axiosInstance.post('/third_party_api/ticket/getStatusReport', requestData)
            .then((response) => {
                setReportData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching the report:', error);
                setReportData({});
            });
    };

    const toggleNode = (name) => {
        setExpandedNode((prev) => (prev === name ? null : name));
    };
    useEffect(() => {

        handleFilterChange()
    }, [toDate, fromDate]);
    return (
        <div>
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="title mb-0">Assign Ticket Report</h3>
                            <div className="d-flex">
                                <div className="col-sm-4">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                To
                                <div className="col-sm-4 mx-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={handleFilterChange}>
                                    Apply Filter
                                </button>
                            </div>
                        </div>

                        <div className="container">
                            {Object.entries(reportData).length > 0 ? (
                                Object.entries(reportData).map(([name, data], index) => (
                                    <div key={index} className="tree-node">
                                        <div
                                            className="tree-header"
                                            onClick={() => toggleNode(name)}
                                        >
                                            <strong>{name}</strong> {expandedNode === name ? '-' : '+'}
                                        </div>
                                        <div className={`tree-children ${expandedNode === name ? 'open' : ''}`}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Status</th>
                                                        <th>Live</th>
                                                        <th>ABC</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        'Sale',
                                                        'New',
                                                        'Not_Interested',
                                                        'Follow',
                                                        'Not_Pickup',
                                                        'Place_with_other',
                                                        'Wrong_Number',
                                                        'Interested',
                                                        'hang_up',
                                                    ].map((status, i) => {
                                                        const liveValue = data.Live?.[status] || 0;
                                                        const abcValue = data.Abc?.[status] || 0;
                                                        const totalValue = liveValue + abcValue;
                                                        return (
                                                            <tr
                                                                key={i}
                                                                style={{
                                                                    backgroundColor: colors[status] || 'white',
                                                                }}
                                                            >
                                                                <td>{status}</td>
                                                                <td>{liveValue}</td>
                                                                <td>{abcValue}</td>
                                                                <td>{totalValue}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th>Total Assigned</th>
                                                        <th>
                                                            {Object.values(data.Live || {}).reduce((sum, val) => sum + (val || 0), 0)}
                                                        </th>
                                                        <th>
                                                            {Object.values(data.Abc || {}).reduce((sum, val) => sum + (val || 0), 0)}
                                                        </th>
                                                        <th>
                                                            {Object.values(data.Live || {}).reduce((sum, val) => sum + (val || 0), 0) +
                                                                Object.values(data.Abc || {}).reduce((sum, val) => sum + (val || 0), 0)}
                                                        </th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center">No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AssignTktReport;
