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
    const [duration, setDuration] = useState('');
    const [currentTime, setCurrentTime] = useState('0:00'); // State for the current time of the audio
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axiosInstance.get(`/history/getByTicketId/${props.tktid}`).then((response) => {
            setStages(response.data);
            setLoading(false)
        });
    }, [props.tktid]);

    useEffect(() => {
        setLoading(true)
    }, [props.tktid]);
    const playRecording = (src) => {
        src = src.replace(/"/g, '');
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
        let interval = null;

        audio.addEventListener('loadedmetadata', () => {
            const minutes = Math.floor(audio.duration / 60);
            const seconds = Math.floor(audio.duration % 60);
            setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        });

        audio.addEventListener('timeupdate', () => {
            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        });

        audio.addEventListener('play', () => {
            interval = setInterval(() => {
                const minutes = Math.floor(audio.currentTime / 60);
                const seconds = Math.floor(audio.currentTime % 60);
                setCurrentTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            }, 1000);
        });

        audio.addEventListener('pause', () => {
            clearInterval(interval);
        });

        audio.addEventListener('ended', () => {
            clearInterval(interval);
            setIsPlaying(false);
            setCurrentTime('0:00'); // Reset the timer when audio ends
        });

        return () => {
            clearInterval(interval);
            audio.removeEventListener('loadedmetadata', () => { });
            audio.removeEventListener('timeupdate', () => { });
            audio.removeEventListener('play', () => { });
            audio.removeEventListener('pause', () => { });
            audio.removeEventListener('ended', () => { });
        };
    }, [audio]);




    return (
        <>
            <div style={{ borderRadius: "10px" }} className="container mt-5 text-black bg-white p-2 d-flex justify-content-center flex-column">
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
                <div className='d-flex justify-content-center'>
                    <span className="text-success fw-bold text-decoration-underline">
                        <span className='text-black'>Ticket Id</span> :- {props.tktid}
                    </span>
                </div>
                {loading ? <div className='d-flex justify-content-center'>Loading.....</div> : stages.length > 0 ? (
                    <ul className="events " style={{ maxHeight: '50vh', width: '95%', overflowY: 'auto' }}>
                        {stages.slice().reverse().map((stage, index) => (
                            <li className={`text-primary ${index % 2 === 0 ? "bg-light" : "bg-white"} `} key={index}>
                                <time dateTime={`${stage.updateDate[0]}-${stage.updateDate[1]}-${stage.updateDate[2]}`} style={{ width: "130px" }}>
                                    {stage.updateDate[2]}-{stage.updateDate[1]}-{stage.updateDate[0]}
                                </time>
                                <span style={{ display: 'flex', justifyContent: "space-between", width: "100%" }} >
                                    <strong >
                                        {stage.updateTime[0]}:{stage.updateTime[1]} &amp; {stage.comment}
                                        <div>{stage.userName}</div>
                                    </strong>
                                    <strong>
                                        {stage.recordingFile ? (
                                            <div className='m-4'
                                                onClick={() => playRecording(stage.recordingFile)}
                                                aria-label={isPlaying && currentSrc === stage.recordingFile.replace(/"/g, '') ? "Pause recording" : "Play recording"}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <img
                                                        src={isPlaying && currentSrc === stage.recordingFile.replace(/"/g, '') ? pause : play}
                                                        alt={isPlaying && currentSrc === stage.recordingFile ? "Pause icon" : "Play icon"}
                                                        width={40}
                                                        height={40}
                                                        className="img-fluid play-pause-icon"
                                                    />
                                                    {currentSrc === stage.recordingFile.replace(/"/g, '') && (
                                                        <div className='m-2'>
                                                            <div id='currentTime'>{currentTime} / {duration}</div> {/ Display the current time /}

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : <div className='text-danger'>Recording not Available</div>}
                                    </strong>
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className='d-flex justify-content-center mt-4'>No Data Available</div>
                )}
            </div>
        </>
    );
};

export default TicketJourney;
