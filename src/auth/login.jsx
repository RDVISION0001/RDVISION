import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import './login.css';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function login() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleKeyDown = (event) => {
    handleKeyDownEnter(event);
    setIsCapsLockOn(event.getModifierState("CapsLock"));
  };

  const handleKeyDownEnter = (event) => {
    if (event.key === 'Enter') {
      sendOtp();
    }
  };

  const handleKeyDownEnterLogin = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const status = await login(email, password, otp);
      navigateBasedOnRole(status);
      window.location.reload();
    } catch (error) {
      setError('Login failed');
      setLoading(false);
    }
    setLoading(false);
  };

  const navigateBasedOnRole = (status) => {
    if (localStorage.getItem("workTime") === null) {
      localStorage.setItem("workTime", 0);
    }
    if (localStorage.getItem("breakTime") === null) {
      localStorage.setItem("breakTime", 0);
    }
    const routes = {
      Closer: "/closer_index",
      Admin: "/admin_index",
      Captain: "/captain_index",
      SeniorSuperVisor: "/senior_supervisor_index",
      SuperAdmin: "/super_admin_index",
      Product_Coordinator: "/upload_products",
    };
    if (routes[status]) navigate(routes[status]);
  };

  const passwordWrong = () => toast("Password is incorrect");
  const otpHasSent = () => toast.success('OTP has been sent to your email!');

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/generateOtp', { email, password });
      setOtpSent(true);
      otpHasSent();
    } catch (err) {
      passwordWrong();
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const status = localStorage.getItem("roleName") || "";
    if (localStorage.getItem("userId")) navigateBasedOnRole(status);
  }, []);

  return (
    <section className="h-100 gradient-form">
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
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="Email address"
                        />
                        <label className="form-label">Email</label>
                      </div>

                      <div data-mdb-input-init className="form-outline mb-4">
                        <input
                          type="password"
                          value={password}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control"
                          placeholder="Password"
                        />
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label">Password</label>
                          {isCapsLockOn && <span className="text-danger fw-bold">Caps Lock is ON</span>}
                        </div>
                      </div>

                      {otpSent && (
                        <>
                          <label className="d-flex justify-content-center">Enter OTP</label>
                          <div className="form-outline mb-4">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              onKeyDown={handleKeyDownEnterLogin}
                              maxLength="6"
                              className="form-control"
                              placeholder="Enter 6-digit OTP"
                            />
                          </div>
                        </>
                      )}

                    </form>
                    <div className="text-center pt-1 mb-5 pb-1">
                      {otpSent ? (
                        loading ? (
                          <div className='d-flex justify-content-center'><div className='loader'></div></div>
                        ) : (
                          <button className="btn btn-danger" onClick={handleSubmit}>Login</button>
                        )
                      ) : (
                        loading ? (
                          <div className='d-flex justify-content-center'><div className='loader'></div></div>
                        ) : (
                          <button className="btn btn-danger" onClick={sendOtp}>Request Otp</button>
                        )
                      )}
                      {otpSent && <button className="btn btn-danger" style={{ marginLeft: "10px" }} onClick={sendOtp}>Resend Otp</button>}
                    </div>
                    <div className='custom-navlink'><NavLink to="/forgot_password">Forgot Password</NavLink></div>
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
