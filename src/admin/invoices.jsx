import React from 'react';
import Topnav from '../Components/topnav';
import Sidenav from '../Components/sidenav';

function invoices() {
    return (
        <>
            <div className="superadmin-page">
                {/* <!-- Side-Nav --> */}
                <Sidenav />
                {/* <!-- Main Wrapper --> */}
                <div className="my-container main-content-block2658 active-cont">
                    {/* <!-- Top Nav --> */}
                    <Topnav />
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
                                                <span className="sales">0<span className="indicators">0%</span></span>
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
                                                <span className="sales">0<span className="indicators">0%</span></span>
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
                                                <span className="sales">0<span className="indicators">0%</span></span>
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
                                                <span className="sales">0<span className="indicators">0%</span></span>
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
                        <section className="orders-view-wrapper common-tab-view-section py-5">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-5">
                                        <div className="order-menu-wrapper">
                                            <div className="nav flex-column vertical-tab-nav" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                <button className="nav-link active" id="v-pills-ticket1-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket1" type="button" role="tab" aria-controls="v-pills-ticket1" aria-selected="true">
                                                    <div className="order-card">
                                                        <div className="left-part">
                                                            <h3 className="title">order name</h3>
                                                            <p className="sub-title text-warning-emphasis">
                                                                <i className="fa-solid fa-ticket"></i>
                                                                TKTID:MEDEQ089N
                                                            </p>
                                                        </div>
                                                        <div className="right-part">AT : <span className="badge new">New</span></div>
                                                    </div>
                                                </button>
                                                {/* <!-- ticket one ends here  --> */}
                                                <button className="nav-link" id="v-pills-ticket2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket2" type="button" role="tab" aria-controls="v-pills-ticket2" aria-selected="true">
                                                    <div className="order-card">
                                                        <div className="left-part">
                                                            <h3 className="title">order name</h3>
                                                            <p className="sub-title text-warning-emphasis">
                                                                <i className="fa-solid fa-ticket"></i>
                                                                TKTID:MEDEQ089N
                                                            </p>
                                                        </div>
                                                        <div className="right-part">AT : <span className="badge no-status">No Status</span></div>
                                                    </div>
                                                </button>
                                                {/* <!-- ticket two ends here  --> */}
                                                <button className="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                                                    <div className="order-card">
                                                        <div className="left-part">
                                                            <h3 className="title">order name</h3>
                                                            <p className="sub-title text-warning-emphasis">
                                                                <i className="fa-solid fa-ticket"></i>
                                                                TKTID:MEDEQ089N
                                                            </p>
                                                        </div>
                                                        <div className="right-part">AT : <span className="badge no-status">No status</span></div>
                                                    </div>
                                                </button>
                                                {/* <!-- another ticket ends here  --> */}
                                                <button className="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                                                    <div className="order-card">
                                                        <div className="left-part">
                                                            <h3 className="title">order name</h3>
                                                            <p className="sub-title text-warning-emphasis">
                                                                <i className="fa-solid fa-ticket"></i>
                                                                TKTID:MEDEQ089N
                                                            </p>
                                                        </div>
                                                        <div className="right-part">AT : <span className="badge hold">Hold</span></div>
                                                    </div>
                                                </button>
                                                {/* <!-- another ticket ends here  --> */}
                                                <button className="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                                                    <div className="order-card">
                                                        <div className="left-part">
                                                            <h3 className="title">order name</h3>
                                                            <p className="sub-title text-warning-emphasis">
                                                                <i className="fa-solid fa-ticket"></i>
                                                                TKTID:MEDEQ089N
                                                            </p>
                                                        </div>
                                                        <div className="right-part">AT : <span className="badge paid">Paid</span></div>
                                                    </div>
                                                </button>
                                                {/* <!-- another ticket ends here  --> */}
                                                <button className="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                                                    <div className="order-card">
                                                        <div className="left-part">
                                                            <h3 className="title">order name</h3>
                                                            <p className="sub-title text-warning-emphasis">
                                                                <i className="fa-solid fa-ticket"></i>
                                                                TKTID:MEDEQ089N
                                                            </p>
                                                        </div>
                                                        <div className="right-part">AT : <span className="badge sent">Sent</span></div>
                                                    </div>
                                                </button>
                                                {/* <!-- another ticket ends here  --> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-7">
                                        <div className="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                                            {/* <!-- tab one  --> */}
                                            <div className="tab-pane fade show active" id="v-pills-ticket1" role="tabpanel" aria-labelledby="v-pills-ticket1-tab" tabindex="0">
                                                <div className="order-cards-details-wrapper-main">
                                                    <div className="order-details-card">
                                                        <div className="header">
                                                            <p className="title">TKTID:MEDEQ089N</p>
                                                            <p className="date">03 Mar 2023</p>
                                                        </div>
                                                        <div className="card">
                                                            <div className="thumb-wrapper">
                                                                <img src="../img/thumb-img.png" alt="thumb-image" className="img-fluid" />
                                                            </div>
                                                            <div className="content-wrapper">
                                                                <h3 className="title">Lorem ipsum dolor, sit amet !</h3>
                                                                <div className="contact-wrapper">
                                                                    <div className="contact-item"><i className="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                                                    <div className="contact-item">
                                                                        <i className="fa-solid fa-envelope-open-text"></i>
                                                                        example@email.com
                                                                    </div>
                                                                </div>
                                                                <div className="address-items mt-2">
                                                                    <small>Billing Address</small>
                                                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                                                </div>
                                                                <div className="address-items">
                                                                    <small>Delivery Address</small>
                                                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <!-- ticket details ends here --> */}
                                                    <div className="accordion status-wrappers" id="accordionExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                                                            </h2>
                                                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="order-lists">
                                                                        <div className="items-wrapper">
                                                                            <div className="list-item header">
                                                                                <p className="title">Product Name</p>
                                                                                <p className="cost">$38.67</p>
                                                                            </div>
                                                                            <div className="list-item otr-list">
                                                                                <p className="item">Qty : <span>1</span></p>
                                                                                <p className="item">Size : <span>XL</span></p>
                                                                                <p className="item">Color : <span>Blue</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="total">
                                                                            <p>Total</p>
                                                                            <p>$123.5</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <!-- order items details ends here --> */}
                                                        <div className="accordion-item payment">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                    <span>Payment Details</span>
                                                                    <span className="status-icon pending">
                                                                        {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                                                        <i className="fa-solid fa-hourglass-end"></i>
                                                                        <i className="fa-solid fa-check"></i>
                                                                    </span>
                                                                </button>
                                                            </h2>
                                                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <p className="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                                                    <div className="btns-group d-flex gap-3 justify-content-center mt-4">
                                                                        <a href="#" className="btn btn-primary">Check Status</a>
                                                                        <a href="#" className="btn btn-warning">Send Invoice</a>
                                                                        <a href="#" className="btn btn-success">Mark As Paid</a>
                                                                        <a href="#" className="btn btn-danger">Mark As Hold</a>
                                                                    </div>
                                                                    {/* <!-- ------------- reason for hold --------- --> */}

                                                                    <div className="form-hold p-3">
                                                                        <form action="">
                                                                            <div className="form-group mb-3">
                                                                                <label className="form-label" for="holdReason">Define Reason</label>
                                                                                <textarea name="holdReason" id="holdReason" cols="20" rows="5" className="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                                                            </div>
                                                                            <a href="#" className="btn btn-danger">Hold Now</a>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- tab two  --> */}
                                            <div className="tab-pane fade show" id="v-pills-ticket2" role="tabpanel" aria-labelledby="v-pills-ticket2-tab" tabindex="0">
                                                <div className="order-cards-details-wrapper-main">
                                                    <div className="order-details-card">
                                                        <div className="header">
                                                            <p className="title">TKTID:MEDEQ089N</p>
                                                            <p className="date">03 Mar 2023</p>
                                                        </div>
                                                        <div className="card">
                                                            <div className="thumb-wrapper">
                                                                <img src="../img/thumb-img.png" alt="thumb-image" className="img-fluid" />
                                                            </div>
                                                            <div className="content-wrapper">
                                                                <h3 className="title">Lorem ipsum dolor, sit amet !</h3>
                                                                <div className="contact-wrapper">
                                                                    <div className="contact-item"><i className="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                                                    <div className="contact-item">
                                                                        <i className="fa-solid fa-envelope-open-text"></i>
                                                                        example@email.com
                                                                    </div>
                                                                </div>
                                                                <div className="address-items mt-2">
                                                                    <small>Billing Address</small>
                                                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                                                </div>
                                                                <div className="address-items">
                                                                    <small>Delivery Address</small>
                                                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <!-- ticket details ends here --> */}
                                                    <div className="accordion status-wrappers" id="accordionExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                                                            </h2>
                                                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="order-lists">
                                                                        <div className="items-wrapper">
                                                                            <div className="list-item header">
                                                                                <p className="title">Product Name</p>
                                                                                <p className="cost">$38.67</p>
                                                                            </div>
                                                                            <div className="list-item otr-list">
                                                                                <p className="item">Qty : <span>1</span></p>
                                                                                <p className="item">Size : <span>XL</span></p>
                                                                                <p className="item">Color : <span>Blue</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="total">
                                                                            <p>Total</p>
                                                                            <p>$123.5</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <!-- order items details ends here --> */}
                                                        <div className="accordion-item payment">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                    <span>Payment Details</span>
                                                                    <span className="status-icon pending">
                                                                        {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                                                        <i className="fa-solid fa-hourglass-end"></i>
                                                                        <i className="fa-solid fa-check"></i>
                                                                    </span>
                                                                </button>
                                                            </h2>
                                                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <p className="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                                                    <div className="btns-group d-flex gap-3 justify-content-center mt-4">
                                                                        <a href="#" className="btn btn-primary">Check Status</a>
                                                                        <a href="#" className="btn btn-warning">Send Invoice</a>
                                                                        <a href="#" className="btn btn-success">Mark As Paid</a>
                                                                        <a href="#" className="btn btn-danger">Mark As Hold</a>
                                                                    </div>
                                                                    {/* <!-- ------------- reason for hold --------- --> */}

                                                                    <div className="form-hold p-3">
                                                                        <form action="">
                                                                            <div className="form-group mb-3">
                                                                                <label className="form-label" for="holdReason">Define Reason</label>
                                                                                <textarea name="holdReason" id="holdReason" cols="20" rows="5" className="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                                                            </div>
                                                                            <a href="#" className="btn btn-danger">Hold Now</a>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <!-- payment details ends here  --> */}
                                                        <div className="accordion-item order-status-wrapper">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                    <span>Order Status</span>
                                                                    <span className="status-name"> Preparing </span>
                                                                </button>
                                                            </h2>
                                                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="status-list-view-wrapper">
                                                                        <ul className="status-list">
                                                                            <li className="status-item success">
                                                                                <h3 className="title">Order Dispatched</h3>
                                                                                <small>10:35AM From Lucknow, India</small>
                                                                            </li>
                                                                            <li className="status-item pending">
                                                                                <h3 className="title">At Custom Clearance</h3>
                                                                                <small>02 Mar 2024 From Origin, India</small>
                                                                            </li>
                                                                            <li className="status-item blocked">
                                                                                <h3 className="title">On the Way Via Sea Way</h3>
                                                                                <small>02 Mar 2024 From Origin, India</small>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="form-group px-3 offset-1 col-7">
                                                                            <select name="orderStatus" id="order-status-select" className="form-select">
                                                                                <option value="0">Change Order Status</option>
                                                                                <option value="0">Preparing</option>
                                                                                <option value="0">Out From Origin</option>
                                                                                <option value="0">At Origin Custom Office</option>
                                                                                <option value="0">On the Sea Way</option>
                                                                                <option value="0" className="text-danger">Order Lossed</option>
                                                                                <option value="0">At Desitination Custom</option>
                                                                            </select>
                                                                            {/* <!-- it only apperace when the order is at delivered status --> */}
                                                                            <div className="col-12 d-flex gap-3 mt-2">
                                                                                <input type="checkbox" name="reference-ticket" id="reference-ticket-gen" />
                                                                                <label for="reference-ticket-gen" className="form-label">Generate Reference Token For Future Order</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button className="btn btn-primary">Update Status</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- another ticket starts here  --> */}
                                            <div className="tab-pane fade show" id="v-pills-ticket3" role="tabpanel" aria-labelledby="v-pills-ticket3-tab" tabindex="0">
                                                <div className="order-cards-details-wrapper-main">
                                                    <div className="order-details-card">
                                                        <div className="header">
                                                            <p className="title">TKTID:MEDEQ089N</p>
                                                            <p className="date">03 Mar 2023</p>
                                                        </div>
                                                        <div className="card">
                                                            <div className="thumb-wrapper">
                                                                <img src="../img/thumb-img.png" alt="thumb-image" className="img-fluid" />
                                                            </div>
                                                            <div className="content-wrapper">
                                                                <h3 className="title">Lorem ipsum dolor, sit amet !</h3>
                                                                <div className="contact-wrapper">
                                                                    <div className="contact-item"><i className="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                                                    <div className="contact-item">
                                                                        <i className="fa-solid fa-envelope-open-text"></i>
                                                                        example@email.com
                                                                    </div>
                                                                </div>
                                                                <div className="address-items mt-2">
                                                                    <small>Billing Address</small>
                                                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                                                </div>
                                                                <div className="address-items">
                                                                    <small>Delivery Address</small>
                                                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <!-- ticket details ends here --> */}
                                                    <div className="accordion status-wrappers" id="accordionExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                                                            </h2>
                                                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="order-lists">
                                                                        <div className="items-wrapper">
                                                                            <div className="list-item header">
                                                                                <p className="title">Product Name</p>
                                                                                <p className="cost">$38.67</p>
                                                                            </div>
                                                                            <div className="list-item otr-list">
                                                                                <p className="item">Qty : <span>1</span></p>
                                                                                <p className="item">Size : <span>XL</span></p>
                                                                                <p className="item">Color : <span>Blue</span></p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="total">
                                                                            <p>Total</p>
                                                                            <p>$123.5</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <!-- order items details ends here --> */}
                                                        <div className="accordion-item payment">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                    <span>Payment Details</span>
                                                                    <span className="status-icon pending">
                                                                        {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                                                        <i className="fa-solid fa-hourglass-end"></i>
                                                                        <i className="fa-solid fa-check"></i>
                                                                    </span>
                                                                </button>
                                                            </h2>
                                                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <p className="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                                                    <div className="btns-group d-flex gap-3 justify-content-center mt-4">
                                                                        <a href="#" className="btn btn-primary">Check Status</a>
                                                                        <a href="#" className="btn btn-warning">Send Invoice</a>
                                                                        <a href="#" className="btn btn-success">Mark As Paid</a>
                                                                        <a href="#" className="btn btn-danger">Mark As Hold</a>
                                                                    </div>
                                                                    {/* <!-- ------------- reason for hold --------- --> */}

                                                                    <div className="form-hold p-3">
                                                                        <form action="">
                                                                            <div className="form-group mb-3">
                                                                                <label className="form-label" for="holdReason">Define Reason</label>
                                                                                <textarea name="holdReason" id="holdReason" cols="20" rows="5" className="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                                                            </div>
                                                                            <a href="#" className="btn btn-danger">Hold Now</a>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <!-- payment details ends here  --> */}
                                                        <div className="accordion-item order-status-wrapper">
                                                            <h2 className="accordion-header">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                    <span>Order Status</span>
                                                                    <span className="status-name"> Preparing </span>
                                                                </button>
                                                            </h2>
                                                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="status-list-view-wrapper">
                                                                        <ul className="status-list">
                                                                            <li className="status-item success">
                                                                                <h3 className="title">Order Dispatched</h3>
                                                                                <small>10:35AM From Lucknow, India</small>
                                                                            </li>
                                                                            <li className="status-item pending">
                                                                                <h3 className="title">At Custom Clearance</h3>
                                                                                <small>02 Mar 2024 From Origin, India</small>
                                                                            </li>
                                                                            <li className="status-item blocked">
                                                                                <h3 className="title">On the Way Via Sea Way</h3>
                                                                                <small>02 Mar 2024 From Origin, India</small>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="form-group px-3 offset-1 col-7">
                                                                            <select name="orderStatus" id="order-status-select" className="form-select">
                                                                                <option value="0">Change Order Status</option>
                                                                                <option value="0">Preparing</option>
                                                                                <option value="0">Out From Origin</option>
                                                                                <option value="0">At Origin Custom Office</option>
                                                                                <option value="0">On the Sea Way</option>
                                                                                <option value="0" className="text-danger">Order Lossed</option>
                                                                                <option value="0">At Desitination Custom</option>
                                                                            </select>
                                                                            {/* <!-- it only apperace when the order is at delivered status --> */}
                                                                            <div className="col-12 d-flex gap-3 mt-2">
                                                                                <input type="checkbox" name="reference-ticket" id="reference-ticket-gen" />
                                                                                <label for="reference-ticket-gen" className="form-label">Generate Reference Token For Future Order</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <button className="btn btn-primary">Update Status</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* <!-- section 2 --> */}
                        <section className="data-table-bgs_02x24 py-3">
                            <div className="container-fluid">
                                <div className="table-wrapper">
                                    <h3 className="title">Recent Transactions</h3>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="selection-cell-header" data-row-selection="true">
                                                    <input type="checkbox" className="" />
                                                </th>
                                                <th tabindex="0">
                                                    <a data-bs-toggle="modal" data-bs-target="#exampleModal">Name</a>
                                                </th>
                                                <th tabindex="0">Ticket ID</th>
                                                <th tabindex="0">Type/Status</th>
                                                <th tabindex="0">Contact</th>
                                                <th tabindex="0">Email</th>
                                                <th tabindex="0">Description/Comment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="selection-cell">
                                                    <input type="checkbox" className="" />
                                                </td>
                                                <td>John Skrew</td>
                                                <td>#12548796</td>
                                                <td><span className="status">new</span></td>
                                                <td>+91 XXXXXXXX 90</td>
                                                <td>****@gmail.com</td>
                                                <td>Lorem ipsum dolor sit amet....</td>
                                            </tr>
                                            <tr>
                                                <td className="selection-cell">
                                                    <input type="checkbox" className="" />
                                                </td>
                                                <td>John Skrew</td>
                                                <td>#12548796</td>
                                                <td><span className="status">new</span></td>
                                                <td>+91 XXXXXXXX 90</td>
                                                <td>****@gmail.com</td>
                                                <td>Lorem ipsum dolor sit amet....</td>
                                            </tr>
                                            <tr>
                                                <td className="selection-cell">
                                                    <input type="checkbox" className="" />
                                                </td>
                                                <td>John Skrew</td>
                                                <td>#12548796</td>
                                                <td><span className="status">new</span></td>
                                                <td>+91 XXXXXXXX 90</td>
                                                <td>****@gmail.com</td>
                                                <td>Lorem ipsum dolor sit amet....</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                        {/* <!-- -------------- --> */}
                    </div>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal ticket-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="heading-area">
                                        <div className="vertical-write">
                                            <h2 className="title">Jenell D. Matney</h2>
                                            <p className="ticket-id"><i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="main-content-area">
                                        <div className="contact-info-row">
                                            <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                                            <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                                        </div>
                                        <div className="button-grp">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default invoices