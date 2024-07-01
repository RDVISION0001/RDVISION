import React from 'react'
////copmponents////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';


function invoicess() {
  return (
    <>
      <div class="superadmin-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div class="my-container main-content-block2658 active-cont">
          {/* <!-- Top Nav --> */}
          <Topnav />
          {/* <!--End Top Nav --> */}
          <div class="container-fluid mt-3">
            {/* <!-- Section one --> */}
            <section class="sadmin-top-section">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-3">
                    <div class="card">
                      <div class="div-top">
                        <h3 class="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div class="icon-wrapper">
                        <i class="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card">
                      <div class="div-top">
                        <h3 class="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div class="icon-wrapper">
                        <i class="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card">
                      <div class="div-top">
                        <h3 class="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div class="icon-wrapper">
                        <i class="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card">
                      <div class="div-top">
                        <h3 class="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div class="icon-wrapper">
                        <i class="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- section 2 --> */}

            {/* <!-- graphs and ranking --> */}
            <section class="orders-view-wrapper common-tab-view-section py-5">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-5">
                    <div class="order-menu-wrapper">
                      <div class="nav flex-column vertical-tab-nav" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button class="nav-link active" id="v-pills-ticket1-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket1" type="button" role="tab" aria-controls="v-pills-ticket1" aria-selected="true">
                          <div class="order-card">
                            <div class="left-part">
                              <h3 class="title">order name</h3>
                              <p class="sub-title text-warning-emphasis">
                                <i class="fa-solid fa-ticket"></i>
                                TKTID:MEDEQ089N
                              </p>
                            </div>
                            <div class="right-part">AT : <span class="badge new">New</span></div>
                          </div>
                        </button>
                        {/* <!-- ticket one ends here  --> */}
                        <button class="nav-link" id="v-pills-ticket2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket2" type="button" role="tab" aria-controls="v-pills-ticket2" aria-selected="true">
                          <div class="order-card">
                            <div class="left-part">
                              <h3 class="title">order name</h3>
                              <p class="sub-title text-warning-emphasis">
                                <i class="fa-solid fa-ticket"></i>
                                TKTID:MEDEQ089N
                              </p>
                            </div>
                            <div class="right-part">AT : <span class="badge no-status">No Status</span></div>
                          </div>
                        </button>
                        {/* <!-- ticket two ends here  --> */}
                        <button class="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                          <div class="order-card">
                            <div class="left-part">
                              <h3 class="title">order name</h3>
                              <p class="sub-title text-warning-emphasis">
                                <i class="fa-solid fa-ticket"></i>
                                TKTID:MEDEQ089N
                              </p>
                            </div>
                            <div class="right-part">AT : <span class="badge no-status">No status</span></div>
                          </div>
                        </button>
                        {/* <!-- another ticket ends here  --> */}
                        <button class="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                          <div class="order-card">
                            <div class="left-part">
                              <h3 class="title">order name</h3>
                              <p class="sub-title text-warning-emphasis">
                                <i class="fa-solid fa-ticket"></i>
                                TKTID:MEDEQ089N
                              </p>
                            </div>
                            <div class="right-part">AT : <span class="badge hold">Hold</span></div>
                          </div>
                        </button>
                        {/* <!-- another ticket ends here  --> */}
                        <button class="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                          <div class="order-card">
                            <div class="left-part">
                              <h3 class="title">order name</h3>
                              <p class="sub-title text-warning-emphasis">
                                <i class="fa-solid fa-ticket"></i>
                                TKTID:MEDEQ089N
                              </p>
                            </div>
                            <div class="right-part">AT : <span class="badge paid">Paid</span></div>
                          </div>
                        </button>
                        {/* <!-- another ticket ends here  --> */}
                        <button class="nav-link" id="v-pills-ticket3-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket3" type="button" role="tab" aria-controls="v-pills-ticket3" aria-selected="true">
                          <div class="order-card">
                            <div class="left-part">
                              <h3 class="title">order name</h3>
                              <p class="sub-title text-warning-emphasis">
                                <i class="fa-solid fa-ticket"></i>
                                TKTID:MEDEQ089N
                              </p>
                            </div>
                            <div class="right-part">AT : <span class="badge sent">Sent</span></div>
                          </div>
                        </button>
                        {/* <!-- another ticket ends here  --> */}
                      </div>
                    </div>
                  </div>
                  <div class="col-7">
                    <div class="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                      {/* <!-- tab one  --> */}
                      <div class="tab-pane fade show active" id="v-pills-ticket1" role="tabpanel" aria-labelledby="v-pills-ticket1-tab" tabindex="0">
                        <div class="order-cards-details-wrapper-main">
                          <div class="order-details-card">
                            <div class="header">
                              <p class="title">TKTID:MEDEQ089N</p>
                              <p class="date">03 Mar 2023</p>
                            </div>
                            <div class="card">
                              <div class="thumb-wrapper">
                                <img src="../img/thumb-img.png" alt="thumb-image" class="img-fluid" />
                              </div>
                              <div class="content-wrapper">
                                <h3 class="title">Lorem ipsum dolor, sit amet !</h3>
                                <div class="contact-wrapper">
                                  <div class="contact-item"><i class="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                  <div class="contact-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    example@email.com
                                  </div>
                                </div>
                                <div class="address-items mt-2">
                                  <small>Billing Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                                <div class="address-items">
                                  <small>Delivery Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!-- ticket details ends here --> */}
                          <div class="accordion status-wrappers" id="accordionExample">
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                              </h2>
                              <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <div class="order-lists">
                                    <div class="items-wrapper">
                                      <div class="list-item header">
                                        <p class="title">Product Name</p>
                                        <p class="cost">$38.67</p>
                                      </div>
                                      <div class="list-item otr-list">
                                        <p class="item">Qty : <span>1</span></p>
                                        <p class="item">Size : <span>XL</span></p>
                                        <p class="item">Color : <span>Blue</span></p>
                                      </div>
                                    </div>
                                    <div class="total">
                                      <p>Total</p>
                                      <p>$123.5</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- order items details ends here --> */}
                            <div class="accordion-item payment">
                              <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  <span>Payment Details</span>
                                  <span class="status-icon pending">
                                    {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                    <i class="fa-solid fa-hourglass-end"></i>
                                    <i class="fa-solid fa-check"></i>
                                  </span>
                                </button>
                              </h2>
                              <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <p class="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                  <div class="btns-group d-flex gap-3 justify-content-center mt-4">
                                    <a href="#" class="btn btn-primary">Check Status</a>
                                    <a href="#" class="btn btn-warning">Send Invoice</a>
                                    <a href="#" class="btn btn-success">Mark As Paid</a>
                                    <a href="#" class="btn btn-danger">Mark As Hold</a>
                                  </div>
                                  {/* <!-- ------------- reason for hold --------- --> */}

                                  <div class="form-hold p-3">
                                    <form action="">
                                      <div class="form-group mb-3">
                                        <label class="form-label" for="holdReason">Define Reason</label>
                                        <textarea name="holdReason" id="holdReason" cols="20" rows="5" class="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                      </div>
                                      <a href="#" class="btn btn-danger">Hold Now</a>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <!-- tab two  --> */}
                      <div class="tab-pane fade show" id="v-pills-ticket2" role="tabpanel" aria-labelledby="v-pills-ticket2-tab" tabindex="0">
                        <div class="order-cards-details-wrapper-main">
                          <div class="order-details-card">
                            <div class="header">
                              <p class="title">TKTID:MEDEQ089N</p>
                              <p class="date">03 Mar 2023</p>
                            </div>
                            <div class="card">
                              <div class="thumb-wrapper">
                                <img src="../img/thumb-img.png" alt="thumb-image" class="img-fluid" />
                              </div>
                              <div class="content-wrapper">
                                <h3 class="title">Lorem ipsum dolor, sit amet !</h3>
                                <div class="contact-wrapper">
                                  <div class="contact-item"><i class="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                  <div class="contact-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    example@email.com
                                  </div>
                                </div>
                                <div class="address-items mt-2">
                                  <small>Billing Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                                <div class="address-items">
                                  <small>Delivery Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!-- ticket details ends here --> */}
                          <div class="accordion status-wrappers" id="accordionExample">
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                              </h2>
                              <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <div class="order-lists">
                                    <div class="items-wrapper">
                                      <div class="list-item header">
                                        <p class="title">Product Name</p>
                                        <p class="cost">$38.67</p>
                                      </div>
                                      <div class="list-item otr-list">
                                        <p class="item">Qty : <span>1</span></p>
                                        <p class="item">Size : <span>XL</span></p>
                                        <p class="item">Color : <span>Blue</span></p>
                                      </div>
                                    </div>
                                    <div class="total">
                                      <p>Total</p>
                                      <p>$123.5</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- order items details ends here --> */}
                            <div class="accordion-item payment">
                              <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  <span>Payment Details</span>
                                  <span class="status-icon pending">
                                    {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                    <i class="fa-solid fa-hourglass-end"></i>
                                    <i class="fa-solid fa-check"></i>
                                  </span>
                                </button>
                              </h2>
                              <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <p class="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                  <div class="btns-group d-flex gap-3 justify-content-center mt-4">
                                    <a href="#" class="btn btn-primary">Check Status</a>
                                    <a href="#" class="btn btn-warning">Send Invoice</a>
                                    <a href="#" class="btn btn-success">Mark As Paid</a>
                                    <a href="#" class="btn btn-danger">Mark As Hold</a>
                                  </div>
                                  {/* <!-- ------------- reason for hold --------- --> */}

                                  <div class="form-hold p-3">
                                    <form action="">
                                      <div class="form-group mb-3">
                                        <label class="form-label" for="holdReason">Define Reason</label>
                                        <textarea name="holdReason" id="holdReason" cols="20" rows="5" class="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                      </div>
                                      <a href="#" class="btn btn-danger">Hold Now</a>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- payment details ends here  --> */}
                            <div class="accordion-item order-status-wrapper">
                              <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  <span>Order Status</span>
                                  <span class="status-name"> Preparing </span>
                                </button>
                              </h2>
                              <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <div class="status-list-view-wrapper">
                                    <ul class="status-list">
                                      <li class="status-item success">
                                        <h3 class="title">Order Dispatched</h3>
                                        <small>10:35AM From Lucknow, India</small>
                                      </li>
                                      <li class="status-item pending">
                                        <h3 class="title">At Custom Clearance</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                      <li class="status-item blocked">
                                        <h3 class="title">On the Way Via Sea Way</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                    </ul>
                                  </div>
                                  <div class="row">
                                    <div class="form-group px-3 offset-1 col-7">
                                      <select name="orderStatus" id="order-status-select" class="form-select">
                                        <option value="0">Change Order Status</option>
                                        <option value="0">Preparing</option>
                                        <option value="0">Out From Origin</option>
                                        <option value="0">At Origin Custom Office</option>
                                        <option value="0">On the Sea Way</option>
                                        <option value="0" class="text-danger">Order Lossed</option>
                                        <option value="0">At Desitination Custom</option>
                                      </select>
                                      {/* <!-- it only apperace when the order is at delivered status --> */}
                                      <div class="col-12 d-flex gap-3 mt-2">
                                        <input type="checkbox" name="reference-ticket" id="reference-ticket-gen" />
                                        <label for="reference-ticket-gen" class="form-label">Generate Reference Token For Future Order</label>
                                      </div>
                                    </div>
                                    <div class="col-4">
                                      <button class="btn btn-primary">Update Status</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <!-- another ticket starts here  --> */}
                      <div class="tab-pane fade show" id="v-pills-ticket3" role="tabpanel" aria-labelledby="v-pills-ticket3-tab" tabindex="0">
                        <div class="order-cards-details-wrapper-main">
                          <div class="order-details-card">
                            <div class="header">
                              <p class="title">TKTID:MEDEQ089N</p>
                              <p class="date">03 Mar 2023</p>
                            </div>
                            <div class="card">
                              <div class="thumb-wrapper">
                                <img src="../img/thumb-img.png" alt="thumb-image" class="img-fluid" />
                              </div>
                              <div class="content-wrapper">
                                <h3 class="title">Lorem ipsum dolor, sit amet !</h3>
                                <div class="contact-wrapper">
                                  <div class="contact-item"><i class="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                  <div class="contact-item">
                                    <i class="fa-solid fa-envelope-open-text"></i>
                                    example@email.com
                                  </div>
                                </div>
                                <div class="address-items mt-2">
                                  <small>Billing Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                                <div class="address-items">
                                  <small>Delivery Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!-- ticket details ends here --> */}
                          <div class="accordion status-wrappers" id="accordionExample">
                            <div class="accordion-item">
                              <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                              </h2>
                              <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <div class="order-lists">
                                    <div class="items-wrapper">
                                      <div class="list-item header">
                                        <p class="title">Product Name</p>
                                        <p class="cost">$38.67</p>
                                      </div>
                                      <div class="list-item otr-list">
                                        <p class="item">Qty : <span>1</span></p>
                                        <p class="item">Size : <span>XL</span></p>
                                        <p class="item">Color : <span>Blue</span></p>
                                      </div>
                                    </div>
                                    <div class="total">
                                      <p>Total</p>
                                      <p>$123.5</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- order items details ends here --> */}
                            <div class="accordion-item payment">
                              <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  <span>Payment Details</span>
                                  <span class="status-icon pending">
                                    {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                    <i class="fa-solid fa-hourglass-end"></i>
                                    <i class="fa-solid fa-check"></i>
                                  </span>
                                </button>
                              </h2>
                              <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <p class="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                  <div class="btns-group d-flex gap-3 justify-content-center mt-4">
                                    <a href="#" class="btn btn-primary">Check Status</a>
                                    <a href="#" class="btn btn-warning">Send Invoice</a>
                                    <a href="#" class="btn btn-success">Mark As Paid</a>
                                    <a href="#" class="btn btn-danger">Mark As Hold</a>
                                  </div>
                                  {/* <!-- ------------- reason for hold --------- --> */}

                                  <div class="form-hold p-3">
                                    <form action="">
                                      <div class="form-group mb-3">
                                        <label class="form-label" for="holdReason">Define Reason</label>
                                        <textarea name="holdReason" id="holdReason" cols="20" rows="5" class="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                      </div>
                                      <a href="#" class="btn btn-danger">Hold Now</a>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- payment details ends here  --> */}
                            <div class="accordion-item order-status-wrapper">
                              <h2 class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  <span>Order Status</span>
                                  <span class="status-name"> Preparing </span>
                                </button>
                              </h2>
                              <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <div class="status-list-view-wrapper">
                                    <ul class="status-list">
                                      <li class="status-item success">
                                        <h3 class="title">Order Dispatched</h3>
                                        <small>10:35AM From Lucknow, India</small>
                                      </li>
                                      <li class="status-item pending">
                                        <h3 class="title">At Custom Clearance</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                      <li class="status-item blocked">
                                        <h3 class="title">On the Way Via Sea Way</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                    </ul>
                                  </div>
                                  <div class="row">
                                    <div class="form-group px-3 offset-1 col-7">
                                      <select name="orderStatus" id="order-status-select" class="form-select">
                                        <option value="0">Change Order Status</option>
                                        <option value="0">Preparing</option>
                                        <option value="0">Out From Origin</option>
                                        <option value="0">At Origin Custom Office</option>
                                        <option value="0">On the Sea Way</option>
                                        <option value="0" class="text-danger">Order Lossed</option>
                                        <option value="0">At Desitination Custom</option>
                                      </select>
                                      {/* <!-- it only apperace when the order is at delivered status --> */}
                                      <div class="col-12 d-flex gap-3 mt-2">
                                        <input type="checkbox" name="reference-ticket" id="reference-ticket-gen" />
                                        <label for="reference-ticket-gen" class="form-label">Generate Reference Token For Future Order</label>
                                      </div>
                                    </div>
                                    <div class="col-4">
                                      <button class="btn btn-primary">Update Status</button>
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
            <section class="data-table-bgs_02x24 py-3">
              <div class="container-fluid">
                <div class="table-wrapper">
                  <h3 class="title">Recent Transactions</h3>
                  <table class="table">
                    <thead>
                      <tr>
                        <th class="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" class="" />
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
                        <td class="selection-cell">
                          <input type="checkbox" class="" />
                        </td>
                        <td>John Skrew</td>
                        <td>#12548796</td>
                        <td><span class="status">new</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td class="selection-cell">
                          <input type="checkbox" class="" />
                        </td>
                        <td>John Skrew</td>
                        <td>#12548796</td>
                        <td><span class="status">new</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td class="selection-cell">
                          <input type="checkbox" class="" />
                        </td>
                        <td>John Skrew</td>
                        <td>#12548796</td>
                        <td><span class="status">new</span></td>
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
      <div class="modal ticket-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-body">
              <div class="row">
                <div class="col-4">
                  <div class="heading-area">
                    <div class="vertical-write">
                      <h2 class="title">Jenell D. Matney</h2>
                      <p class="ticket-id"><i class="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                    </div>
                  </div>
                </div>
                <div class="col-8">
                  <div class="main-content-area">
                    <div class="contact-info-row">
                      <a href="" class="contact-info phone"><i class="fa-solid fa-phone"></i> +91 9918293747</a>
                      <a class="contact-info email" href="#"><i class="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                    </div>
                    <div class="button-grp">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary">Save changes</button>
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

export default invoicess