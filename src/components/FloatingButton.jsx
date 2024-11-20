import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Draggable from 'react-draggable';

const FloatingButton = () => {
    const [isOpen, setIsOpen] = useState(false); // Default to collapsed
    const [isLoading, setIsLoading] = useState(true); // Loading state for iframe
    const popupRef = useRef(null);

    // Toggle the open/close state
    const togglePopup = () => {
        setIsOpen((prev) => !prev); // Switch between collapsed and expanded
    };

    return (
        <div>
            <Draggable handle=".draggable-handle">
                <div
                    ref={popupRef}
                    style={{
                        width: isOpen ? '343px' : '100px', // Full size or small when collapsed
                        height: isOpen ? '583px' : '50px', // Full size or small when collapsed
                        borderRadius: '20px',
                        position: 'absolute',
                        zIndex: 99999,
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'width 0.3s, height 0.3s', // Smooth transition for resizing
                        overflow: 'hidden', // Prevent content overflow
                    }}
                >
                    {/* Drag Handle */}
                    <div
                        className="draggable-handle"
                        style={{
                            height: '30px',
                            backgroundColor: '#f1f1f1',
                            borderRadius: '20px 20px 0 0',
                            cursor: 'move',
                            padding: '5px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                    ></div>

                    {/* Collapse/Open Button */}
                    <div
                        onClick={togglePopup}
                        style={{
                            position: 'absolute',
                            top: '0px',
                            right: '5px',
                            backgroundColor: '#645e64',
                            borderRadius: '50%',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        {isOpen ? (
                            <i className="fa-solid fa-compress"></i>
                        ) : (
                            <i className="fa-solid fa-expand"></i>
                        )}
                    </div>

                    {/* Loading Spinner */}
                    {isLoading && (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                position: 'absolute',
                                top: '40%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                height: '20%',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '20px',
                                zIndex: 100000,
                                display: isOpen ? 'flex' : 'none', // Hide spinner when collapsed
                            }}
                        >
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span>Loading...</span>
                        </div>
                    )}

                    {/* Always Render the iframe */}
                    <iframe
                        key="iframe"
                        src="https://ccn.cloud-connect.in/Agent_plugin"
                        allow="geolocation; microphone; camera"
                        id="HoduCCPluginIFrame"
                        style={{
                            border: 'none',
                            borderRadius: '0 0 20px 20px',
                            width: '100%',
                            height: 'calc(100% - 30px)', // Adjust for drag handle height
                        }}
                        allowFullScreen
                        onLoad={() => setIsLoading(false)} // Set loading state to false once the iframe loads
                    />
                </div>
            </Draggable>
        </div>
    );
};

export default FloatingButton;
