import React, { useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import funnel from "highcharts/modules/funnel";
import { Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Initialize the funnel module
funnel(Highcharts);

const TicketHouse = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Funnel chart options
    const funnelOptions = {
        chart: {
            type: "funnel"
        },
        title: {
            text: ""
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: "{point.name}: {point.y}"
                },
                neckWidth: "30%",
                neckHeight: "25%"
            }
        },
        series: [
            {
                name: "Conversion",
                data: [
                    ["Qualification", 71],
                    ["Nurturing", 26],
                    ["Handoff to Sales", 14],
                    ["Awaiting Sale", 5],
                    ["Qualification", 3],
                    ["Presentation", 0],
                    ["Proposal", 0],
                    ["Contracting", 2],
                    ["Closed Won", 5]
                ]
            }
        ]
    };

    // Pie chart options
    const pieOptions = {
        chart: {
            type: "pie"
        },
        title: {
            text: "Lead Distribution"
        },
        series: [
            {
                name: "Leads",
                colorByPoint: true,
                data: [
                    { name: "New", y: 40 },
                    { name: "Contacted", y: 30 },
                    { name: "Qualified", y: 20 },
                    { name: "Unqualified", y: 10 }
                ]
            }
        ]
    };

    // Bar chart options
    const barOptions = {
        chart: {
            type: "bar"
        },
        title: {
            text: "Sales Stages"
        },
        xAxis: {
            categories: ["Qualification", "Nurturing", "Proposal", "Contracting", "Closed"]
        },
        yAxis: {
            min: 0,
            title: {
                text: "Number of Deals"
            }
        },
        series: [
            {
                name: "Deals",
                data: [71, 26, 14, 5, 2]
            }
        ]
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
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

            <Row>
                <Col md={4} className="mb-4">
                    <h6>Funnel Chart</h6>
                    <HighchartsReact highcharts={Highcharts} options={funnelOptions} />
                </Col>
                <Col md={4} className="mb-4">
                    <h6>Pie Chart</h6>
                    <HighchartsReact highcharts={Highcharts} options={pieOptions} />
                </Col>
                <Col md={4} className="mb-4">
                    <h6>Bar Chart</h6>
                    <HighchartsReact highcharts={Highcharts} options={barOptions} />
                </Col>
            </Row>

            <div className="legend mt-4">
                <div>
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
        </div>
    );
};

export default TicketHouse;
