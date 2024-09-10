import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Report() {
    const [selectedBarOption, setSelectedBarOption] = useState('Work');
    const [selectedLineOption, setSelectedLineOption] = useState('Revenue');

    // Data for Bar Chart
    const barData = {
        Work: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Work',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(40, 167, 69, 0.7)', // Deeper green
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Break',
                    data: [8, 15, 5, 7, 4, 6],
                    backgroundColor: 'rgba(220, 53, 69, 0.7)', // Deeper red
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1,
                },
            ],
        },
        Other: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Other Data',
                    data: [5, 10, 15, 20, 25, 30],
                    backgroundColor: 'rgba(23, 162, 184, 0.7)', // Teal
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 1,
                },
            ],
        },
    };

    // Data for Line Chart
    const lineData = {
        Revenue: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    backgroundColor: 'rgba(40, 167, 69, 0.7)', // Deeper green
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2,
                    pointRadius: 5, // Radius for points
                    pointBackgroundColor: 'rgba(40, 167, 69, 1)', // Point color
                },
            ],
        },
        Expenses: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Expenses',
                    data: [45, 50, 60, 70, 80, 90],
                    fill: false,
                    backgroundColor: 'rgba(255, 193, 7, 0.7)', // Yellow
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 2,
                    pointRadius: 5, // Radius for points
                    pointBackgroundColor: 'rgba(255, 193, 7, 1)', // Point color
                },
            ],
        },
    };

    return (
        <Container fluid>
            <Row>
                {/* Card for Bar Chart */}
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Work and Break Category - Bar Chart</Card.Header>
                        <Card.Body>
                            <Bar data={barData[selectedBarOption]} />
                            <DropdownButton
                                id="dropdown-bar-chart"
                                title={`Select ${selectedBarOption}`}
                                className="mt-3"
                                onSelect={(eventKey) => setSelectedBarOption(eventKey)}
                            >
                                <Dropdown.Item eventKey="Work">Work</Dropdown.Item>
                                <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
                            </DropdownButton>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Card for Line Chart */}
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Revenue Category - Line Chart</Card.Header>
                        <Card.Body>
                            <Line data={lineData[selectedLineOption]} />
                            <DropdownButton
                                id="dropdown-line-chart"
                                title={`Select ${selectedLineOption}`}
                                className="mt-3"
                                onSelect={(eventKey) => setSelectedLineOption(eventKey)}
                            >
                                <Dropdown.Item eventKey="Revenue">Revenue</Dropdown.Item>
                                <Dropdown.Item eventKey="Expenses">Expenses</Dropdown.Item>
                            </DropdownButton>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Report;
