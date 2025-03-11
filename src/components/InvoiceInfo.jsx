import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";


const InvoiceInfo = (props) => {
  const [invoices, setInvoices] = useState([]);
  const { userId, dark } = useAuth(); // dark flag preserved
  const [currentSrc, setCurrentSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const audioRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [invoiceData, setInvoiceData] = useState({
    totalInvoices: null,
    totalPaidInvoices: null,
    totalPendingInvoices: null,
    totalAwaitingPaidInvoices: null,
  });
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getFlagUrl = (countryIso) =>
    `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  const [saleTicketData, setSaleTicketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTickets = useMemo(() => {
    return (saleTicketData || []).filter((invoice) =>
      (invoice.senderName || invoice.firstName || "")
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
  }, [saleTicketData, searchQuery]);

  // Fetch Invoice Count Data
  useEffect(() => {
    fetchInvoiceData();
    fetchTicketSaleData();
  }, []);

  function formatFollowUpDate(followUpDateTime) {
    const [year, month, day] = followUpDateTime;
    // Convert month to 2-digit format and day to 2-digit format
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return `${year}-${convertNumberToStringMonth(
      formattedMonth
    )}-${formattedDay}`;
  }

  const fetchTicketSaleData = async () => {
    const response = await axiosInstance.post(
      "/third_party_api/ticket/negotiationstagebased",
      {
        user:
          localStorage.getItem("roleName") === "Closer"
            ? localStorage.getItem("userId")
            : 0,
        stage: 3,
      }
    );
    setSaleTicketData(response.data);
  };

  const fetchInvoiceData = async () => {
    try {
      const response = await axiosInstance.get(
        `/invoice/invoideCOunt/${localStorage.getItem("roleName") === "Closer" ? userId : 0
        }`
      );
      setInvoiceData({
        totalInvoices: response.data.totalInvoices,
        totalPaidInvoices: response.data.totalPaidInvoices,
        totalPendingInvoices: response.data.totalPendingInvoices,
        totalAwaitingPaidInvoices: response.data.totalAwaitingPaidInvoices,
      });
    } catch (err) {
      setError("Failed to fetch invoice data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Invoice Details
  useEffect(() => {
    fetchInvoices();
  }, [props.stage]);

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(`/invoice/getAssInvoice/${userId}`);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices");
    }
  };

  const convertNumberToStringMonth = (number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[number - 1] || "Invalid month";
  };

  const openTrackingBox = (ticketId) => {
    setSelectedTicket(ticketId);
    document.getElementById("trackingInput").classList.add("d-flex");
    document.getElementById("trackingInput").showModal();
  };

  const closeTrackingBox = () => {
    document.getElementById("trackingInput").classList.remove("d-flex");
    document.getElementById("trackingInput").close();
  };

  const addTrackingNumber = async () => {
    try {
      const response = await axiosInstance.post("/invoice/addTrackingNumber", {
        ticketId: selectedTicket,
        trackingNumber,
      });

      if (response.data === "Tracking Number Added") {
        fetchInvoices();
        closeTrackingBox();
        toast.success(response.data);
        setTrackingNumber("");
      }
    } catch (err) {
      toast.error("Failed to add tracking number");
    }
  };

  const handleClick = async (ticketId) => {
    try {
      await axiosInstance.get(`/invoice/clickToCall/${ticketId}`);
    } catch (error) {
      console.error("Error calling ticket:", error);
    }
  };

  const handleClickCallForticket = async (ticketId) => {
    try {
      await axiosInstance.get(
        `${ticketId.length < 15 ? "/third_party_api/ticket/" : "/upload/"
        }clickToCall/${ticketId}`
      );
    } catch (error) {
      console.error("Error calling ticket:", error);
    }
  };

  const playRecording = useCallback(
    (src, index) => {
      // Construct the new URL from src
      setSelectedIndex(index);
      let newUrl = `https:${src.split(":")[2].split("}")[0]}`;
      newUrl = newUrl.split(`"`)[0];

      if (currentSrc !== newUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }

        // Set the new source and play
        audioRef.current.src = newUrl;
        setCurrentSrc(newUrl);

        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => console.error("Error playing audio:", err));
      } else {
        // Toggle play/pause based on current playing state
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => console.error("Error resuming audio:", err));
        }
      }
    },
    [currentSrc, isPlaying]
  );

  // Early returns AFTER all hooks are declared
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p>{error}</p>;

  const setFormate = (date) => {
    let newdate = date && JSON.stringify(date).split("[")[1].split("]")[0];
    return (
      newdate &&
      `${newdate.split(",")[2]}-${convertNumberToStringMonth(
        newdate.split(",")[1]
      )}-${newdate.split(",")[0]}`
    );
  };

  return (
    <>
      {props.stage !== 4 && (
        <section className={`sadmin-top-section ${dark ? `bg-dark` : ``} `}>
          <div className={`container-fluid pt-2 ${dark ? `bg-dark` : ``} `}>
            <div className="row">
              {/* Total Invoices */}
              <div className={`col-md-3 ${dark ? "bg-dark" : ""}`}>
                <div
                  className={`card position-relative border ${dark ? "bg-dark text-white" : ""
                    }`}
                  style={{ backgroundColor: dark ? "" : "#caf0f8" }}
                >
                  <div className="div-top">
                    <h3 className="title">Total Invoices</h3>
                    <span className="sales">
                      {invoiceData.totalInvoices !== null
                        ? invoiceData.totalInvoices
                        : "N/A"}
                      <span className="indicators"></span>
                    </span>
                  </div>
                  <div className="d-flex justify-content-center flex-column align-items-center">
                    <div className="icon-wrapper">
                      <i
                        className="fa-solid fa-wallet"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowDetails(!showDetails)}
                      ></i>
                    </div>
                  </div>
                  <div
                    className={`details-box position-absolute ${dark ? "bg-dark text-white" : "bg-white"
                      } border rounded p-3 shadow transition-all duration-300 ${showDetails ? "opacity-100" : "opacity-0 invisible"
                      }`}
                    style={{ top: "100%", left: "0", width: "100%" }}
                  >
                    <p>Total Follow-ups: 50</p>
                    <p>Total New: 30</p>
                    <p>Total Sale: 20</p>
                  </div>
                </div>
              </div>

              {/* Paid Invoices */}
              <div className={`col-md-3   ${dark ? "bg-dark" : ""}`} >
                <div
                  className={`card ${dark ? "bg-secondary text-white" : ""}`}
                  style={{ backgroundColor: dark ? "" : "#ffe5ec" }}
                >
                  <div className="div-top">
                    <h3 className="title">Paid Invoices</h3>
                    <span className="sales">
                      {invoiceData.totalPaidInvoices !== null
                        ? invoiceData.totalPaidInvoices
                        : "N/A"}
                      <span className="indicators"></span>
                    </span>
                  </div>
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                </div>
              </div>

              {/* Pending Invoices */}
              <div className={`col-md-3 ${dark ? "bg-dark" : ""}`} >
                <div
                  className={`card ${dark ? "bg-dark border text-white" : ""}`}
                  style={{ backgroundColor: dark ? "" : "#f3d5b5" }}
                >
                  <div className="div-top">
                    <h3 className="title">Pending Invoices</h3>
                    <span className="sales">
                      {invoiceData.totalPendingInvoices !== null
                        ? invoiceData.totalPendingInvoices
                        : "N/A"}
                      <span className="indicators"></span>
                    </span>
                  </div>
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                </div>
              </div>

              {/* Awaiting Invoices */}
              <div className={`col-md-3 ${dark ? "bg-dark" : ""}`}>
                <div
                  className={`card ${dark ? "bg-secondary text-white" : ""}`}
                  style={{ backgroundColor: dark ? "" : "#d6ce93" }}
                >
                  <div className="div-top">
                    <h3 className="title">Awaiting Tracking</h3>
                    <span className="sales">
                      {invoiceData.totalAwaitingPaidInvoices !== null
                        ? invoiceData.totalAwaitingPaidInvoices
                        : "N/A"}
                      <span className="indicators"></span>
                    </span>
                  </div>
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className={`data-table-bgs_02x24 py-3 ${dark ? `bg-dark text-white` : ``}`}
      >
        <div className="container-fluid">
          <div className="table-wrapper">
            {props.stage === 4 ? (
              <h3 className="title">Invoice Tracking</h3>
            ) : (
              <h3 className="title">Invoices for after sales service</h3>
            )}
            <table className={`table table-bordered ${dark ? `table-dark` : ``}`}>
              <thead>
                <tr className="border">
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    S.No.
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Created Date
                  </th>
                  {localStorage.getItem("roleName") === "Closer" && <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Tracking Number
                  </th>}
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Total Amount
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Customer Name
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Country
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Order Details
                  </th>
                  {localStorage.getItem("roleName") === "SeniorSuperVisor" && (
                    <th
                      className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                        }`}
                    >
                      Tracking Number
                    </th>
                  )}
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Delivery Status
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Last Call Status
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Action
                  </th>
                  <th
                    className={`text-center whitespace-nowrap ${dark ? `bg-secondary text-white` : ``
                      }`}
                  >
                    Recording
                  </th>
                </tr>
              </thead>

              <tbody className="overflow">
                {invoices.length > 0 ? (
                  invoices
                    .slice(0, 10) // Limit to the first 10 invoices
                    .map((invoice, index) => {
                      const isTrackingAvailable = invoice.trackingNumber;
                      return (
                        <tr
                          key={index}
                          className={`border ${isTrackingAvailable ? "bg-success" : ""
                            }`} // Apply green background if tracking number is available
                        >
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {invoice.saleDate && invoice.saleDate[2]}-
                            {convertNumberToStringMonth(
                              invoice.saleDate && invoice.saleDate[1]
                            )}
                            -{invoice.saleDate && invoice.saleDate[0]}
                          </td>
                          {localStorage.getItem("roleName") === "Closer" && <td className="text-center">
                            {invoice.trackingNumber ? invoice.trackingNumber : "Awating"}
                          </td>}
                          <td className="text-center">
                            {invoice.orderDto.productOrders[0].currency}{" "}
                            {invoice.orderDto.totalPayableAmount}
                          </td>
                          <td className="text-center">{invoice.customerName}</td>
                          <td className="text-center">
                            <img
                              style={{ height: 14 }}
                              src={getFlagUrl(invoice.countryIso)}
                              alt=""
                            />{" "}
                            <span style={{ fontSize: 14 }}>
                              {invoice.countryIso}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="product-details">
                              <table className="table table-sm table-bordered table-striped table-hover">
                                <thead className="table-light">
                                  <tr>
                                    <th
                                      className={`text-center ${dark ? `bg-muted text-dark` : ``
                                        }`}
                                      scope="col"
                                    >
                                      Name
                                    </th>
                                    <th
                                      className={`text-center ${dark ? `bg-muted text-dark` : ``
                                        }`}
                                      scope="col"
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      className={`text-center ${dark ? `bg-muted text-dark` : ``
                                        }`}
                                      scope="col"
                                    >
                                      Price
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoice.orderDto?.productOrders?.length > 0 ? (
                                    invoice.orderDto.productOrders.map((order, i) =>
                                      order.product?.map((product, index) => (
                                        <tr key={`${i}-${index}`}>
                                          <td
                                            className={`text-center ${dark ? `bg-secondary text-white` : ``
                                              }`}
                                          >
                                            {product.name || "N/A"}
                                          </td>
                                          <td
                                            className={`text-center ${dark ? `bg-secondary text-white` : ``
                                              }`}
                                          >
                                            {order.quantity || "N/A"}
                                          </td>
                                          <td
                                            className={`text-center ${dark ? `bg-secondary text-white` : ``
                                              }`}
                                          >
                                            {invoice.currency || "$"}
                                            {order.totalAmount || "0.00"}
                                          </td>
                                        </tr>
                                      ))
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan="3" className="text-center">
                                        No products found
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                          {localStorage.getItem("roleName") ===
                            "SeniorSuperVisor" && (
                              <td className="text-center">
                                {invoice.trackingNumber ? (
                                  invoice.trackingNumber
                                ) : (
                                  <button
                                    className="bg-primary"
                                    onClick={() =>
                                      openTrackingBox(invoice.uniqueQueryId)
                                    }
                                  >
                                    Add Tracking Number
                                  </button>
                                )}
                              </td>
                            )}
                          <td className="text-center">
                            {invoice.deliveryStatus || "N/A"}
                          </td>
                          <td className="text-center">{invoice.assCallStatus}</td>
                          <td className="text-center">
                            <Button
                              onClick={() => handleClick(invoice.uniqueQueryId)}
                              className="btn-action call rounded-circle"
                              title="Get connect on call"
                            >
                              <i className="fa-solid fa-phone"></i>
                            </Button>
                          </td>
                          <td className="text-center">
                            {invoice.callRecording ? (
                              <Button
                                onClick={() =>
                                  playRecording(invoice.callRecording, index)
                                }
                              >
                                {isPlaying && selectedIndex === index ? (
                                  <i className="fa-solid fa-pause"></i>
                                ) : (
                                  <i className="fa-solid fa-play"></i>
                                )}
                              </Button>
                            ) : (
                              "Recording not Available"
                            )}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <dialog
              id="trackingInput"
              className="w-100 h-100 bg-transparent justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="d-flex flex-column justify-content-center align-items-center bg-white p-3 rounded">
                <div
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginBottom: "4px",
                  }}
                >
                  <i
                    className="fa-solid fa-xmark fa-xl"
                    onClick={closeTrackingBox}
                    style={{ color: "#ff1900", cursor: "pointer" }}
                  ></i>
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  autoFocus
                  className="p-2 bg-white text-black"
                  style={{ width: "500px" }}
                  placeholder="Enter Tracking Number"
                />
                <button
                  className="bg-primary text-white m-2"
                  onClick={addTrackingNumber}
                >
                  Add Tracking Number
                </button>
              </div>
            </dialog>
          </div>
        </div>
      </section>

      {/* 2nd table */}
      <section className={`data-table-bgs_02x24 py-3 ${dark ? "bg-dark text-white" : ""}`}>
        <div className="container-fluid">
          {/* Header with Title and Inline Search Bar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="title">
              {props.stage === 4 ? "Ticket Tracking" : "Tickets for After Sales Service"}
            </h3>
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search by Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <div className="table-container" style={{ maxHeight: "800px", overflowY: "auto" }}>
              <table className={`table table-bordered ${dark ? "table-dark" : ""}`}>
                <thead className="sticky-header">
                  <tr className="border">
                    <th className="text-center">S.no</th>
                    <th className="text-center">Sale Date</th>
                    <th className="text-center">Tracking Number</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Tracking Id</th>
                    <th className="text-center">Delivery Status</th>
                    <th className="text-center">Comment</th>
                    <th className="text-center">Action</th>
                    <th className="text-center">Recording</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((invoice, index) => (
                      <tr key={invoice.uniqueQueryId || index} className="border">
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">
                          {invoice.lastActionDate ? formatFollowUpDate(invoice.lastActionDate) : "N/A"}
                        </td>
                        <td className="text-center">
                          {invoice.trackingNumber || "Awaiting"}
                        </td>
                        <td className="text-center">
                          {invoice.senderName || invoice.firstName}
                        </td>
                        <td className="text-center">
                          {invoice.trackingNumber ? (
                            invoice.trackingNumber
                          ) : localStorage.getItem("roleName") === "SeniorSuperVisor" ? (
                            <button className="bg-primary" onClick={() => openTrackingBox(invoice.uniqueQueryId)}>
                              Add Tracking Number
                            </button>
                          ) : (
                            "Awaiting for Tracking..."
                          )}
                        </td>
                        <td className="text-center">{invoice.deliveryStatus || "NA"}</td>
                        <td className="text-center">
                          {invoice.comment ? invoice.comment.slice(0, 20) : "No comment"}
                        </td>
                        <td className="text-center">
                          <Button
                            onClick={() => handleClickCallForticket(invoice.uniqueQueryId)}
                            className="btn-action call rounded-circle"
                            title="Get connect on call"
                          >
                            <i className="fa-solid fa-phone"></i>
                          </Button>
                        </td>
                        <td className="text-center">
                          {invoice.recordingFile ? (
                            <Button onClick={() => playRecording(invoice.recordingFile, index)}>
                              {isPlaying && selectedIndex === index ? (
                                <i className="fa-solid fa-pause"></i>
                              ) : (
                                <i className="fa-solid fa-play"></i>
                              )}
                            </Button>
                          ) : (
                            "Recording not Available"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">No matching tickets found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tracking Number Input Dialog */}
          <dialog id="trackingInput" className="tracking-dialog">
            <div className="dialog-content">
              <div className="dialog-header">
                <i className="fa-solid fa-xmark fa-xl close-icon" onClick={closeTrackingBox}></i>
              </div>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                autoFocus
                className="tracking-input"
                placeholder="Enter Tracking Number"
              />
              <button className="bg-primary text-white m-2" onClick={addTrackingNumber}>
                Add Tracking Number
              </button>
            </div>
          </dialog>
        </div>
      </section>



      {/* Hidden audio element for playing recordings */}
      <audio ref={audioRef} style={{ display: "none" }} />
    </>
  );
};

export default InvoiceInfo;
