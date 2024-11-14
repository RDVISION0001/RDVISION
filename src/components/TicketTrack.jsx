import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import './TicketTrack.css';
// Authentication context
import { useAuth } from '../auth/AuthContext';

const TicketTrack = () => {
    const { userId } = useAuth(); // Get userId from the Auth context
    const { userReportReloader } = useAuth()
    const [data, setData] = useState([]);
    const scrollRef = useRef(null); // Reference to the container for scroll position

    // Fetch the ticket history data on component mount
    useEffect(() => {
        const fetchTicketHistory = async () => {
            try {
                const response = await axiosInstance.get(`/history/getTickettrackhistory/${userId}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching ticket history:', error);
            }
        };

        fetchTicketHistory();
    }, [userId, userReportReloader]); // Runs when userId changes

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);

        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase(); // Gets the 3-letter month abbreviation
        const year = dateObj.getFullYear();

        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    // Scroll to the top of the container
    const scrollToTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Scroll to the bottom of the container
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };
    console.log(userReportReloader)
    return (
        <div className='text-center'>
            <button onClick={scrollToTop} className="scroll-btn">
                <i class="fa-solid fa-angle-up fa-2xl"></i>
            </button>
            <div ref={scrollRef} style={{ overflowY: "auto", height: "100vh" }}>
                {data && data.map((step, index) => (
                    <div key={index}>
                        <div className='text-center' style={{ height: "90px", width: "200px", border: "2px solid green", borderRadius: "50px", marginTop: "10px" }}>
                            <div className='fw-bold'>{step.customerName.length>15?step.customerName.slice(0,15)+"...":step.customerName}</div>
                            <div style={{fontSize:"12px"}}>{step.action}</div>
                            <div>{step.ticketStatus}</div>
                            <div style={{fontSize:"12px"}}>{formatDate(step.queryDate)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={scrollToBottom} className="scroll-btn">
                <i class="fa-solid fa-angle-down fa-2xl"></i>
            </button>
        </div>
    );
};

export default TicketTrack;
