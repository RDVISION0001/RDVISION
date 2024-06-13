import React from 'react'



function indexx() {
    return (
        <>
            <div className="superadmin-page">
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
                            <a href="index.html" className="nav-link active">
                                <i className="fa-solid fa-chalkboard fa-fw"></i>
                                <span className="nav-text">Dashboard</span></a
                            >
                        </li>
                        <li className="nav-item">
                            <a href="users.html" className="nav-link">
                                <i className="fa-solid fa-ticket"></i>
                                <span className="nav-text">User Management</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="tickets.html" className="nav-link">
                                <i className="fa-solid fa-ticket"></i>
                                <span className="nav-text">Tickets</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="invoices.html" className="nav-link">
                                <i className="fa-regular fa-address-card"></i>
                                <span className="nav-text">Invoices</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="sales.html" className="nav-link">
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                <span className="nav-text">Sale's Status</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="orders.html" className="nav-link">
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
                {/* <!-- Main Wrapper --> */}
                <div className="my-container main-content-block2658 active-cont">
                    {/* <!-- Top Nav --> */}
                    <nav className="navbar top-navbar navbar-light bg-white container-fluid">
                        <div className="left-part">
                            <a className="btn border-0 ms-2" id="menu-btn"><i className="fa-solid fa-bars"></i></a>
                            <span className="page-title">Dashboard</span>
                        </div>
                        <div className="right-part">
                            <div className="global-search">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type="text" name="search" id="globalSearch" className="form-control" placeholder="Search" />
                            </div>
                            <a href="#" className="notification">
                                <i className="fa-solid fa-bell"></i>
                            </a>
                        </div>
                    </nav>
                    {/* <!--End Top Nav --> */}
                    <div className="container-fluid mt-3">
                        {/* <!-- Section one --> */}
                        <section className="sadmin-top-section">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Total Sales</h3>
                                                <span className="sales">$3,181 <span className="indicators">+55%</span></span>
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Total Sales</h3>
                                                <span className="sales">$3,181 <span className="indicators">+55%</span></span>
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Total Sales</h3>
                                                <span className="sales">$3,181 <span className="indicators">+55%</span></span>
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card">
                                            <div className="div-top">
                                                <h3 className="title">Total Sales</h3>
                                                <span className="sales">$3,181 <span className="indicators">+55%</span></span>
                                            </div>
                                            <div className="icon-wrapper">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- graphs and ranking --> */}
                        <section className="map-and-rankings">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="graph-wrapper">
                                            <h3 className="title">Weekly Report</h3>
                                            <div id="map-container" className="highchart-wrapper" style="width: 100%; height: 100%; min-height: 555px"></div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="rank-card top-rankers">
                                            <h3 className="heading">Best Selling Teams</h3>
                                            <div className="table-wrapper">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div className="profile-wrapper">
                                                                    <img src="../img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                                </div>
                                                            </td>
                                                            <td>Flotsam</td>
                                                            <td>40k+ sales</td>
                                                            <td>$1.4m revenue</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="profile-wrapper">
                                                                    <img src="../img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                                </div>
                                                            </td>
                                                            <td>Flotsam</td>
                                                            <td>40k+ sales</td>
                                                            <td>$1.4m revenue</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="profile-wrapper">
                                                                    <img src="../img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                                </div>
                                                            </td>
                                                            <td>Flotsam</td>
                                                            <td>40k+ sales</td>
                                                            <td>$1.4m revenue</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/* <!-- best departments --> */}
                                        <div className="rank-card top-rankers">
                                            <h3 className="heading">Best Selling Department</h3>
                                            <div className="table-wrapper">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div className="profile-wrapper">
                                                                    <img src="../img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                                </div>
                                                            </td>
                                                            <td>Flotsam</td>
                                                            <td>40k+ sales</td>
                                                            <td>$1.4m revenue</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="profile-wrapper">
                                                                    <img src="../img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                                </div>
                                                            </td>
                                                            <td>Flotsam</td>
                                                            <td>40k+ sales</td>
                                                            <td>$1.4m revenue</td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="profile-wrapper">
                                                                    <img src="../img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                                                </div>
                                                            </td>
                                                            <td>Flotsam</td>
                                                            <td>40k+ sales</td>
                                                            <td>$1.4m revenue</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* <!-- section 2 --> */}
                        <section className="data-table-bgs_02x24 py-3">
                            <div className="container-fluid">
                                <div className="table-wrapper tabbed-table">
                                    <h3 className="title">Recent Transactions</h3>
                                    <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Transactions</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false">Pending</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false">New Raises</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                                        <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" className="" />
                                                            </th>
                                                            <th tabIndex="0">Name</th>
                                                            <th tabIndex="0">Ticket ID</th>
                                                            <th tabIndex="0">Type/Status</th>
                                                            <th tabIndex="0">Contact</th>
                                                            <th tabIndex="0">Email</th>
                                                            <th tabIndex="0">Description/Comment</th>
                                                            <th tabIndex="0">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status new">new</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status sale">sale</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" className="" />
                                                            </th>
                                                            <th tabIndex="0">Name</th>
                                                            <th tabIndex="0">Ticket ID</th>
                                                            <th tabIndex="0">Type/Status</th>
                                                            <th tabIndex="0">Contact</th>
                                                            <th tabIndex="0">Email</th>
                                                            <th tabIndex="0">Description/Comment</th>
                                                            <th tabIndex="0">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status new">new</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status sale">sale</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabIndex="0">
                                            <div className="tickets-table table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th className="selection-cell-header" data-row-selection="true">
                                                                <input type="checkbox" className="" />
                                                            </th>
                                                            <th tabIndex="0">Name</th>
                                                            <th tabIndex="0">Ticket ID</th>
                                                            <th tabIndex="0">Type/Status</th>
                                                            <th tabIndex="0">Contact</th>
                                                            <th tabIndex="0">Email</th>
                                                            <th tabIndex="0">Description/Comment</th>
                                                            <th tabIndex="0">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status new">new</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status sale">sale</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="selection-cell">
                                                                <input type="checkbox" className="" />
                                                            </td>
                                                            <td>John Skrew</td>
                                                            <td>#12548796</td>
                                                            <td><span className="status">old</span></td>
                                                            <td>+91 XXXXXXXX 90</td>
                                                            <td>****@gmail.com</td>
                                                            <td>Lorem ipsum dolor sit amet....</td>
                                                            <td className="action">
                                                                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- -------------- --> */}
                    </div>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal ticket-modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-3">
                                    <div className="heading-area">
                                        <div className="vertical-write">
                                            <h2 className="title">Jenell D. Matney</h2>
                                            <p className="ticket-id"><i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-9">
                                    <div className="main-content-area px-4">
                                        <div className="contact-info-row d-flex align-items-center justify-content-between">
                                            <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                                            <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                                        </div>
                                        <form action="#" className="form py-4">
                                            <div className="row g-3">
                                                <div className="col-sm-12">
                                                    <label htmlFor="flexRadioDefault">Payment Status</label>
                                                    <div className="d-flex gap-3 align-items-center py-2">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="payPending" />
                                                            <label className="form-check-label" htmlFor="payPending"> Pending </label>
                                                        </div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="payComplete" checked />
                                                            <label className="form-check-label" htmlFor="payComplete"> Completed </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-center border-0">
                            <div className="button-grp">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default indexx