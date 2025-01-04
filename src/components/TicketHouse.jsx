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
    }, [startDate])

    const fetchTicketDataByStatus = async () => {
        const response = await axiosInstance.get(`${startDate ? `/third_party_api/ticket/ticketswithstatus/${startDate}` : `/third_party_api/ticket/ticketswithstatus`}`)
        setTicketData(response.data.ticketCounts)
    }

    const fetchTicketCountsByCountry = async () => {
        const response = await axiosInstance.get(`${startDate ? `/third_party_api/ticket/ticketsCountByCountry/${startDate}` : `/third_party_api/ticket/ticketsCountByCountry`}`)
        setTicketDataByCountry(response.data)
    }

    const fetchSlaesByCountry = async () => {
        const response = await axiosInstance.get(`${startDate ? `/third_party_api/ticket/salesByCountry/${startDate}` : `/third_party_api/ticket/salesByCountry`}`)
        const result = response.data;


        const countriesList = result.map(item => item[0]);
        const dataList = result.map(item => item[1]);

        setCpuntryList(countriesList);
        setSaleCount(dataList);
    }
    function getColorForStatus(status) {
        const colorMap = {
            "totalTickets":"yellow",
          'New': '#FF5733',              // Custom color for 'New'
          'Not_Pickup': '#FFB533',       // Custom color for 'Not_Pickup'
          'Follow': '#FFC300',           // Custom color for 'Follow'
          'Place_with_other': '#33FF57', // Custom color for 'Place_with_other'
          'Not_Interested': '#FF33A6',   // Custom color for 'Not_Interested'
        };
      
        // If status is 'Sale', return green color
        if (status === 'Sale') {
          return 'green';
        }
      
        // Default to a gray color if the status is not in the color map
        return colorMap[status] || '#808080'; // Return gray if status is not recognized
      }
      
    const funnelData = ticketData.map(ticket => {
        const key = Object.keys(ticket)[0];
        const value = ticket[key];
        return {
            name: key==="totalTickets"?"All":key,
            y: value,
            color:getColorForStatus(key)
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
    console.log(startDate)
    return (
        <Container fluid className="p-0" style={{ height: "100vh", overflow: "hidden" }}>
            <div className="d-flex justify-content-between align-items-center p-3 ">
                <h5>Leads and status info</h5>
                <div className="d-flex justify-content-center w-50">
                    <button  className={`${startDate?"bg-primary":"bg-success"}  m-2 rounded`} style={{height:"40px"}} onClick={() => setStartDate(null)}>All</button>
                    <div>
                        <input
                            type="date"
                            className="bg-white text-black p-1 m-2 rounded"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholderText="Start date"
                            dateFormat="yyyy-MM-dd" // Customize the date format here
                        />
                    </div>
                  
                </div>
            </div>

            <Row className="h-100">
                {/* First Column with Funnel Chart */}
                <Col lg={6} md={6} sm={12} className="d-flex flex-column p-3">
                    <div>
                        <h6>Tickets vs status </h6>
                        <div style={{ flex: 1 }}>
                            <HighchartsReact highcharts={Highcharts} options={funnelOptions} />
                        </div>
                    </div>

        

                </Col>

                {/* Second Column with Pie Chart and Bar Chart */}
                <Col lg={6} md={6} sm={12} className="d-flex flex-column p-3">
                    <h6>Tickets vs country</h6>
                    <div style={{ flex: 1 }}>
                        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
                    </div>
                   
                </Col>
                <h6>Sales vs country</h6>
                    <div style={{ flex: 1 }}>
                        <HighchartsReact highcharts={Highcharts} options={barOptions} />
                    </div>
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
