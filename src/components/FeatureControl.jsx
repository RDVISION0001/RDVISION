import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';

function FeatureControl() {
    const [isOn, setIsOn] = useState(false);
    useEffect(() => {
        fetchStatus()
    }, [])

    const fetchStatus = () => {
        axiosInstance.get('user/getAutoStatus').then((response) => {
            setIsOn(response.data)

        })
    }
    const handleFeature = async () => {
        const response = await axiosInstance.put('user/autoAssign');
        if (!isOn) {
            toast.info("Auto assign feature is enabled")
        } else {
            toast.info("Auto assign feature is disabled")
        }
        fetchStatus()
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