import { Stomp } from "@stomp/stompjs";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import axiosInstance from "../axiosInstance";
import R2ZWYCP from '../assets/notification/R2ZWYCP.mp3';

const WebsocketService = () => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [users, setUsers] = useState(); // Example user list
    const userId = localStorage.getItem("userId")
    const role = localStorage.getItem("roleName");
    const [selectedRecipient, setSelectedRecipient] = useState(); // Default recipient
    const [recipientName, setRecipientName] = useState("Admin")
    const [admin, setAdmin] = useState();
    const username = localStorage.getItem("firstName")
    const currentDate = new Date().toISOString().split('T')[0];

    const [messageBox, setMessage] = useState({
        message: "",
        role: role,
        sentByUserId: localStorage.getItem("userId"),
        sentToUserId: role === "Admin" ? selectedRecipient : admin && admin.userId,
        recipientName: recipientName && recipientName,
        sentDate: currentDate,
        sentTime: ""
    });
    const chatEndRef = useRef(null); // Ref for the chat container's end
    const chatContainerRef = useRef(null); // Ref for the chat container for scroll events
    const [showScrollButton, setShowScrollButton] = useState(false); // State for the scroll button visibility

    useEffect(() => {
        fetchAllClosers();
        fetchAdminDetails();
        fetchAllMessages()
    }, []);

    const fetchAllMessages = async () => {
        const response = await axiosInstance.get(`/user/messages/${userId}`)
        const allMessages = response.data
        for (let i = 0; i < allMessages.length; i++) {
            if (allMessages[i].sentByUserId.toString() === userId) {
                // Mark the message as sent by the user
                allMessages[i].sentByUser = true;

                // Update sentByUserId (if needed)
                const updatedUserId = allMessages[i].sentByUserId.toString();
                allMessages[i].sentByUserId = updatedUserId;
            }
        }

        console.log(allMessages)
        setMessages(allMessages)
    }
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });

        return `${day}-${month}`;
    }
    function formatTime(timeStr) {
        if (typeof (timeStr) !== "object") {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const period = hours >= 12 ? 'pm' : 'am';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight, otherwise adjust the hour
            return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
        } else {
            const [hours, minutes] = timeStr.map(Number);
            const period = hours >= 12 ? 'pm' : 'am';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight, otherwise adjust the hour
            return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
        }
    }


    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Ensures 24-hour format
    });

    const fetchAllClosers = async () => {
        const response = await axiosInstance.get("/user/getAllCloser");
        setUsers(response.data);

    };

    const fetchAdminDetails = async () => {

        const response = await axiosInstance.get("/user/getAdminDetail");
        setAdmin(response.data);

    };


    useEffect(() => {
        const socket = new SockJS("https://rdvision.in/ws");
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log("Connected: " + frame);

            // Subscribe to public and private messages only once
            client.subscribe("/topic/messages", (messageOutput) => {
                const messageData = JSON.parse(messageOutput.body);
                console.log(messageData.sentToUserId ,parseInt(userId))
                if (messageData.sentToUserId === parseInt(userId)) {
                    setMessages((prevMessages) => {
                        if (!prevMessages.some((msg) => msg.message === messageData.message)) {
                            return [
                                ...prevMessages,
                                {
                                    ...messageData,
                                    sentByUser: false,
                                    receivedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                },
                            ];
                        }
                        return prevMessages;
                    });
                }
            });
            console.log(`/user/${userId}/queue/messages`)

            client.subscribe(`/user/${username.toLowerCase()}/queue/messages`, (message) => {

                console.log("Private Message: ", JSON.parse(message.body));
            });

            setStompClient(client); // Store the client in state after connection
        });

        // Cleanup function to disconnect the client when the component unmounts
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []); // Empty dependency array ensures this runs once on mount

    // useEffect(() => {
    //     const socket = new SockJS("https://rdvision.in/ws");
    //     const client = Stomp.over(socket);

    //     client.connect({}, (frame) => {
    //         console.log("Connected: " + frame);

    //         client.subscribe("/topic/messages", (messageOutput) => {
    //             const messageData = JSON.parse(messageOutput.body);

    //             if (messageData.sentToUserId === userId) {
    //                 setMessages((prevMessages) => {
    //                     if (!prevMessages.some((msg) => msg.message === messageData.message)) {
    //                         return [
    //                             ...prevMessages,
    //                             {
    //                                 ...messageData,
    //                                 sentByUser: false,
    //                                 receivedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    //                             },
    //                         ];
    //                     }
    //                     return prevMessages;
    //                 });
    //             }
    //         });

    //         setStompClient(client);
    //     });

    //     return () => {
    //         if (stompClient) {
    //             stompClient.disconnect();
    //         }
    //     };
    // }, []);

    const sendMessage = () => {
        if (messageBox.message && stompClient) {
            const recipientName = role === "Admin" && selectedRecipient
                ? users.find(user => user.userId === selectedRecipient)?.firstName
                : ''; // Retrieve the firstName if Admin, else empty

            const messageObject = {
                ...messageBox,
                sentToUserId: role === "Admin" ? selectedRecipient : admin && admin.userId,
                sentByUser: true,
                sentDate: currentDate,
                sentTime: formattedTime,
                recipientName: messageBox.recipientName, // Add recipient name to the message object
            };

            console.log("Message object before sending:", messageObject); // Debug log

            stompClient.send("/app/send", {}, JSON.stringify(messageObject));
            setMessages((prevMessages) => [
                ...prevMessages,
                messageObject,
            ]);
            setMessage((prev) => ({ ...prev, message: "" }));

        }


    };

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // This effect runs when messages change

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            if (scrollHeight - scrollTop > clientHeight + 50) {
                setShowScrollButton(true); // Show button if user scrolls up more than 50px
            } else {
                setShowScrollButton(false); // Hide button when near the bottom
            }
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        const selectedUser = users && users.filter((user) => user.userId === parseInt(selectedRecipient))

        if (selectedUser) {
            setRecipientName(selectedUser[0].firstName);  // Set recipient name to the first name of the selected user
            setMessage((prev) => ({
                ...prev,
                recipientName: selectedUser[0].firstName
            }))
        }
    }, [selectedRecipient]); // Re-run the effect when selectedRecipient or users change


    const playNotificationSound = () => {
        const audio = new Audio(R2ZWYCP);
        audio.play();
    };
    return (
        <div
            className="chat-widget"
            style={{
                width: "350px",
                height: "500px",
                borderRadius: "12px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#4A90E2",
                    color: "#fff",
                    padding: "10px 15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ fontWeight: "bold" }}>Chat</div>
                <div style={{ fontSize: "14px", cursor: "pointer" }}>⋮</div>
            </div>
            {/* Chat Body */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll} // Track scroll event
                style={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    background: "#F4F4F6",
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`d-flex mb-2 ${msg.sentByUserId === userId ? "justify-content-end" : "justify-content-start"}`}
                    >
                        <div
                            className={`p-2 rounded ${msg.sentByUserId === userId ? "bg-primary text-white" : "bg-light"}`}
                            style={{
                                maxWidth: "70%",
                                padding: "8px 12px",
                                borderRadius: "15px",
                                backgroundColor: msg.sentByUserId === userId ? "#4A90E2" : "#fff",
                                color: msg.sentByUserId === userId ? "#fff" : "#333",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {/* Show "Sent to" only for sent messages */}
                            {role === "Admin" && (msg.sentByUserId === userId) ? (
                                <strong>Sent to {msg.recipientName}</strong>
                            ) : null}

                            {/* Show "Received from" only for received messages */}
                            {role === "Admin" && msg.sentByUserId !== userId ? (
                                <strong>Received from {msg.sentByUserName}</strong>
                            ) : null}

                            <p>{msg.message}</p>

                            <div className="d-flex justify-content-between">
                                {/* Message Sent Date and Time */}
                                {msg.sentByUser && <small className="text-light">
                                    Sent on: {formatDate(msg.sentDate)} at {formatTime(msg.sentTime)}
                                </small>}

                                {/* Message Received Date and Time (for received messages) */}
                                {msg.sentByUserId !== userId && (
                                    <small className="text-muted">
                                        Received on: {formatDate(msg.sentDate)} at {formatTime(msg.sentTime)}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                ))}



                <div ref={chatEndRef} /> {/* This is the reference point to scroll to */}
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    style={{
                        position: "absolute",
                        bottom: "70px",
                        right: "10px",
                        backgroundColor: "gray",
                        color: "white",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <i className="fa-solid fa-arrow-right fa-rotate-90" style={{ color: "white" }}></i>
                </button>
            )}

            {/* Footer */}
            <div
                style={{
                    borderTop: "1px solid #ddd",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                }}
            >
                {/* Show recipient selection dropdown for Admin */}
                {role === "Admin" && (users && users.length > 0) && (
                    <select
                        value={selectedRecipient}
                        onChange={(e) => setSelectedRecipient(e.target.value)}
                        style={{
                            marginRight: "10px",
                            padding: "8px",
                            borderRadius: "20px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                        }}
                    >
                        <option value="0">
                            select user
                        </option>
                        {users.map((user, index) => (

                            <option key={index} value={user.userId}>
                                {user.firstName}
                            </option>
                        ))}
                    </select>
                )}

                {/* Message input field */}
                <input
                    type="text"
                    className="form-control"
                    value={messageBox.message}
                    placeholder="Type your message..."
                    onChange={(e) => setMessage((prev) => ({ ...prev, message: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    style={{
                        flex: 1,
                        borderRadius: "25px",
                        padding: "10px 15px",
                        fontSize: "14px",
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        marginLeft: "10px",
                        padding: "8px 15px",
                        borderRadius: "25px",
                        backgroundColor: "#4A90E2",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default WebsocketService;
