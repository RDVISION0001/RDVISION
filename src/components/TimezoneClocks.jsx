import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import './css/AnalogClock.css';

const AnalogClock = ({ timezone, country }) => {
    const [time, setTime] = useState(moment.tz(timezone));
    const indianTime = moment.tz('Asia/Kolkata');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment.tz(timezone));
        }, 1000);
        return () => clearInterval(interval);
    }, [timezone]);

    const hours = time.hours() % 12;
    const minutes = time.minutes();
    const seconds = time.seconds();
    const digitalTime = time.format('HH:mm:ss');
    const timeDifference = time.utcOffset() - indianTime.utcOffset();

    const hourStyle = {
        transform: `rotate(${hours * 30 + minutes / 2}deg)`
    };
    const minuteStyle = {
        transform: `rotate(${minutes * 6}deg)`
    };
    const secondStyle = {
        transform: `rotate(${seconds * 6}deg)`
    };

    return (
        <div className="clock-container">
            <div className="clock">
                <div className="clock-face">
                    <div className="hand hour" style={hourStyle} />
                    <div className="hand minute" style={minuteStyle} />
                    <div className="hand second" style={secondStyle} />
                </div>
            </div>
            <div className="digital-time">{digitalTime}</div>
            <div className="timezone">{timezone}</div>
            <div className="time-difference">
                {timeDifference >= 0 ? `+${timeDifference / 60} hours` : `${timeDifference / 60} hours`} from IST
            </div>
            <div className="country-name">{country}</div>
        </div>
    );
};

const TimezoneClocks = () => {
    return (
        <div className="timezone-clocks d-flex">
            <AnalogClock timezone="America/New_York" country="United States" /> {/* US Time */}
            <AnalogClock timezone="Europe/London" country="United Kingdom" /> {/* UK Time */}
            <AnalogClock timezone="Australia/Sydney" country="Australia" /> {/* Australia Time */}
        </div>
    );
};

export default TimezoneClocks;
