import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function AssignTktReport() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reportData, setReportData] = useState({});
    const [data, setData] = useState([]);


    useEffect(() => {
        axiosInstance.get('/third_party_api/ticket/getTodayStatusReport')
            .then(response => {
                // Set the fetched data to the state
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);


    useEffect(() => {
        // Set default dates when the component mounts
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const formattedToday = today.toISOString().split('T')[0];
        const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0];

        setToDate(formattedToday);
        setFromDate(formattedThirtyDaysAgo);
    }, []);

    const handleFilterChange = () => {
        const requestData = {
            startDate: fromDate,
            endDate: toDate
        };

        axiosInstance.post('/third_party_api/ticket/getStatusReport', requestData)
            .then((response) => {
                console.log('API Response:', response);
                setReportData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching the report:', error);
                setReportData({});
            });
    };

    return (
        <div>
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">Today Assign Report</h3>
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="card-container">
                                    {/* Ensure the data is an array and render cards */}
                                    {data && Array.isArray(data) && data.length > 0 ? (
                                        data.map(item => (
                                            <div className="card" key={item.id}> {/* Ensure 'id' is unique in the data */}
                                                <h2>{item.title}</h2>
                                                <p>{item.description}</p>
                                                <img src={item.imageUrl} alt={item.title} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-center'>No data available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
                                        id="from-date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                To
                                <div className="col-sm-4 mx-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="to-date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-auto">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleFilterChange}
                                    >
                                        Apply Filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filtered data display */}
                        <div className="container">
                            {Object.entries(reportData).length > 0 ? (
                                Object.entries(reportData).map(([name, data], index) => (
                                    <div key={index}>
                                        <div className="row" style={{ backgroundColor: 'yellow' }}>
                                            <div className="col-sm border p-3 success" >
                                                <strong>{name}</strong>
                                            </div>
                                            <div className="col-md border p-3">
                                                <strong>Live</strong>
                                            </div>
                                            <div className="col-lg border p-3">
                                                <strong>ABC</strong>
                                            </div>
                                        </div>

                                        {/* Check if 'Live' and 'Abc' exist in data */}
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>Sales</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.Sale : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.Sale : 'N/A'}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>New</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.New : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.New : 'N/A'}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>Not Interested</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.NotInterested : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.NotInterested : 'N/A'}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>Follow</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.Follow : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.Follow : 'N/A'}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>Not Pickup</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.NotPickup : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.NotPickup : 'N/A'}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>Place with other</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.PlaceWithOther : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.PlaceWithOther : 'N/A'}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm border p-3"><strong>Wrong Number</strong></div>
                                            <div className="col-md border p-3">{data.Live ? data.Live.WrongNumber : 'N/A'}</div>
                                            <div className="col-lg border p-3">{data.Abc ? data.Abc.WrongNumber : 'N/A'}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center'>No data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AssignTktReport;
