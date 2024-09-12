import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axiosInstance';
import { NavLink, useNavigate } from 'react-router-dom';

function forgotpassword() {
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const emptyEmailAlert = () => toast.info("Please Enter your Email");
    const userNotFound = () => toast.info("Your email is not Registered");
    const serverError = () => toast.error("Server Not Responding");
    const sentOtp = () => toast.success("Otp has been sent to your email");

    const handleSendOtp = async () => {
        setLoading(true);
        if (userDetails.email.length === 0) {
            emptyEmailAlert();
        } else {
            try {
                const response = await axiosInstance.get(`auth/otpForPassword/${userDetails.email}`);
                console.log(response.data);
                sentOtp();
                setOtpSent(true);
            } catch (err) {
                console.log(err.message);
                if (err.message === "Request failed with status code 400") {
                    userNotFound();
                } else if (err.message === "Network Error") {
                    serverError();
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOtpChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === "") {
            const updatedOtp = [...otp];
            updatedOtp[index] = value;
            setOtp(updatedOtp);
        }

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleOnChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        });
    };
    // Resetting password
    const handleResetPassword = async () => {
        setLoading(true);
        const otpString = otp.join("");
        if (userDetails.newPassword !== userDetails.confirmPassword) {
            toast.error("Passwords do not match!");
        } else if (otpString.length < 6) {
            toast.error('OTP is incomplete!');
        } else if (userDetails.newPassword.length === 0) {
            toast.error("Password cannot be empty");
        } else {
            try {
                const response = await axiosInstance.post("auth/forgotPassword", {
                    ...userDetails,
                    otp: otpString
                });
                if (response.data === "Otp is incorrect") {
                    toast.error(response.data);
                } else {
                    toast.success(response.data);
                    navigate("/");
                }
            } catch (err) {
                toast.error("Some Error Occurs");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className='d-flex flex-column justify-content-center align-items-center min-vh-100'>
            <div className='card p-4' style={{ width: '400px' }}>
                <h3 className='text-center mb-4'>Reset Password</h3>

                <div>
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email</label>
                        <input
                            onChange={handleOnChange}
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className='custom-navlink'>
                        <NavLink to="/">Sign-in</NavLink>
                    </div>
                    {!otpSent && (
                        loading ? <div className='d-flex justify-content-center'><div className='loader'></div></div> :
                            <button className='btn btn-danger w-100' onClick={handleSendOtp}>
                                Send OTP
                            </button>
                    )}
                </div>

                {otpSent && (
                    <div>
                        <div className='mb-3'>
                            <label className='d-flex justify-content-center'>Enter OTP</label>
                            <div className='d-flex justify-content-between'>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type='text'
                                        maxLength='1'
                                        className='form-control otp-input'
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        style={{ width: '50px', textAlign: 'center' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='newPassword' className='form-label'>New Password</label>
                            <input
                                onChange={handleOnChange}
                                type='password'
                                className='form-control'
                                id='newPassword'
                                name='newPassword'
                                placeholder='Enter new password'
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmPassword' className='form-label'>Confirm New Password</label>
                            <input
                                onChange={handleOnChange}
                                type='password'
                                className='form-control'
                                id='confirmPassword'
                                name='confirmPassword'
                                placeholder='Confirm new password'
                                required
                            />
                        </div>
                        {loading ? <div className='d-flex justify-content-center'><div className='loader'></div></div> :
                            <button className='btn btn-danger w-100' onClick={handleResetPassword}>
                                Reset Password
                            </button>}
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}
export default forgotpassword