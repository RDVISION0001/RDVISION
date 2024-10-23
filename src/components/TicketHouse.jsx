import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import funnel from "highcharts/modules/funnel";
import { Row, Col, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";

// Initialize the funnel module
funnel(Highcharts);

const TicketHouse = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [ticketData, setTicketData] = useState([])
    const [ticketDataByCountry, setTicketDataByCountry] = useState([])

    // for sales with country line chart
    const [countryList, setCpuntryList] = useState([])
    const [saleCount, setSaleCount] = useState([])

    useEffect(() => {
        fetchTicketDataByStatus()
        fetchTicketCountsByCountry()
        fetchSlaesByCountry()
    }, [])

    const fetchTicketDataByStatus = async () => {
        const response = await axiosInstance.get('/third_party_api/ticket/ticketswithstatus')
        setTicketData(response.data.ticketCounts)
    }

    const fetchTicketCountsByCountry = async () => {
        const response = await axiosInstance.get("/third_party_api/ticket/ticketsCountByCountry")
        setTicketDataByCountry(response.data)
    }

    const fetchSlaesByCountry = async () => {
        const response = await axiosInstance.get('/third_party_api/ticket/salesByCountry')
        const result = response.data;

        // Assuming the response is an array of arrays like [["US", 30], ["MY", 1], ...]
        const countriesList = result.map(item => item[0]); // Extract the first element from each subarray (countries)
        const dataList = result.map(item => item[1]); // Extract the second element from each subarray (data counts)

        setCpuntryList(countriesList);
        setSaleCount(dataList);
    }

    const funnelData = ticketData.map(ticket => {
        const key = Object.keys(ticket)[0]; // Get the first key
        const value = ticket[key]; // Get the corresponding value
        return {
            name: key,
            y: value
        };
    }).filter(item => item.y > 0);
    // Funnel chart options
    const funnelOptions = {
        chart: {
            type: "funnel"
        },
        title: {
            text: "Tickets Status"
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.y}"
                },
                neckWidth: "40%",
                neckHeight: "25%"
            }
        },
        series: [
            {
                name: "Tickets",
                data: funnelData
            }
        ]
    };

    // Pie chart options
    const pieOptions = {
        chart: {
            type: "pie"
        },
        title: {
            text: "Tickets By Country"
        },
        series: [
            {
                name: "Leads",
                colorByPoint: true,
                data: ticketDataByCountry
            }
        ]
    };

    // Bar chart options
    const barOptions = {
        chart: {
            type: "bar"
        },
        title: {
            text: "Sales by Country"
        },
        xAxis: {
            categories: countryList
        },
        yAxis: {
            min: 0,
            title: {
                text: "Number of Sales"
            }
        },
        series: [
            {
                name: "converted Leadds",
                data: saleCount
            }
        ]
    };

    return (
        <Container fluid className="p-0" style={{ height: "100vh", overflow: "hidden" }}>
            <div className="d-flex justify-content-between align-items-center p-3 bg-light">
                <h5>Current month lead conversion rate</h5>
                <div className="d-flex">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start date"
                    />{" "}
                    till{" "}
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="Due date"
                    />
                </div>
            </div>

            <Row className="h-100">
                {/* First Column with Funnel Chart */}
                <Col lg={6} md={6} sm={12} className="d-flex flex-column p-3">
                    <div>
                        <h6>Funnel Chart</h6>
                        <div style={{ flex: 1 }}>
                            <HighchartsReact highcharts={Highcharts} options={funnelOptions} />
                        </div>
                    </div>

                    <div className="container mt-3" style={{ marginTop: "100px" }}>
                        <div className="row">
                            {/* # of lost leads */}
                            <div className="col-md-6 mb-4">
                                <div className="p-3 border border-warning text-center" style={{ borderRadius: '8px', backgroundColor: '#fff8e1' }}>
                                    <h6 style={{ color: '#ff6f00' }}># of lost leads</h6>
                                    <h3>2</h3>
                                </div>
                            </div>

                            {/* Lost leads budget */}
                            <div className="col-md-6 mb-4">
                                <div className="p-3 border border-warning text-center" style={{ borderRadius: '8px', backgroundColor: '#fff8e1' }}>
                                    <h6 style={{ color: '#ff6f00' }}>Lost leads budget</h6>
                                    <h3>$ 14,400.00</h3>
                                </div>
                            </div>

                            {/* Average leads budget */}
                            <div className="col-md-6 mb-4">
                                <div className="p-3 border border-success text-center" style={{ borderRadius: '8px', backgroundColor: '#e8f5e9' }}>
                                    <h6 style={{ color: '#43a047' }}>Average leads budget</h6>
                                    <h3>$ 3,315.85</h3>
                                </div>
                            </div>

                            {/* Current month average leads budget */}
                            <div className="col-md-6 mb-4">
                                <div className="p-3 border border-success text-center" style={{ borderRadius: '8px', backgroundColor: '#e8f5e9' }}>
                                    <h6 style={{ color: '#43a047' }}>Current month average leads budget</h6>
                                    <h3>$ 15,740.90</h3>
                                </div>
                            </div>
                            {/* Average leads budget */}
                            <div className="col-md-6 mb-4">
                                <div className="p-3 border border-success text-center" style={{ borderRadius: '8px', backgroundColor: '#e8f5e9' }}>
                                    <h6 style={{ color: '#43a047' }}>Average leads budget</h6>
                                    <h3>$ 3,315.85</h3>
                                </div>
                            </div>

                            {/* Current month average leads budget */}
                            <div className="col-md-6 mb-4">
                                <div className="p-3 border border-success text-center" style={{ borderRadius: '8px', backgroundColor: '#e8f5e9' }}>
                                    <h6 style={{ color: '#43a047' }}>Current month average leads budget</h6>
                                    <h3>$ 15,740.90</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                </Col>

                {/* Second Column with Pie Chart and Bar Chart */}
                <Col lg={6} md={6} sm={12} className="d-flex flex-column p-3">
                    <h6>Pie Chart</h6>
                    <div style={{ flex: 1 }}>
                        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
                    </div>
                    <h6>Bar Chart</h6>
                    <div style={{ flex: 1 }}>
                        <HighchartsReact highcharts={Highcharts} options={barOptions} />
                    </div>
                </Col>
            </Row>

            <div className="legend p-3 d-flex justify-content-center bg-light">
                <div className="mr-4">
                    <span
                        style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#00A1E0",
                            marginRight: "5px"
                        }}
                    ></span>
                    Lead
                </div>
                <div>
                    <span
                        style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#28A745",
                            marginRight: "5px"
                        }}
                    ></span>
                    Opportunity
                </div>
            </div>
        </Container>
    );
};

export default TicketHouse;
