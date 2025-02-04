import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from './Notification';
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import R2ZWYCP from '../assets/notification/R2ZWYCP.mp3';
import { Modal } from "react-bootstrap";

const NotificationContainer = () => {
    const [notifications, setNotifications] = useState([]);
    const [noOfnewticketsReceived, setNoOfnewticketsReceived] = useState(0);
    const [isMfaOpen, setIsMfaOpen] = useState(false)
    const [mfaCode, setMfaCode] = useState("")
    const [mfaFor, setMfaFor] = useState("")
    useEffect(() => {
        // const socket = new SockJS('https://backend.rdvision.in/ws');
        const socket = new SockJS('https://backend.rdvision.in/ws');

        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            if (localStorage.getItem("roleName") === "SeniorSuperVisor") {
                stompClient.subscribe('/topic/invoice/', (message) => {
                    const updateData = JSON.parse(message.body);
                    setNotifications((prevNotifications) => [
                        { name: "New Invoice Received", type: "inProgress", message: "Paid Invoice Received", ...updateData },
                        ...prevNotifications
                    ]);

                });
            }

            if (localStorage.getItem("roleName") === "Closer") {
                stompClient.subscribe('/topic/invoice/verified/', (message) => {
                    const updateData = JSON.parse(message.body);
                    if (updateData.createdByUserId === parseInt(localStorage.getItem("userId"))) {
                        setNotifications((prevNotifications) => [
                            { type: "completed", message: "Invoice Verified", ...updateData },
                            ...prevNotifications
                        ]);
                    }
                });
            }
            if (localStorage.getItem("roleName") === "Admin") {
                stompClient.subscribe('/topic/mfalogin', (message) => {
                    const updateData = JSON.parse(message.body);
                    setMfaCode(updateData.mfacode)
                    setMfaFor(updateData.email)
                    setIsMfaOpen(true)
                    setTimeout(() => {
                        setMfaCode("")
                        setMfaFor("")
                        setIsMfaOpen(false)
                    }, 120000)
                });
            }
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const socket = new SockJS('https://rdvision.in/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/third_party_api/ticket/', (message) => {
                const newNotification = JSON.parse(message.body);
                setNotifications((prevNotifications) => [
                    {
                        type: "newLead",
                        name: newNotification.senderName,// Assign the appropriate type here
                        message: newNotification.senderCountryIso,
                        product: newNotification.queryProductName,
                        ...newNotification
                    },
                    ...prevNotifications
                ]);
                setNoOfnewticketsReceived((prevCount) => prevCount + 1);
                playNotificationSound();
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    const playNotificationSound = () => {
        const audio = new Audio(R2ZWYCP);
        audio.play();
    };

    const removeNotification = (index) => {
        setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
    };
    const onClose = () => {
        setIsMfaOpen(false)
        setMfaCode("")
        setMfaFor("")
    }
    return (
        <div className="d-flex flex-column align-items-end p-3" style={{ position: "absolute", zIndex: 10000, maxHeight: "100vh", overflowY: "auto" }}>
            <TransitionGroup>
                {notifications.map((notification, index) => (
                    <CSSTransition
                        key={index}
                        timeout={500}
                        classNames="notification"
                        onExited={() => removeNotification(index)}
                    >
                        <Notification
                            title={notification.type}
                            details={notification.message}
                            requirement={notification.product}
                            name={notification.name}
                            type={notification.type} // Pass type for color styling
                        />
                    </CSSTransition>
                ))}
            </TransitionGroup>

            <Modal
                show={isMfaOpen}
                onHide={onClose}
                centered
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                className="rounded-lg"
            >
                <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">MFA Code</h2>

                    {/* MFA Code Display */}
                    <h1 className="mt-4 text-4xl font-bold tracking-widest text-blue-600">
                        {mfaCode}
                    </h1>

                    {/* Description */}
                    <p className="mt-2 text-gray-600 text-lg">

                        <h1>
                            for:: {mfaFor}
                        </h1></p>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-black rounded-lg shadow-md hover:bg-blue-700"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default NotificationContainer;
