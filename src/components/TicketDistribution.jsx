import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';

const TicketDistribution = () => {
    const [ticketData, setTicketData] = useState([]);
    const { userId } = useAuth()

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
        { backgroundColor: '#1abc9c' }, // Turquoise
        { backgroundColor: '#d35400' }, // Orange
        { backgroundColor: '#34495e' }, // Dark Blue
        { backgroundColor: '#c0392b' }, // Dark Red
        { backgroundColor: '#16a085' }, // Dark Green
        { backgroundColor: '#f1c40f' }, // Bright Yellow
        { backgroundColor: '#9b59b6' }, // Violet
        { backgroundColor: '#2c3e50' }, // Midnight Blue
        { backgroundColor: '#95a5a6' }, // Gray
        { backgroundColor: '#ecf0f1' }, // Light Gray
    ];


    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, userId: '', userName: '', count: '' });

    const handleMouseEnter = (e, userId, userName, count,ticketCount,status,type) => {
        const rect = e.currentTarget.getBoundingClientRect(); // Use e.currentTarget for the element the event handler is bound to
        setTooltip({
            visible: true,
            x: rect.left + rect.width / 2, // Horizontal center
            y: rect.top - 10, // Position tooltip above the bar
            userId: userId,
            userName: userName,
            count: count,
            status:status,
            ticketCount:ticketCount,
            type:type
        });
    };


    const handleMouseLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0, userId: '', userName: '', count: '' });
    };
    useEffect(() => {
        if (localStorage.getItem("roleName") === "Closer") {
            fetchCountsOfUser()
        } else {
            fetchCounts();
        }

    }, []);
    const fetchCounts = async () => {
        const response = await axiosInstance.get('/third_party_api/ticket/getticketCounts');
        setTicketData(response.data);
    };

    const fetchCountsOfUser = async () => {
        try {
            const response = await axiosInstance.get(`/third_party_api/ticket/getTiccketCountforBar/${localStorage.getItem("userId")}`);
            setTicketData(response.data);

        } catch (err) {
            console.log("some error")
        }
    };


    return (
        <div className="container  z-1  " >
            <div className="progress" style={{ height: '50px', position: 'relative' }}>
                {sortedData.map(({ userId, userName, ticketCount, count, status, type }, index) => (
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
                        onMouseEnter={(e) => handleMouseEnter(e, userId, userName, ticketCount, count, status, type)}
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
                        position: 'fixed', // Use 'fixed' for consistent placement
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%)', // Center horizontally & position above
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        opacity: 0.9,
                        transition: 'all 0.2s ease-in-out',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <div>{tooltip.userId ? `User: ${tooltip.userName}` : `Status: ${tooltip.status}`}</div>
                    {tooltip.userId && <div>ID: {tooltip.userId}</div>}
                    {tooltip.count && <div>Counts: {tooltip.count}</div>}
                    {tooltip.type && <div>Type: {tooltip.type === 1 ? "Live" : "ABC"}</div>}

                    {/* Triangle pointer */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '0',
                            height: '0',
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #007bff',
                        }}
                    ></div>
                </div>
            )}  

        </div>
    );
};

export default TicketDistribution;
