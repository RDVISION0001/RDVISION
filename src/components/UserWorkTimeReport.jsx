import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';

// Register chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function UserWorkTimeReport(props) {
    const [monthly, setMonthly] = useState(false);
    const [useDetails, setUserDetails] = useState({});
    const [totalWorktime, setTotalWorktime] = useState(0);
    const [totalBeakTime, setTotalBreakTime] = useState(0);
    const [defaultUrl, setDefaultUrl] = useState("/third_party_api/ticket");
    const [dateChange,setDateChange]=useState()
  

    useEffect(() => {
        loadeUserDetails();
        setDateChange(props.start)
        setWorkData({ userId: props.user, weeks: 1,endDate:props.start,startDate:props.end})
    }, [props.start,props.end]);

    const loadeUserDetails = async () => {
        const response = await axiosInstance.get(`/user/get/${props.user}`);
        setUserDetails(response.data.dto);
    };

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

    const [apiData, setApiData] = useState([]);
    const [workData, setWorkData] = useState({ userId: props.user, weeks: 1,endDate:props.start,startDate:props.end});
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

    const numberToMonthName = (number) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[number - 1] || "Invalid month";
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
    }, [monthly, workData,props.start,props.end]);

    useEffect(() => {
        if (apiData.length > 0) {
            const labels = monthly
                ? apiData.map(item => `${numberToMonthName(item.month)}_${item.year}`)
                : apiData.map(item => item.date && item.date.join('-'));
            const workData = apiData.map(item => item.totalWorkTime / 3600);
            const breakData = apiData.map(item => item.totalBreakTime / 3600);
            let workTimeSum = 0;
            let breakTimeSum = 0;

            for (let i = 0; i < apiData.length; i++) {
                workTimeSum += apiData[i].totalWorkTime;
                breakTimeSum += apiData[i].totalBreakTime;
            }

            setTotalWorktime(workTimeSum);
            setTotalBreakTime(breakTimeSum);

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

    // Chart options to reduce height and text size
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 10, // Adjust font size for x-axis
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 10, // Adjust font size for y-axis
                    },
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 12, // Adjust font size for legend
                    },
                },
            },
            tooltip: {
                bodyFont: {
                    size: 12, // Adjust font size for tooltips
                },
            },
        },
    };

    return (
        <div style={{ margin: "0", padding: "0" }}>
            <div className='d-flex justify-content-between' style={{ padding: "0px 20px" }} >
                <div style={{ fontSize: "12px" }}>Total Work: <span className='text-primary'>{(totalWorktime / 3600).toFixed(2)} hrs.</span></div>
                <div style={{ fontSize: "12px" }}>Total Break: <span className='text-danger'>{(totalBeakTime / 3600).toFixed(2)} hrs.</span></div>
            </div>
            <p style={{ fontSize: "12px",marginLeft:"5px" }}>Work report</p>
            {/* <div className='d-flex justify-content-center align-items-center'>
                <select
                    className="form-select w-100 "
                    style={{ fontSize: "10px" }}
                    value={workData.weeks}
                    onChange={(e) =>
                        setWorkData(prevData => ({
                            ...prevData,
                            weeks: e.target.value,
                        }))
                    }
                >
                    <option value="1">1 Week</option>
                    <option value="2">2 Week</option>
                    <option value="3">3 Week</option>
                    <option value="4">4 Week</option>
                </select>
            </div> */}

            <div style={{ height: '130px' }}> {/* Adjust height here */}
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default UserWorkTimeReport;
