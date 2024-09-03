import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FloatingButton = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New state for loading
    const popupRef = useRef(null);

    const togglePopup = () => setIsOpen(!isOpen);
    const toggleMinimize = () => setIsMinimized(!isMinimized);

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target) && !event.target.closest('.floating-button')) {
            setIsOpen(false);
            setIsMinimized(false);
        }
    };
    const styles = {
        position: 'relative',
        borderRadius: '20px',
        padding: '3px',
        margin: '3px',
        top: isMinimized ? '-203px' : 'auto',
        right: isMinimized ? '-587%' : 'auto',
        width: isMinimized ? '200px' : '22.88%',
        height: isMinimized ? '80px' : '66%',
        maxWidth: '1000px',
        maxHeight: '600px',
      
        // Add media queries for responsive behavior
        '@media (max-width: 1200px)': {
          width: isMinimized ? '180px' : '25%',
          height: isMinimized ? '70px' : '60%',
          maxWidth: '900px',
          maxHeight: '550px',
          top: isMinimized ? '-180px' : 'auto',
          right: isMinimized ? '-600px' : 'auto',
        },
        '@media (max-width: 768px)': {
          width: isMinimized ? '150px' : '40%',
          height: isMinimized ? '60px' : '50%',
          maxWidth: '700px',
          maxHeight: '500px',
          top: isMinimized ? '-160px' : 'auto',
          right: isMinimized ? '-550px' : 'auto',
        },
        '@media (max-width: 480px)': {
          width: isMinimized ? '120px' : '70%',
          height: isMinimized ? '50px' : '40%',
          maxWidth: '400px',
          maxHeight: '400px',
          top: isMinimized ? '-140px' : 'auto',
          right: isMinimized ? '-500px' : 'auto',
        },
      };


      
    return (
        <div>
            {isOpen && (
                <div
                    ref={popupRef}
                    className={`position-fixed ${isMinimized ? '' : 'top-0 start-0 end-0 bottom-0'} d-flex justify-content-center align-items-center`}
                    style={{
                        zIndex: 99999,
                    }}
                >
                    <div
                     style={styles}
                    >
                        <button
                            className="btn btn-danger position-absolute"
                            style={{
                                top: '15px',
                                left: '10px',
                                height: "40px",
                                borderRadius: "50%",
                                zIndex: 100001
                            }}
                            onClick={toggleMinimize}
                        >
                            {isMinimized ? <i className="fa-solid fa-window-maximize"></i> : <i className="fa-solid fa-window-minimize"></i>}
                        </button>
                        {isLoading && (
                            <div className="d-flex justify-content-center align-items-center"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '20px',
                                    zIndex: 100000
                                }}
                            >
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <span>Loading......</span>
                            </div>
                        )}
                        <iframe
                            src="https://omnicx.hoducc.com/Agent_plugin/"
                            allow="geolocation; microphone; camera"
                            id="HoduCCPluginIFrame"
                            style={{
                                border: 'none',
                                borderRadius:"15px",
                                width: '96.5%',
                                height: '98.5%',
                            }}
                            allowFullScreen
                            onLoad={() => setIsLoading(false)} // Set loading to false when iframe loads
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingButton;