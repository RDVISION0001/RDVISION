import React, { useState } from 'react';
import axiosInstance from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function FeatureControl() {
    const [isOn, setIsOn] = useState(false);

    const handleFeature = async () => {
        const newStatus = !isOn ? 'ON' : 'OFF';
        try {
            await axiosInstance.get('user/autoAssign');
            setIsOn(!isOn);
            toast.success(`Feature turned ${newStatus} successfully!`);
        } catch (error) {
            console.error('Error toggling feature:', error);
            toast.error('Failed to toggle the feature.');
        }
    };

    return (
        <div className="d-flex align-items-center p-3 justify-content-end p-4">
            <div className='bg-info px-4 py-2'>
                <span className="me-3 fw-bold text-white">Auto Assign Feature</span>
                <button
                    className={`btn rounded ${isOn ? 'btn-success' : 'btn-danger'}`}
                    onClick={handleFeature}
                >
                    {isOn ? 'ON' : 'OFF'}
                </button>
            </div>
            <ToastContainer />
        </div>
    );
}

export default FeatureControl;
