import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ActionMode from "../pages/ActionMode";
import { Modal } from "react-bootstrap";
import NotificationOpner from "./NotificationOpner";

const Notification = ({ title, details, requirement, type, name }) => {
    const [timeAgo, setTimeAgo] = useState("now");
    const [isVisible, setIsVisible] = useState(true); // Track visibility of the notification
    const [isCopied, setIsCopied] = useState(false); // Track if the title is copied
    const notificationTime = new Date(); // Assuming this is the time when the notification was created
    const [isActionModeOpen, setIsActionModeOpen] = useState(false)

    useEffect(() => {
        const updateTimeAgo = () => {
            const now = new Date();
            const diffInMs = now - notificationTime;
            const diffInMinutes = Math.floor(diffInMs / 60000);

            if (diffInMinutes === 0) {
                setTimeAgo("now");
            } else if (diffInMinutes === 1) {
                setTimeAgo("1 minute ago");
            } else {
                setTimeAgo(`${diffInMinutes} minutes ago`);
            }
        };

        updateTimeAgo(); // Update immediately on load
        const intervalId = setInterval(updateTimeAgo, 60000); // Update every minute

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);




    const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

    // Function to handle closing the notification
    const handleClose = () => {
        setIsVisible(false); // Hide the notification
    };

    // Function to handle copying title to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(name).then(() => {
            setIsCopied(true); // Change icon color after successful copy
            setTimeout(() => {
                setIsCopied(false); // Reset the icon color after 2 seconds
            }, 2000);
        }).catch(err => {
            console.error("Error copying text: ", err);
        });
    };

    if (!isVisible) return null; // If the notification is not visible, don't render it

    // Define different gradient styles for different types
    const getGradientStyle = (type) => {
        switch (type) {
            case "newLead":
                return "linear-gradient(45deg, #ffa500, #ff4500)"; // Orange gradient for new lead
            case "inProgress":
                return "linear-gradient(45deg, #1e90ff, #00bfff)"; // Blue gradient for in-progress
            case "completed":
                return "linear-gradient(45deg, #32cd32, #228b22)"; // Green gradient for completed
            case "rejected":
                return "linear-gradient(45deg, #dc143c, #b22222)"; // Red gradient for rejected
            default:
                return "linear-gradient(45deg, #ffa500, #ff4500)"; // Default to orange
        }
    };

    return (
        <>
            <div
                className="d-flex flex-column align-items-start p-1 m-1"
                style={{
                    background: getGradientStyle(type), // Apply dynamic gradient based on the type
                    color: "#000",
                    borderRadius: "0px 10px 10px 10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    minWidth: "300px",
                    maxWidth: "400px",
                    height: "60px",
                    position: "relative", // Needed for absolute positioning of the close button
                }}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-32px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: "18px",
                        cursor: "pointer",
                    }}
                >
                    <i className="fa-solid fa-circle-xmark" id="closeButton" style={{ color: "#ce5b1c" }}></i>
                </button>

                {/* Title with Copy Button */}
                <div className="d-flex justify-content-between mb-2 w-100" style={{ fontSize: "13px", fontWeight: "bold", paddingLeft: "3px", paddingRight: "3px" }}>
                    <div>
                        <span>{name}</span>
                        <button
                            onClick={handleCopy}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: "16px",
                                cursor: "pointer",
                                padding: "0",
                            }}
                        >
                            <i
                                className={`fa-solid fa-copy ${isCopied ? "text-success" : "text-white"}`}
                                style={{ marginLeft: "5px" }}
                            ></i>
                        </button>
                    </div>
                    <div>
                        <i class="fa-solid fa-location-arrow fa-xl" onClick={() => setIsActionModeOpen(true)} style={{ color: "#0056eb", cursor: "Pointer" }}></i>
                    </div>
                </div>

                {/* Details */}
                <div className="d-flex justify-content-between w-100">
                    <div className="d-flex align-items-center" style={{ fontSize: "12px" }}>
                        <img src={getFlagUrl(details)} alt={details} />
                    </div>
                    <div className="d-flex align-items-center" style={{ fontSize: "12px", marginLeft: "2px" }}>
                        <span style={{ marginRight: "8px" }}><i className="fa-solid fa-ticket"></i></span>
                        {requirement ? requirement : "No product info"}
                    </div>
                    {/* Timestamp */}
                    <div className="text-muted" style={{ fontSize: "12px", alignSelf: "flex-end" }}>
                        {timeAgo}
                    </div>
                </div>


            </div>
            <Modal show={isActionModeOpen} id="addMoreItemsModal" >
                <NotificationOpner searchString={name} />
                <div className="d-flex justify-content-end">
                    <button style={{ maxWidth: "70px" }} onClick={() => setIsActionModeOpen(false)}>close</button>
                </div>
            </Modal>
        </>
    );
};

export default Notification;
