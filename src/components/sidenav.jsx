import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';




function Sidenav() {
  const { roleName, firstName } = useAuth();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (roleName === 'SuperAdmin') {
  //     navigate('/super_admin_index');
  //   } else if (roleName === 'Admin') {
  //     navigate('/admin_index');
  //   } else if (roleName === 'Agent') {
  //     navigate('/agent_index');
  //   } else if (roleName === 'Manager') {
  //     navigate('/manager_index');
  //   }
  // }, [roleName, navigate]);

  return (
    <div className="side-navbar active-nav d-flex justify-content-between flex-wrap flex-column" id="sidebar">
      <ul className="nav sidebar2658 flex-column w-100">

        {/* SuperAdmin */}
        {roleName === 'SuperAdmin' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_users" className="nav-link">
                <i className="fa-solid fa-people-group"></i>
                <span className="nav-text">Users</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_orders" className="nav-link">
                <i className="fa-solid fa-money-check-dollar"></i>
                <span className="nav-text">Orders Status</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Admin */}
        {roleName === 'Admin' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_users" className="nav-link">
                <i className="fa-solid fa-people-group"></i>
                <span className="nav-text">Users</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_orders" className="nav-link">
                <i className="fa-solid fa-money-check-dollar"></i>
                <span className="nav-text">Orders Status</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Agent */}
        {roleName === 'Agent' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/agent_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="/agent_users" className="nav-link">
                <i className="fa-solid fa-people-group"></i>
                <span className="nav-text">Users</span>
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to="/agent_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/agent_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/agent_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/agent_orders" className="nav-link">
                <i className="fa-solid fa-money-check-dollar"></i>
                <span className="nav-text">Orders Status</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Manager */}
        {roleName === 'Manager' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/manager_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager_users" className="nav-link">
                <i className="fa-solid fa-people-group"></i>
                <span className="nav-text">Team</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager_orders" className="nav-link">
                <i className="fa-solid fa-money-check-dollar"></i>
                <span className="nav-text">Orders Status</span>
              </NavLink>
            </li>
          </>
        )}

        {/* <li className="nav-item">
          <NavLink to="/settings" className="nav-link">
            <i className="fa-solid fa-gear"></i>
            <span className="nav-text">Settings</span>
          </NavLink>
        </li> */}
        <li className="nav-item">
          <NavLink to="/" className="nav-link">
            <i className="fa-solid fa-power-off text-danger"></i>
            <span className="nav-text">Log Out</span>
          </NavLink>
        </li>
      </ul>
      <div className="userIP-wrapper">
        <small>Your IP</small>
        <p className="m-0">https://127.2.2.225</p>
      </div>
    </div>
  );
}

export default Sidenav;
