import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

const DigitalClock = ({ timezone, country }) => {
    const [time, setTime] = useState(moment.tz(timezone));
    const indianTime = moment.tz('Asia/Kolkata');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment.tz(timezone));
        }, 1000);
        return () => clearInterval(interval);
    }, [timezone]);

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

const AnalogClock = ({ timezone }) => {
    const [time, setTime] = useState(moment.tz(timezone).toDate());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment.tz(timezone).toDate());
        }, 1000);
        return () => clearInterval(interval);
    }, [timezone]);

    return (
        <div className="d-flex flex-column align-items-center">
            <Clock value={time} size={150} renderNumbers={true} />
        </div>
    );
};

const TimezoneClocks = () => {
    // Define timezones and countries
    const clocks = [
        { timezone: 'Asia/Kolkata', country: 'India' },
        { timezone: 'America/New_York', country: 'US' },
        { timezone: 'Europe/London', country: 'UK' },
        { timezone: 'Australia/Sydney', country: 'AU' },
    ];

    return (
        <div className="d-flex flex-wrap justify-content-start gap-4">
            {clocks.map((clock, index) => (
                <div key={index} className="d-flex flex-column align-items-center">
                    {/* <AnalogClock timezone={clock.timezone} /> */}
                    <div style={{ marginTop: '1rem' }}> {/* Add space here */}
                        <DigitalClock timezone={clock.timezone} country={clock.country} />
                    </div>
                </div>
            ))}
        </div>

    );
};

export default TimezoneClocks;
