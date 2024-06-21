
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './login.css'


function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/sidenav');
    } catch (error) {
      setError('Login failed');
    }
  };

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
                          onChange={(e) => setPassword(e.target.value)}
                          id="form2Example22" className="form-control"
                          placeholder="********" />
                        <label className="form-label" for="form2Example22">Password</label>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button data-mdb-button-init data-mdb-ripple-init className="btn btn-danger"
                          type="submit"> Login</button>
                        {/* <a className="text-muted" href="#!">Forgot password?</a> */}
                      </div>
                      {/* 
                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-danger">Create new</button>
                      </div> */}

                    </form>

                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">We are more than just a company</h4>
                    <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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
