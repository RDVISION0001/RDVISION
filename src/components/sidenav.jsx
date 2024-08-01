import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, NavLink } from 'react-router-dom';
import Logout from '../auth/logout';

function Sidenav() {
  const { roleName, firstName, lastName } = useAuth();

  useEffect(() => {
    const menuBtn = document.querySelector("#menu-btn");
    const sidebar = document.querySelector("#sidebar");
    const container = document.querySelector(".my-container");

    if (!menuBtn || !sidebar || !container) {
      console.error('One or more elements are not found in the DOM');
      return;
    }

    function checkViewportSize() {
      if (window.innerWidth < 992) {
        sidebar.classList.remove("active-nav");
        container.classList.remove("active-cont");
      } else {
        sidebar.classList.add("active-nav");
        container.classList.add("active-cont");
      }
    }

    checkViewportSize();

    const handleMenuClick = () => {
      sidebar.classList.toggle("active-nav");
      container.classList.toggle("active-cont");
    };

    const handleResize = () => {
      checkViewportSize();
    };

    menuBtn.addEventListener("click", handleMenuClick);
    window.addEventListener("resize", handleResize);

    return () => {
      menuBtn.removeEventListener("click", handleMenuClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
                {firstName} {lastName}
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
                {firstName} {lastName}
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
              <NavLink to="/admin_to_everyone" className="nav-link">
              <i className="fa-solid fa-user"></i>
                <span className="nav-text">To Everyone</span>
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
              <NavLink to="/admin_upload_tickets" className="nav-link">
              <i class="fa fa-upload" aria-hidden="true"></i>
                <span className="nav-text">Upload Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_upload_products" className="nav-link">
              <i class="fa-solid fa-file"></i>
                <span className="nav-text">Upload Products</span>
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
          </>
        )}

        {/* closer */}
        {roleName === 'Closer' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName} {lastName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/closer_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/closer_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/closer_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="/closer_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </NavLink>
            </li> */}
          </>
        )}

        {/* captain/Manager */}
        {roleName === 'Captain' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName} {lastName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_to_closer" className="nav-link">
                <i className="fa-solid fa-people-group"></i>
                <span className="nav-text">To Closer</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </NavLink>
            </li>
          </>
        )}

        {/*senior_supervisor*/}
        {roleName === 'SeniorSuperVisor' && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                {firstName} {lastName}
                <small className="d-block">{roleName}</small>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/senior_supervisor_index" className="nav-link">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/senior_supervisor_to_captain" className="nav-link">
                <i className="fa-solid fa-user"></i>
                <span className="nav-text">To Captain</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/senior_supervisor_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/senior_supervisor_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
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
          <Link className="nav-link">
            <i className="fa-solid fa-power-off text-danger"></i>
            <span className="nav-text cursor-pointer"><Logout/></span>
          </Link>
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
