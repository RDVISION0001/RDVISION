import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import play from '../assets/icons/play.png';
import pause from '../assets/icons/pause.png';

const TicketJourney = (props) => {
    const [stages, setStages] = useState([]);
    const [audio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSrc, setCurrentSrc] = useState('');

    useEffect(() => {
        axiosInstance.get(`/history/getByTicketId/${props.tktid}`).then((response) => {
            setStages(response.data);
        });
    }, [props.tktid]);

    const playRecording = (src) => {
        src = src.replace(/"/g, '');
        console.log(src);
        if (currentSrc !== src) {
            audio.pause(); // Pause the current audio if a different source is selected
            audio.src = src;
            setCurrentSrc(src);
            audio.play();
            setIsPlaying(true);
        } else {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    useEffect(() => {
        audio.addEventListener('ended', () => setIsPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, [audio]);

    

    return (
        <div className="container mt-5 text-black bg-white p-5">
            <div className='d-flex justify-content-end'>
                <i
                    className="fas fa-times pointer"
                    style={{
                        fontSize: '25px',
                        color: '#333',
                        transition: 'all 0.1s ease',
                        transform: 'scale(1)',
                        cursor: "pointer"
                    }}
                    onClick={props.closeFun}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    aria-label="Close"
                ></i>
            </div>
            <ul className="events" style={{ maxHeight: '50vh', width: '65vw', overflowY: 'auto' }}>
                {stages.slice().reverse().map((stage, index) => (
                    <li className="text-primary" key={index}>
                        <time dateTime={`${stage.updateDate[0]}-${stage.updateDate[1]}-${stage.updateDate[2]}`}>
                            {stage.updateDate[2]}-{stage.updateDate[1]}-{stage.updateDate[0]}
                        </time>
                        <span style={{ display: 'flex', alignItems: 'center' }} className='d-flex justify-content-center align-item-center'>
                            <strong style={{ marginRight: '10px' }}>
                                {stage.updateTime[0]}:{stage.updateTime[1]} &amp; {stage.comment}
                                <div>{stage.userName}</div>
                            </strong>
                            <strong className={`text-danger`}>
                                {stage.recordingFile ? (
                                    <div
                                        onClick={() => playRecording(stage.recordingFile)}
                                        aria-label={isPlaying && currentSrc === stage.recordingFile.replace(/"/g, '') ? "Pause recording" : "Play recording"}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={isPlaying && currentSrc === stage.recordingFile.replace(/"/g, '') ? pause : play}
                                            alt={isPlaying && currentSrc === stage.recordingFile ? "Pause icon" : "Play icon"}
                                            width={40}
                                            height={40}
                                            className="img-fluid play-pause-icon"
                                        />
                                    </div>
                                ) : "Recording not Available"}
                            </strong>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketJourney;
