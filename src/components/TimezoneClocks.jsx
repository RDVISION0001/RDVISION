import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

const DigitalClock = ({ timezone, country }) => {
    const [time, setTime] = useState(moment.tz(timezone));
    const indianTime = moment.tz('Asia/Kolkata');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment.tz(timezone));
        }, 1000);
        return () => clearInterval(interval);
    }, [timezone]);

    // Use 'hh:mm:ss A' for 12-hour format with AM/PM
    const digitalTime = time.format('hh:mm:ss A');
    const timeDifference = (time.utcOffset() - indianTime.utcOffset()) / 60; // Difference in hours

    return (
        <div className="d-flex flex-column align-items-center text-center shadow-sm bg-white rounded">
            <div className="text-black" style={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                {digitalTime}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {country}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                {timeDifference >= 0 ? `+${timeDifference}` : `${timeDifference}`} hours from IST
            </div>
        </div>
    );
};

const TimezoneClocks = () => {
    return (
        <div className="d-flex justify-content-start gap-4">
            <DigitalClock timezone="Asia/Kolkata" country="India" />
            <DigitalClock timezone="America/New_York" country="US" />
            <DigitalClock timezone="Europe/London" country="UK" />
            <DigitalClock timezone="Australia/Sydney" country="AU" />
        </div>
    );
};

export default TimezoneClocks;
