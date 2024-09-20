import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceBarChart = () => {
    const data = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // Days of the week
        datasets: [
            {
                label: 'Working Hours',
                data: [8, 7, 9, 6, 8, 5, 7], // Working hours for each day
                backgroundColor: 'rgba(0, 50, 0, 0.8)', // Dark green color

            },
            {
                label: 'Break Hours',
                data: [1, 1.5, 0.5, 1, 1, 0.5, 1], // Break hours for each day
                backgroundColor: 'rgba(100, 0, 0, 0.8)', // Dark red color
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Employee Attendance Report - Working vs Break Hours',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Hours',
                },
            },
        },
    };

    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
};

export default AttendanceBarChart;
