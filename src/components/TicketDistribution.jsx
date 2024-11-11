import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';

const TicketDistribution = () => {
    const [ticketData, setTicketData] = useState([]);

    // Sort the data in ascending order based on ticket count
    const sortedData = ticketData.sort((a, b) => a.ticketCount - b.ticketCount);

    const totalTickets = sortedData.reduce((sum, { ticketCount }) => sum + ticketCount, 0);

    // Custom colors for progress bars (You can customize these hex colors)
    const colors = [
        { backgroundColor: '#3498db' }, // Blue
        { backgroundColor: '#e74c3c' }, // Red
        { backgroundColor: '#2ecc71' }, // Green
        { backgroundColor: '#f39c12' }, // Yellow
        { backgroundColor: '#8e44ad' }, // Purple
    ];

    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, userId: '', userName: '', count: '' });

    const handleMouseEnter = (e, userId, userName, count) => {
        const rect = e.currentTarget.getBoundingClientRect(); // Use e.currentTarget for the element the event handler is bound to
        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2, // Horizontal center
            y: rect.top - 10, // Position tooltip above the bar
            userId: userId,
            userName: userName,
            count: count,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, userId: '', userName: '', count: '' });
    };

    const fetchCounts = async () => {
        const response = await axiosInstance.get('/third_party_api/ticket/getticketCounts');
        setTicketData(response.data);
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    return (
        <div className="container">
            <div className="progress" style={{ height: '50px', position: 'relative' }}>
                {sortedData.map(({ userId, userName, ticketCount }, index) => (
                    <div
                        key={userId}
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${(ticketCount / totalTickets) * 100}%`,
                            minWidth: '50px', // Ensure minimum width for smaller counts
                            height: '50px', // Increase the height of the bar
                            fontWeight: 'bold',
                            fontSize: '20px',
                            ...colors[index % colors.length], // Apply custom color
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, userId, userName, ticketCount)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {ticketCount}
                    </div>
                ))}
            </div>

            {tooltip.visible && (
                <div
                    className="custom-tooltip"
                    style={{
                        position: 'absolute',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-250%, -100%)',
                        backgroundColor: '#007bff', // Blue background
                        color: '#fff', // White text for contrast
                        padding: '8px 16px', // Adjusted padding for better spacing
                        borderRadius: '8px', // Rounded corners
                        fontSize: '14px', // Font size
                        fontWeight: 'bold', // Bold text
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                        opacity: 0.9, // Slight transparency
                        transition: 'all 0.2s ease-in-out', // Smooth transition
                        border: '1px solid rgba(255, 255, 255, 0.2)', // Light border
                    }}
                >
                    <div style={{ fontWeight: 'bold' }}>User: {tooltip.userName}</div>
                    <div style={{ fontWeight: 'bold' }}>ID: {tooltip.userId}</div>
                    <div style={{ fontWeight: 'bold' }}>Counts: {tooltip.count}</div>

                    {/* Triangle pointer */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-8px', // Positioning the triangle just below the tooltip
                            left: '50%',
                            transform: 'translateX(-50%)', // Center the triangle horizontally
                            width: '0',
                            height: '0',
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #007bff', // Blue triangle matching the background
                        }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default TicketDistribution;