import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logout from "../auth/logout";
import axiosInstance from "../axiosInstance";

function Sidenav() {
  const [hide, setHide] = useState();
  const { roleName, firstName, lastName, dark } = useAuth();

  const [liveTickets, setLiveTickets] = useState({
    totalAssignTickets: 0,
    totalFollowupsTickets: 0,
  });
  const [uploadedTickets, setUploadedTickets] = useState({
    totalAssignTickets: 0,
    totalFollowupsTickets: 0,
    totalNewTickets: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/getNoOfTickets/${localStorage.getItem("userId")}`
        );
        const { Live, uploded } = response.data;

        if (Live && uploded) {
          setLiveTickets({
            totalAssignTickets: Live.totalNewTickets,
            totalFollowupsTickets: Live.totalFollowupsTickets,
          });
          setUploadedTickets({
            totalAssignTickets: uploded.totalAssignTickets,
            totalFollowupsTickets: uploded.totalFollowupsTickets,
            totalNewTickets: uploded.totalNewTickets,
          });
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };
    fetchTicketData();
  }, []);

  useEffect(() => {
    const menuBtn = document.querySelector("#menu-btn");
    const sidebar = document.querySelector("#sidebar");
    const container = document.querySelector(".my-container");

    if (!menuBtn || !sidebar || !container) {
      console.error("One or more elements are not found in the DOM");
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

  ///
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - loginTime;
        if (timeDiff >= 12 * 60 * 60 * 1000) {
          // 10000 ms = 10 seconds
          navigate("/");
          logout();
          clearInterval(interval); // Stop checking after logging out
        }
      }
    }, 1000);
  });

  //resuble function to convert byte code to image url
  function convertToImage(imageString) {
    const byteCharacters = atob(imageString); // Decode base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  return (
    <div
      className={`side-navbar active-nav d-flex justify-content-between flex-wrap flex-column ${dark ? `bg-dark` : `bg-white`
        } `}
      id="sidebar"
    >
      <ul className="nav sidebar2658 flex-column w-100">
        {/* SuperAdmin */}
        {roleName === "SuperAdmin" && localStorage.getItem("userId") && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div
                className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  className="img-fluid rounded-circle"
                  src={convertToImage(localStorage.getItem("imageData"))}
                  alt="no Image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <a
                href="#"
                className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                  }`}
              >
                <p>{firstName} {lastName}</p>
                <h6 className="whitespace-nowrap">{roleName} </h6>
              </a>
            </li>
            <li className="nav-item">
              <NavLink
                to="/super_admin_index"
                className={`nav-link ${dark ? "text-dark" : "text-white"}`}
              >
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/super_admin_users" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-people-group"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Users</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Verified_sales" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-dollar-sign"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Verified Sales</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/live_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-headset"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  Live Tickets{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ">
                    {liveTickets.totalAssignTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/super_admin_orders" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-money-check-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Orders Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/invoice" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Invoice</span>
              </NavLink>
            </li>
          </>
        )}

        {/* Admin */}
        {roleName === "Admin" && localStorage.getItem("userId") && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div
                className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  className="img-fluid rounded-circle"
                  src={convertToImage(localStorage.getItem("imageData"))}
                  alt="no Image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <a
                href="#"
                className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                  }`}
              >
                <p>{firstName} {lastName}</p>
                <h6 className="whitespace-nowrap">{roleName} </h6>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_index" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/payment_window" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-money-check-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Payment Window</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_to_everyone" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-user"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>To Everyone</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ticket_house" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-house-laptop"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Ticket-House</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_upload_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa fa-upload" aria-hidden="true"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Upload Tickets</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Verified_sales" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-dollar-sign"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Verified Sales</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_users" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-people-group"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Users</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/live_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-headset"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  Live Tickets{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ">
                    {liveTickets.totalAssignTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/upload_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-upload"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  ABC{" "}
                  <span className="rounded-circle bg-danger text-white p-1 w">
                    {uploadedTickets.totalNewTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/in_negotiation" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-handshake"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  In-Negotiation{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ">
                    {liveTickets.totalFollowupsTickets +
                      uploadedTickets.totalFollowupsTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mis_product" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Products Information</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin_sales" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Sale's Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/invoice" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Invoice</span>
              </NavLink>
            </li>
          </>
        )}

        {/* closer  */}
        {roleName === "Closer" && localStorage.getItem("userId") && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div
                className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  className="img-fluid rounded-circle"
                  src={convertToImage(localStorage.getItem("imageData"))}
                  alt="no Image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              {localStorage.getItem("collapse") && (
                <a
                  href="#"
                  className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                    }`}
                >
                  <p>{firstName} {lastName}</p>
                  <h6 className="whitespace-nowrap">{roleName} </h6>
                </a>
              )}
            </li>
            <li className="nav-item">
              <NavLink to="/closer_index" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i
                  className={`fa-solid fa-chalkboard fa-fw text-dark ${dark ? `text-white` : `text-light`
                    }`}
                ></i>
                <span
                  className={`nav-text text-dark ${dark ? `text-white` : `text-light`
                    } `}
                >
                  Dashboard
                </span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/live_tickets"
                className={`nav-link ${dark ? "text-light" : "text-dark"}`}
              >
                <i className="fa-solid fa-headset"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  Live Tickets
                  <span className="rounded-circle bg-danger text-white p-1 ml-2">
                    {liveTickets.totalAssignTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/upload_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-upload"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  ABC{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ml-2">
                    {uploadedTickets.totalNewTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/in_negotiation" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-handshake"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  In-Negotiation{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ml-2">
                    {liveTickets.totalFollowupsTickets +
                      uploadedTickets.totalFollowupsTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/after_sales_service" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-headphones"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>ASS</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mis_product" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-file"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Products Information</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/invoice" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Invoice</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/sales_report" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-regular fa-flag"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Today Sales Report</span>
              </NavLink>
            </li>
          </>
        )}

        {/* project coordinator */}
        {roleName === "Product_Coordinator" &&
          localStorage.getItem("userId") && (
            <>
              <li className="nav-item d-flex align-items-center user-logo">
                <div
                  className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                  style={{ width: "60px", height: "60px" }}
                >
                  <img
                    className="img-fluid rounded-circle"
                    src={convertToImage(localStorage.getItem("imageData"))}
                    alt="no Image"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <a
                  href="#"
                  className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                    }`}
                >
                  <p>{firstName} {lastName}</p>
                  <h6 className="whitespace-nowrap">{roleName} </h6>
                </a>
              </li>
              <li className="nav-item">
                <NavLink to="/image_upload" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                  <i class="fa-solid fa-image"></i>
                  <span className={` ${dark ? "text-white" : "text-dark"}`}>Img Upload</span>
                </NavLink>
              </li>
              {/* <li className="nav-item">
              <NavLink to="/mis_product" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Products Information</span>
              </NavLink>
            </li> */}
              <li className="nav-item">
                <NavLink to="/new_products" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                  <i class="fa-solid fa-pills"></i>
                  <span className={` ${dark ? "text-white" : "text-dark"}`}>New Products</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/mis_product" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                  <i class="fa-solid fa-plus-minus"></i>
                  <span className={` ${dark ? "text-white" : "text-dark"}`}>MIS-PRODUCT_DEP</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin_upload_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                  <i class="fa fa-upload" aria-hidden="true"></i>
                  <span className={` ${dark ? "text-white" : "text-dark"}`}>Upload Tickets</span>
                </NavLink>
              </li>
            </>
          )}

        {/* inventory management*/}
        {roleName === "Inventory" && localStorage.getItem("userId") && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div
                className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  className="img-fluid rounded-circle"
                  src={convertToImage(localStorage.getItem("imageData"))}
                  alt="no Image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <a
                href="#"
                className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                  }`}
              >
                <p>{firstName} {lastName}</p>
                <h6 className="whitespace-nowrap">{roleName} </h6>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/index" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Index</span>
              </NavLink>
            </li>
          </>
        )}

        {/* captain/Manager */}
        {roleName === "Captain" && localStorage.getItem("userId") && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div
                className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  className="img-fluid rounded-circle"
                  src={convertToImage(localStorage.getItem("imageData"))}
                  alt="no Image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <a
                href="#"
                className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                  }`}
              >
                <p>{firstName} {lastName}</p>
                <h6 className="whitespace-nowrap">{roleName} </h6>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_index" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_to_closer" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-people-group"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>To Closer</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/live_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-headset"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  Live Tickets{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ">
                    {liveTickets.totalAssignTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/upload_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-upload"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  ABC{" "}
                  <span className="rounded-circle bg-danger text-white p-1 w">
                    {uploadedTickets.totalNewTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/in_negotiation" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-handshake"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  In-Negotiation{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ">
                    {liveTickets.totalFollowupsTickets +
                      uploadedTickets.totalFollowupsTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/captain_sales" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Sale's Status</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/invoice" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Invoice</span>
              </NavLink>
            </li>
          </>
        )}

        {/*senior_supervisor*/}
        {roleName === "SeniorSuperVisor" && localStorage.getItem("userId") && (
          <>
            <li className="nav-item d-flex align-items-center user-logo">
              <div
                className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  className="img-fluid rounded-circle"
                  src={convertToImage(localStorage.getItem("imageData"))}
                  alt="no Image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <a
                href="#"
                className={`nav-link h3 my-2 w-100 d-block ${dark ? `text-light` : `text-dark`
                  }`}
              >
                <p>{firstName} {lastName}</p>
                <h6 className="whitespace-nowrap">{roleName} </h6>
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/senior_supervisor_index" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-chalkboard fa-fw"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/senior_supervisor_to_captain" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-user"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Team</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/live_tickets" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-headset"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  {" "}
                  Live Tickets{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ml-2">
                    {liveTickets.totalAssignTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/in_negotiation" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-handshake"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>
                  In-Negotiation{" "}
                  <span className="rounded-circle bg-danger text-white p-1 ml-2">
                    {liveTickets.totalFollowupsTickets +
                      uploadedTickets.totalFollowupsTickets}
                  </span>
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/assign_ticket_report" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-bug"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Assign Ticket Report</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ticket_house" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-house-laptop"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Ticket-House</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/sales_report" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i className="fa-solid fa-trophy"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Today Sales Report</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="verified_sales" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-dollar-sign"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Verified Sales</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/mis_product" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Products Information</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/invoice" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span className={` ${dark ? "text-white" : "text-dark"}`}>Invoice</span>
              </NavLink>
            </li>
          </>
        )}

        <li className="nav-item">
          <NavLink to="/email" className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
            <i class="fa-solid fa-envelope-open-text"></i>
            <span className="nav-text">Inbox</span>
          </NavLink>
        </li>
        {localStorage.getItem("userId") && (
          <li className="nav-item">
            <Link className={`nav-link ${dark ? "text-light" : "text-dark"}`}>
              <i className="fa-solid fa-power-off text-danger"></i>
              <span className="nav-text cursor-pointer">
                <Logout />
              </span>
            </Link>
          </li>
        )}
      </ul>
      {/* {localStorage.getItem("userId") && <div className="userIP-wrapper">
        <small>Your IP</small>
        <p className="m-0">https://127.2.2.225</p>
      </div>} */}
    </div>
  );
}

export default Sidenav;
