import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserReport = () => {
    const users = [
        {
            name: 'Will',
            imgSrc: 'https://via.placeholder.com/50', // Replace with actual image
            hbr: '$30,460',
            netHBR: '$93,460',
            newAccounts: 528,
            demoCalls: 340,
            exp: 93,
        },
        {
            name: 'Chuck',
            imgSrc: 'https://via.placeholder.com/50', // Replace with actual image
            hbr: '$16,460',
            netHBR: '$68,260',
            newAccounts: 214,
            demoCalls: 120,
            exp: 82,
        },
        {
            name: 'Vin',
            imgSrc: 'https://via.placeholder.com/50', // Replace with actual image
            hbr: '$17,964',
            netHBR: '$85,964',
            newAccounts: 120,
            demoCalls: 60,
            exp: 75,
        },
        {
            name: 'Katy',
            imgSrc: 'https://via.placeholder.com/50', // Replace with actual image
            hbr: '$12,528',
            netHBR: '$63,528',
            newAccounts: 180,
            demoCalls: 27,
            exp: 100,
        },
        {
            name: 'David',
            imgSrc: 'https://via.placeholder.com/50', // Replace with actual image
            hbr: '$4,178',
            netHBR: '$50,178',
            newAccounts: 98,
            demoCalls: 34,
            exp: 100,
        },
        {
            name: 'Adam',
            imgSrc: 'https://via.placeholder.com/50', // Replace with actual image
            hbr: '$4,897',
            netHBR: '$45,897',
            newAccounts: 88,
            demoCalls: 39,
            exp: 95,
        },
    ];

    return (
        <div className="container my-5">
            <div className="row">
                {users.map((user, index) => (
                    <div key={index} className="col-md-4 col-lg-2 mb-4">
                        <div className="card user-card text-center p-3">
                            <img src={user.imgSrc} alt={user.name} className="user-img mb-2 mx-auto d-block" />
                            <h5>{user.name}</h5>
                            <p>New HBR: <strong>{user.hbr}</strong></p>
                            <p>Net HBR: <strong>{user.netHBR}</strong></p>
                            <div className="progress mb-2">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${user.exp}%` }}
                                >
                                    {user.exp}%
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <p>New Accounts</p>
                                    <p><strong>{user.newAccounts}</strong></p>
                                </div>
                                <div className="col-6">
                                    <p>Demo Calls</p>
                                    <p><strong>{user.demoCalls}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



export default UserReport