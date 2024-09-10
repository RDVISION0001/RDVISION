import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';

// Register chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Report(props) {
    const [monthly, setMonthly] = useState(false);
    const [useDetails, setUserDetails] = useState({})
    useEffect(() => {
        loadeUserDetails()
    }, [])
    const loadeUserDetails = async () => {
        const response = await axiosInstance.get(`/user/get/${props.user}`)
        setUserDetails(response.data.dto)
    }
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Work',
                data: [],
                backgroundColor: 'rgba(40, 167, 69, 0.7)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1,
            },
            {
                label: 'Break',
                data: [],
                backgroundColor: 'rgba(220, 53, 69, 0.7)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1,
            },
        ],
    });
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Assigned',
                data: [],
                fill: false,
                backgroundColor: 'rgba(40, 167, 69, 0.8)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(40, 167, 69, 1)',
            },
        ],
    });
    const [apiData, setApiData] = useState([]);
    const [workData, setWorkData] = useState({ userId: props.user, weeks: 1 });
    const [workDataTickets, setWorkDataForTickets] = useState({ userId: props.user, weeks: 1 });

    const toggleMonthly = () => {
        setMonthly(!monthly);
    };

    const loadWorksMonthly = async () => {
        const response = await axiosInstance.post("/user/userreportbymonth", workData);
        setApiData(response.data);
    };

    const loadWorks = async () => {
        const response = await axiosInstance.post("/user/userreport", workData);
        setApiData(response.data);
    };

    const loadAssignTickets = async () => {
        try {
            const response = await axiosInstance.post("third_party_api/ticket/totalassigntickets", workDataTickets);
            const data = response.data;
            const labels = data.map(item => item.date ? item.date.join('-') : 'Unknown Date');
            const numberOfTickets = data.map(item => item.count);
            setLineData(prevData => ({
                ...prevData,
                labels: labels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: numberOfTickets,
                    }
                ],
            }));
        } catch (error) {
            console.error("Error loading assigned tickets", error);
        }
    };

    const loadAssignTicketsMonth = async () => {
        try {
            const response = await axiosInstance.post("third_party_api/ticket/totalassignticketsmonthly", workDataTickets);
            const data = response.data;
            const labels = data.map(item => item.date ? item.date.join('-') : 'Unknown Date');
            const numberOfTickets = data.map(item => item.count);
            setLineData(prevData => ({
                ...prevData,
                labels: labels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: numberOfTickets,
                    }
                ],
            }));
        } catch (error) {
            console.error("Error loading assigned tickets", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (monthly) {
                await loadWorksMonthly();
            } else {
                await loadWorks();
            }
        };
        fetchData();
    }, [monthly, workData]);
    useEffect(() => {
        if (apiData.length > 0) {
            const labels = monthly
                ? apiData.map(item => `${numberToMonthName(item.month)}_${item.year}`)
                : apiData.map(item => item.date && item.date.join('-'));
            const workData = apiData.map(item => item.totalWorkTime / 3600);
            const breakData = apiData.map(item => item.totalBreakTime / 3600);

            setChartData(prevData => ({
                ...prevData,
                labels: labels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: workData,
                    },
                    {
                        ...prevData.datasets[1],
                        data: breakData,
                    },
                ],
            }));
        }
    }, [apiData, monthly]);

    useEffect(() => {
        if (monthly) {
            loadAssignTicketsMonth();
        } else {
            loadAssignTickets();
        }
    }, [monthly, workDataTickets]);

    const numberToMonthName = (number) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[number - 1] || "Invalid month";
    };

    return (
        <Container fluid>
            <div className='d-flex justify-content-center fw-semibold'>
                <span>{useDetails.firstName} {useDetails.lastName}</span>
            </div>
            <Col md={12}>
                <Card className="mb-4">
                    <Card.Header className='d-flex justify-content-between'>
                        <p>Work and Break Category - Bar Chart</p>
                        <div>
                            <button className='btn btn-success m-1' onClick={toggleMonthly}>{!monthly ? "Monthly" : "Weekly"}</button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Bar data={chartData} />
                        <select
                            className="form-select mt-3 w-25"
                            value={workData.weeks}
                            onChange={(e) =>
                                setWorkData(prevData => ({
                                    ...prevData,
                                    weeks: e.target.value,
                                }))
                            }
                        >
                            <option value="1">1 {monthly ? "Month" : "Week"}</option>
                            <option value="2">2 {monthly ? "Months" : "Weeks"}</option>
                            <option value="3">3 {monthly ? "Months" : "Weeks"}</option>
                            <option value="4">4 {monthly ? "Months" : "Weeks"}</option>
                        </select>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={12}>
                <Card className="mb-4">
                    <Card.Header className='d-flex justify-content-between'>
                        <p>Assigned Tickets - Line Chart</p>
                        <div>
                            <button className='btn btn-success m-1' onClick={toggleMonthly}>Toggle Monthly/Weekly</button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Line data={lineData} />
                        <select
                            className="form-select mt-3 w-25"
                            value={workDataTickets.weeks}
                            onChange={(e) =>
                                setWorkDataForTickets(prevData => ({
                                    ...prevData,
                                    weeks: e.target.value,
                                }))
                            }
                        >
                            <option value="1">1 {monthly ? "Month" : "Week"}</option>
                            <option value="2">2 {monthly ? "Months" : "Weeks"}</option>
                            <option value="3">3 {monthly ? "Months" : "Weeks"}</option>
                            <option value="4">4 {monthly ? "Months" : "Weeks"}</option>
                        </select>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
}

export default Report;
