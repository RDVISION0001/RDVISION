import React, { useEffect, useState } from 'react';
import './css/ProgressBar.css'; 
import axiosInstance from '../axiosInstance';

// Component to display a single progress bar
const ProgressBar = ({ label, value, max, colorClass }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // Smoothly transition from 0% to the current percentage
        const timeout = setTimeout(() => {
            setPercentage((value / max) * 100);
        }, 100); // Delay to ensure component is mounted

        return () => clearTimeout(timeout); // Clean up timeout on component unmount
    }, [value, max]);

    return (
        <div className="progress-container">
            <div className="progress-content">
                <label>{label}</label>
                <div className="progress-text">
                    <span className="current-value">{value}</span> /
                    <span className="max-value">{max}</span>
                </div>
            </div>
            <div className="progress-bar-background">
                <div
                    className={`progress-bar-fill ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};




// Main component
const TaskProgress = () => {
    // progress bar section
    const [salesProgress, setSaleProgress] = useState({ current: 0, total: 0 });
    const [followUpProgress, setFollowUpProgress] = useState({ current: 0, total: 0 });
    const [newTicketsProgress, setNewTicketsProgress] = useState({ current: 0, total: 0 });



    useEffect(() => {

        //sale
        axiosInstance.get(`/history/getTotalTodayUpdateByUser/${localStorage.getItem("userId")}`).then((resp) => {
            const data = resp.data;
            setSaleProgress(prevState => ({
                ...prevState,
                current: data.filter(item => item.status === 'Sale').length
            }));
        })

        // taraget task
        axiosInstance.get(`/users_task/getYourTodayTask/${localStorage.getItem("userId")}`).then((resp) => {
            setSaleProgress(prevState => ({
                ...prevState,
                total: resp.data.saleTask
            }));
        })

        //total new tickets
       TotalNew()

    }, [])

    const TotalNew = async () => {
        const userId=localStorage.getItem("userId")
        try {
            const response = await axiosInstance.get(`/third_party_api/ticket/getAllByUser/${userId }`);
            const totalNew = response.data.totalElement;
            setFollowUpProgress(prevState=>({
                current:response.data.filter(item=>item.ticketstatus==="Follow").length,
                total:response.data.length
            }))
            setNewTicketsProgress(prevState=>({
                current:response.data.filter(item=>item.ticketstatus==="New").length,
                total:response.data.length
            }))
        } catch (error) {
            console.error('Error fetching in negotiation:', error);
        }
    };

    return (
        <div className="progress-wrapper">
            <ProgressBar
                label="Total Sales Progress"
                value={salesProgress.current}
                max={salesProgress.total}
                colorClass="sales"
            />
            <ProgressBar
                label="Follow-Up Progress"
                value={followUpProgress.current}
                max={followUpProgress.total}
                colorClass="follow-up"
            />
            <ProgressBar
                label="New Tickets"
                value={newTicketsProgress.current}
                max={newTicketsProgress.total}
                colorClass="new-tickets"
            />
        </div>
    );
};

export default TaskProgress;
