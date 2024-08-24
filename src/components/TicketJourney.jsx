import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';

const TicketJourney = (props) => {
    const [stages, setStages] = useState([]);

    useEffect(() => {
        axiosInstance.get(`/history/getByTicketId/${props.tktid}`).then((response) => {
            setStages(response.data);
        });
    }, [props.tktid]);



    return (
        <div className="container mt-5 text-black bg-white p-5">
            <div className='d-flex justify-content-end'>
                <i
                    className="fas fa-times pointer"
                    style={{
                        fontSize: '25px',
                        color: '#333',
                        transition: 'all 0.1s ease', // Smooth transition for all changes
                        transform: 'scale(1)',
                        cursor: "pointer"// Default scale
                    }}
                    onClick={props.closeFun}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                ></i>
            </div>


            {stages.length>0?
                <ul class="events ">
                    {stages.slice().reverse().map((stage, index) => (
                        <li className='text-primary'>
                            <time datetime="10:03">{(stage.updateDate)[2]}-{(stage.updateDate)[1]}-{(stage.updateDate)[0]}</time>
                            <span><strong>{(stage.updateTime)[0]}:{(stage.updateTime)[1]} &amp; {stage.comment}</strong> {stage.userName}</span>
                        </li>
                    ))}


                </ul>:<div> No data</div>
            }
        </div>
    );
};

export default TicketJourney;
