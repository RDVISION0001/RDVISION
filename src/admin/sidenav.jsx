import React from 'react'

function sidenav() {
  return (
   <>
   
   {/* <!-- Side-Nav --> */}
   <div className="side-navbar active-nav d-flex justify-content-between flex-wrap flex-column" id="sidebar">
          <ul className="nav sidebar2658 flex-column w-100">
            <li className="nav-item d-flex align-items-center user-logo">
              <div className="profile-icon">
                <i className="fa-solid fa-display"></i>
              </div>
              <a href="#" className="nav-link h3 my-2 w-100 d-block">
                Super Admin
                <small className="d-block">UID: DIGVijay</small>
              </a>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link active">
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className="nav-text">Dashboard</span></a
              >
            </li>
            <li className="nav-item">
              <a href="/admin_users" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">User Management</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin_tickets" className="nav-link">
                <i className="fa-solid fa-ticket"></i>
                <span className="nav-text">Tickets</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin_invoices" className="nav-link">
                <i className="fa-regular fa-address-card"></i>
                <span className="nav-text">Invoices</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin_sales" className="nav-link">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className="nav-text">Sale's Status</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin_orders" className="nav-link">
                <i className="fa-solid fa-money-check-dollar"></i>
                <span className="nav-text">Orders Status</span>
              </a>
            </li>
          </ul>

          <span href="#" className="nav-items w-100 sidebar2658">
            <ul className="nav flex-column nav-links-wrapper">
              <li className="nav-item">
                <a className="nav-link" href=""><i className="fa-solid fa-gear"></i> Settings</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href=""><i className="fa-solid fa-power-off text-danger"></i> Log Out</a>
              </li>
            </ul>
            <div className="userIP-wrapper">
              <small>Your IP</small>
              <p className="m-0">https://127.2.2.225</p>
            </div>
          </span>
        </div>
   </>
  )
}

export default sidenav