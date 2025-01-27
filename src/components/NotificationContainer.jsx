import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Notification from './Notification';
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import R2ZWYCP from '../assets/notification/R2ZWYCP.mp3';

const NotificationContainer = () => {
    const [notifications, setNotifications] = useState([]);
    const [noOfnewticketsReceived, setNoOfnewticketsReceived] = useState(0);

    useEffect(() => {
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
        </div>
    );
};

export default NotificationContainer;
