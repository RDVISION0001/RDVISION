import { Stomp } from "@stomp/stompjs";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import axiosInstance from "../axiosInstance";
import R2ZWYCP from '../assets/notification/chatN.mp3';
import { FormLabel, Modal } from "react-bootstrap";
import { FaPen } from "react-icons/fa";


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
    const [roles, setRoles] = useState([])
    const [filterString, setFilterString] = useState("")
    const [notificationCount, setNotificationCOunt] = useState([])
    const [isImageUplaoderOpen, setIsImageUploadeOpen] = useState(false)
    const [imageUrlToSend, setImageUrlToSend] = useState("")
    const [isUplaoded, setIsUploaded] = useState(false)
    const [seeImageUrl, setSeeImageUrl] = useState("")
    const [isImageView, setIsImageView] = useState(false)

    const [files, setFiles] = useState("");
    const [title, setTitle] = useState("");
    const [uploadStatus, setUploadStatus] = useState(""); // To show upload status
    const [uploadedDocuments, setUploadedDocuments] = useState([]); // To store the uploaded documents
    const [previewUrl, setPreviewUrl] = useState("");
    const [isSending, setIsSending] = useState(false)

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setFiles(reader.result.split(",")[1]); // Store the base64 string of the file
            setPreviewUrl(reader.result.split(",")[1])
            handleUplaodImage(reader.result.split(",")[1])
        };

        if (file) {
            reader.readAsDataURL(file); // Convert the file to a Base64 string
        }
    };

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
        fetchAllRoles()
    }, []);

    useEffect(() => {
        fetchAllMessages()

    }, [selectedRecipient])
    const fetchAllMessages = async () => {
        const response = await axiosInstance.post(`/user/getTwoUsersConversation`, {
            sentByUserId: userId,
            sentToUserId: selectedRecipient
        })
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

    const fetchAllRoles = async () => {
        const response = await axiosInstance.get(`/role/getAllRoles`)
        setRoles(response.data.dtoList)
    }


    useEffect(() => {
        const socket = new SockJS("https://backend.rdvision.in/ws");
        const client = Stomp.over(socket);

        client.connect({}, (frame) => {
            console.log("Connected: " + frame);

            // Subscribe to public and private messages only once
            client.subscribe("/topic/messages", (messageOutput) => {
                const messageData = JSON.parse(messageOutput.body);
                if (messageData.sentToUserId === parseInt(userId)) {
                    console.log(messageData.sentToUserId)
                    playNotificationSound()

                    if (!notificationCount.includes(messageData.sentByUserId)) {
                        setNotificationCOunt((prev) => [...prev, messageData.sentByUserId])

                    }
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

    const sendMessage = () => {
        if (stompClient) {
            const recipientName = role === "Admin" && selectedRecipient
                ? selectedRecipient && users.find(user => user.userId === selectedRecipient)?.firstName
                : ''; // Retrieve the firstName if Admin, else empty

            const messageObject = {
                ...messageBox,
                sentToUserId: selectedRecipient,
                sentByUser: true,
                sentDate: currentDate,
                sentTime: formattedTime,
                recipientName: messageBox.recipientName, // Add recipient name to the message object
                imageUrl: imageUrlToSend
            };
            console.log(messageObject)

            console.log("Message object before sending:", messageObject); // Debug log

            stompClient.send("/app/send", {}, JSON.stringify(messageObject));
            setMessages((prevMessages) => [
                ...prevMessages,
                messageObject,
            ]);
            setMessage((prev) => ({ ...prev, message: "" }));

        }
        setImageUrlToSend("")
        setIsUploaded(false)
        setPreviewUrl('')
        setIsImageUploadeOpen(false)



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
            setRecipientName(selectedRecipient && selectedUser[0].firstName);  // Set recipient name to the first name of the selected user
            setMessage((prev) => ({
                ...prev,
                recipientName: selectedRecipient && selectedUser[0].firstName
            }))
        }
    }, [selectedRecipient]); // Re-run the effect when selectedRecipient or users change


    const playNotificationSound = () => {
        const audio = new Audio(R2ZWYCP);
        audio.play();
    };
    //resuble function to convert byte code to image url
    function convertToImage(imageString) {
        const byteCharacters = atob(imageString); // Decode base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;

    }

    function getRoleNameById(roleId) {
        // Find the role object by roleId
        const role = roles.find(r => r.roleId === roleId);
        // Return the roleName if found, otherwise return a default message
        return role ? role.roleName : "Role not found";
    }

    function getUserByUserI(userId) {
        // Find the role object by roleId
        const user = users.find(r => r.userId === userId);
        // Return the roleName if found, otherwise return a default message
        return user ? user : "user not found";
    }

    const removeUser = (userToRemove) => {
        setNotificationCOunt((prev) => prev.filter((user) => user !== userToRemove));
    };
    const openChatOfUser = (user) => {
        setSelectedRecipient(user)
        removeUser(user)
    }
    const openImageUploader = () => {
        setIsImageUploadeOpen(true)
    }

    const handleUplaodImage = async (imageData) => {
        setIsSending(true)
        try {
            const response = await axiosInstance.post('/images/uplaodChatImage', {
                imageData: imageData
            })
            setImageUrlToSend(response.data)
            setIsSending(false)
            setIsUploaded(true)

        }

        catch (e) {
            setIsSending(false)
        }
    }
    const openImageView = (imageurl) => {
        setSeeImageUrl(imageurl)
        setIsImageView(true)
    }
    return (
        <>
            {selectedRecipient ? <div
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
                    <i class="fa-solid fa-arrow-right fa-rotate-180" onClick={() => setSelectedRecipient(null)}></i>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex justify-content-between align-items-center ">
                            <img
                                style={{
                                    height: "30px",
                                    width: "30px",
                                    borderRadius: "50%",
                                    border: ".5px solid gray",
                                }}
                                src={convertToImage(getUserByUserI(selectedRecipient).imageData)}
                                alt="NA"
                            />
                            <div style={{ marginLeft: "40px" }}>{getUserByUserI(selectedRecipient).firstName}</div>
                        </div>
                        {/* <div style={{ fontWeight: "bold" }}>RD-chat</div> */}
                    </div>
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
                    {messages.filter((message) => (message.sentByUserId === userId && message.sentToUserId === selectedRecipient) || (parseInt(message.sentByUserId) === selectedRecipient && message.sentToUserId === parseInt(userId))).map((msg, index) => (
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
                                {/* {role === "Admin" && (msg.sentByUserId === userId) ? (
                                    <strong>Sent to {msg.recipientName}</strong>
                                ) : null} */}

                                {/* Show "Received from" only for received messages */}
                                {/* {msg.sentByUserId !== userId ? (
                                    <strong>Received from {msg.sentByUserName}</strong>
                                ) : null} */}

                                <p>{msg.message}</p>
                                {msg.imageUrl && (
                                    <div>

                                        <img
                                            style={{
                                                height: "250px",

                                                width: "200px", // Maintain the aspect ratio by automatically adjusting the width
                                                objectFit: "contain", // Ensure the entire image is visible
                                                display: "block", // Prevent inline spacing issues
                                                margin: "0 auto", // Center the image horizontally if needed
                                            }}
                                            src={msg.imageUrl}
                                            alt="Uploaded"
                                        />
                                        <i class="fa-solid fa-expand fa-xl" onClick={() => openImageView(msg.imageUrl)}></i>
                                    </div>
                                )}

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
                                {/* {msg.sentByUserId !== (userId) && <div className="d-flex justify-content-end">
                                    <i
                                        className="fa-solid fa-reply fa-rotate-180"
                                        onClick={() => setSelectedRecipient(msg.sentByUserId)}
                                        style={{ color: "#32b38c", cursor: "pointer" }}
                                        title="Reply"
                                    ></i>

                                </div>} */}

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


                    {/* Message input field */}
                    <button className="bg-transparent text-black border p-2 " style={{ marginRight: "5px" }} onClick={openImageUploader}>
                        @
                    </button>
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
            </div> :
                <div className="h-100" style={{ overflowY: "scroll", paddingTop: "1px" }}>
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
                        {/* <i class="fa-solid fa-arrow-right fa-rotate-180" onClick={() => setSelectedRecipient(null)}></i> */}
                        <div style={{ fontWeight: "bold" }}>RD-chat</div>
                        <div style={{ fontSize: "14px", cursor: "pointer" }}>⋮</div>
                    </div>
                    <input value={filterString} onChange={(e) => setFilterString(e.target.value)} type="text" placeholder="search User to chat" style={{ padding: "5px", backgroundColor: "white", color: "black", borderRadius: "5px", marginTop: "10px", marginLeft: "10px" }} />
                    {users &&
                        users.filter((user) => user.userId !== parseInt(userId))
                            .filter(
                                (user) =>
                                    filterString.length === 0 ||
                                    user.firstName.toLowerCase().includes(filterString.toLowerCase())
                            )
                            .map((user, index) => (<div
                                key={index}
                                className="d-flex justify-content-between bg-light border m-3 p-3 rounded transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                                style={{
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    position: "relative", // Make sure the positioning works for the green dot
                                }}
                                onMouseEnter={(e) => e.currentTarget.classList.add("shadow-lg", "scale-105")}
                                onMouseLeave={(e) => e.currentTarget.classList.remove("shadow-lg", "scale-105")}
                            >

                                {notificationCount.includes(user.userId) && <div className="bg-danger text-white rounded p-1 fw-bold" style={{ position: "absolute", left: "240px", top: "30px" }}>

                                    unread
                                </div>}
                                <div className="d-flex align-items-center" onClick={() => openChatOfUser(user.userId)}>
                                    <img
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            borderRadius: "50%",
                                            border: ".5px solid gray",
                                        }}
                                        src={convertToImage(user.imageData)}
                                        alt="NA"
                                    />
                                    <div className="ms-3">
                                        <div>
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div>
                                            {getRoleNameById(user.roleId)}
                                        </div>
                                    </div>

                                </div>
                                {/* Live Indicator (Green Dot) */}
                                <div
                                    className={`rounded-circle ${!user.onBreak ? 'bg-success' : 'bg-danger'}`}
                                    style={{
                                        height: "10px",
                                        width: "10px",
                                        position: "absolute",
                                        top: "5px", // Adjust top and right to position the dot
                                        right: "5px",
                                        border: "2px solid white"
                                    }}
                                />
                            </div>
                            ))}
                </div>


            }

            <Modal
                show={isImageUplaoderOpen}
                onHide={() => setIsImageUploadeOpen(false)}
                dialogClassName=""
                centered={false}
                className=""
            >
                <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
                    <FormLabel className="mb-3 text-black">Upload Image to Send</FormLabel>
                    <div
                        style={{
                            width: "300px",
                            height: "200px",
                            position: "relative", // To position the pen icon over the image
                            border: previewUrl ? "none" : "2px dashed black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            marginBottom: "10px",
                            cursor: "pointer",
                            overflow: "hidden", // To ensure image doesn't overflow
                        }}
                        onClick={() => document.getElementById("fileUpload").click()}
                    >
                        {previewUrl ? (
                            <>
                                <img
                                    src={convertToImage(previewUrl)}
                                    alt="Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "cover", // Ensures image fits nicely
                                    }}
                                />
                                <FaPen
                                    style={{
                                        position: "absolute",
                                        bottom: "10px",
                                        right: "10px",
                                        color: "white",
                                        backgroundColor: "black",
                                        borderRadius: "50%",
                                        padding: "5px",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                    }}
                                />
                            </>
                        ) : (
                            <span className="text-black">Click to Upload Image</span>
                        )}
                    </div>
                    <input
                        type="file"
                        id="fileUpload"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {isSending && <button>Uploading....</button>}
                    {isUplaoded && <button onClick={sendMessage}>send</button>}
                </Modal.Body>
            </Modal>
            <Modal
                show={isImageView}
                onHide={() => setIsImageView(false)}
                dialogClassName=""
                centered={false}
                className=""
            >
                <Modal.Body className="d-flex flex-column justify-content-center align-items-center p-3">
                    <img
                        style={{
                            height: "500px",
                            width: "700px",
                            objectFit: "contain", // Ensures the image fits within the container while maintaining aspect ratio
                            display: "block", // Prevents inline spacing issues
                            margin: "0 auto", // Centers the image horizontally if needed
                        }}
                        src={seeImageUrl}
                        alt="Displayed"
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default WebsocketService;
