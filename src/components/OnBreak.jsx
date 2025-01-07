import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function OnBreak() {
    const { setTakingBreak } = useAuth();
    const [seconds, setSeconds] = useState(0);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const handleEndBreak = () => {
        setTakingBreak(false);
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center  bg-light m-0">
            {/* Break alert */}
            <div className="text-center w-100 bg-danger text-white rounded p-4 shadow-lg">
                <h1 className="mb-3 fw-bold">You Are On a Break</h1>
                <p className="fs-5 mb-3">Take a moment to recharge!</p>
                <div
                    className="display-4 fw-bold bg-white text-danger py-2 px-4 rounded-pill shadow-sm"
                >
                    Break Time: {seconds}s
                </div>
                <button
                className="btn btn-danger border border-white btn-lg mt-4 shadow"
                onClick={handleEndBreak}
            >
                End Break
            </button>
            </div>

        </div>
    );
}

export default OnBreak;
