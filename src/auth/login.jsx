import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './login.css'
import axios from 'axios';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function login() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false)
  const [password, setPassword] = useState('');
  const [logInOtp, setOtp] = useState();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyDown = (event) => {
    handleKeyDownEnter(event)
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      sendOtp()
    }
  };
  const handleKeyDownEnterLogin = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event)
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const status = await login(email, password, logInOtp);
      console.log("Status is ", status)
      if (status === "Closer") {
        navigate("/closer_index")
      } else if (status === "Admin") {
        navigate("/admin_index")
      } else if (status === "Captain") {
        navigate("/captain_index")
      } else if (status === "SeniorSuperVisor") {
        navigate("/senior_supervisor_index")
      } else if (status === "SuperAdmin") {
        navigate("/super_admin_index")
      }
      window.location.reload()


    } catch (error) {
      setError('Login failed');
      setLoading(false)
    }
    setLoading(false)
  };
  const passwordWrong = () => toast("Password is incorrect")
  const otpHasSent = () => toast.success('OTP has been sent to your email!');
  const sendOtp = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/auth/generateOtp', { email, password })
      setOtpSent(true)
      otpHasSent()
    } catch (err) {
      passwordWrong()
      setLoading(false)
    }
    setLoading(false)

  }
  console.log(isCapsLockOn ? "Caps Lock is on" : "caps lock if off")
  return (
    <section className="h-100 gradient-form" >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">

                    <div className="text-center">
                      <h4 className="mt-1 mb-5 pb-1">Login</h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <p>Please login to your account</p>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          id="form2Example11" className="form-control"
                          placeholder="Phone number or email address" />
                        <label className="form-label" for="form2Example11">Email</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input type="password"
                          value={password}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setPassword(e.target.value)}
                          id="form2Example22" className="form-control"
                          placeholder="********" />
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label" htmlFor="form2Example22">Password</label>
                          {isCapsLockOn ? <label className="text-danger fw-bold" style={{ fontSize: '0.875rem' }}>
                            Caps Lock is ON
                          </label> : ""}
                        </div>

                      </div>

                      {/* <div className='custom-navlink'><NavLink className="" to="/forgot_password">
                        Forgot Password
                      </NavLink></div> */}

                      {otpSent ? <div data-mdb-input-init className="form-outline mb-4">
                        <input type="password"
                          value={logInOtp}
                          onChange={(e) => setOtp(e.target.value)}
                          id="form2Example23" className="form-control"
                          onKeyDown={handleKeyDownEnterLogin}
                          placeholder="********" />
                        <label className="form-label" for="form2Example22">Enter Otp</label>
                      </div> : null}



                      {/* 
                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-danger">Create new</button>
                      </div> */}

                    </form>
                    <div className="text-center pt-1 mb-5 pb-1">
                      {
                        otpSent ? loading ? <div className='d-flex justify-content-center'><div className='loader '></div></div> : <button data-mdb-button-init data-mdb-ripple-init className="btn btn-danger"
                          onClick={handleSubmit}> Login</button> : loading ? <div className='d-flex justify-content-center'><div className='loader '></div></div> :
                          <button data-mdb-button-init data-mdb-ripple-init className="btn btn-danger"
                            onClick={sendOtp}> Request Otp</button>
                      }

                    </div>
                    <div className='custom-navlink'><NavLink className="" to="/forgot_password">
                      Forgot Password
                    </NavLink></div>

                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">Welcome to RD Vision CRM</h4>
                    <p className="small mb-0"> Your gateway to enhanced customer
                      relationships and business success. Our platform is designed to
                      provide you with all the tools you need to manage your customer
                      interactions efficiently and effectively. From daily insights to
                      keep you updated with the latest information, to comprehensive customer
                      profiles that ensure you provide the most personalized service possible,
                      we've got you covered. Our integrated task manager helps you stay on top of
                      your to-do list,ensuring you never miss a follow-up or important deadline.
                      Additionally, our robust reporting tools offer detailed analytics to track your
                      progress and make informed decisions that drive your business forward.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default login;
