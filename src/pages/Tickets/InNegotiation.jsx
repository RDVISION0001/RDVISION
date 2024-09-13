import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Modal } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

// Authentication context
import { useAuth } from '../../auth/AuthContext'
import TicketJourney from '../../components/TicketJourney';
import InvoiceBox from '../../components/InvoiceBox';
import { toast } from 'react-toastify';


function InNegotiation() {
  const [ticketData, setTicketData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(2); // Default stage is 2
  const { userId } = useAuth();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ ticketStatus: '', comment: '', followUpDateTime: '' });
  const [showSaleTransaction, setShowTransaction] = useState(false);
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);
  const [on, setOn] = useState(false);
  const [senderNameForEmail, setSenderNameForEmail] = useState("");
  const [uniqueQueryId, setUniqueQueryId] = useState(null);
  const [senderEmailFormail, setSenderEmailForMail] = useState("");
  const [senderMobile, setSenderMobile] = useState("");
  const [productArray, setProductArray] = useState([]);
  const [emailData, setEmailData] = useState({
    ticketId: "",
    name: "",
    email: "",
    mobile: "",
    productList: []
  });
  const [productsList, setProductsList] = useState([]);
  const [view, setView] = useState(false);
  const [selctedTicketInfo, setSelectedTicketInfo] = useState("")
  const [selectTicketForInvoice, setSelectTicketForInvoice] = useState(null)
  const [selectNameForInvoice, setSelectNameForInvoice] = useState(null)
  const [selectMobileForInvoice, setSelectMobileForInvoice] = useState(null)
  const [selectEmailForInvoice, setSelectEmailForInvoice] = useState(null)
  const [filterdate, setFilterDate] = useState(null)
  const [callId, setCallId] = useState(0)
  const [response, setResponse] = useState(null);
  const [shortValue, setShortValue] = useState("")
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value)
  }













  const [isInvoiceOn, setIsInvoiceOn] = useState(false)
  const handleInvoice = (ticketId, name, email, mobile) => {
    setSelectTicketForInvoice(ticketId)
    setSelectNameForInvoice(name)
    setSelectEmailForInvoice(email)
    setSelectMobileForInvoice(mobile)
    setIsInvoiceOn(!isInvoiceOn)
  }

  const handleClose = () => setShow(false);
  const handleShow = (queryId) => {
    setUniqueQueryId(queryId);
    setShow(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueQueryId) {
      setError('Unique Query ID is not defined');
      return;
    }
    try {
      const params = {
        userId,
        ticketStatus: formData.ticketStatus,
        comment: formData.comment,
        followUpDateTime: formData.followUpDateTime,
        call_id: callId
      };
      const res = await axiosInstance.post(`/third_party_api/ticket/updateTicketResponse/${uniqueQueryId}`, {}, { params });
      setResponse(res.data.dtoList);
      toast.success('Update successfully!');
      handleClose();
      fetchData(params[activeTab], currentPage, negosPerPage);
      setError(null);
      setCallId(0)
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  // Update handleStatusChange function
  const handleStatusChange = (event) => {
    handleChange(event);
    const { value } = event.target;

    // Show folloeupdatetime input when 'Follow' is selected
    if (value === "Follow") {
      setShowFollowUpDate(true);
    } else {
      setShowFollowUpDate(false);
    }

    // Show transaction details input when 'Sale' is selected
    if (value === "Sale") {
      setShowTransaction(true);
    } else {
      setShowTransaction(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOff = () => {
    setOn(false)
    setProductArray([])
  };
  const handleOn = (queryId, senderName, email, mobile, product) => {
    setUniqueQueryId(queryId);
    setSenderNameForEmail(senderName);
    setSenderEmailForMail(email);
    setSenderMobile(mobile);
    setProductArray(prevArray => [...prevArray, product]);
    setOn(true);
  };




  // Define stages
  const stages = [
    { name: "Stage 1", color: "#ed1c24", stage: 1 },
    { name: "Stage 2", color: "#f7941e", stage: 2 },
    { name: "Stage 3", color: "#8dc63f", stage: 3 },
    // { name: "Stage 4", color: "#00aeef", stage: 4 },
  ];

  // Fetch data from API
  const fetchData = async (stage) => {
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
        userId,
        stage: stage,
      });
      setTicketData(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };

  //handle select products
  const handleSelectProduct = (e) => {
    const selectedProduct = e.target.value;

    if (productArray.includes(selectedProduct)) {
      toast.error("Product is already Added");
    } else {
      setProductArray(prevArray => {
        const updatedArray = [...prevArray, selectedProduct];
        setEmailData(prevEmailData => ({
          ...prevEmailData,
          name: senderNameForEmail,
          email: senderEmailFormail,
          ticketId: uniqueQueryId,
          mobile: senderMobile,
          productList: updatedArray
        }));
        return updatedArray;
      });
      toast.success("Product added");
    }
  };
  //handle send email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await fetchDataForEmail();
      handleOff()
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error("Error sending email");
    }
  };
  //handle close
  const handleCloses = () => setView(false);
  const handleView = (queryId) => {
    setUniqueQueryId(queryId);
    setView(true);
  };

  useEffect(() => {
    fetchData(selectedStage);
  }, [selectedStage]);
  //masking mobile
  const maskMobileNumber = (number) => {
    if (number.length < 4) return number;
    return number.slice(0, -4) + 'XXXX';
  };

  //,asking EMail
  const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
    return `${maskedUser}@${domain}`;
  };

  //click to call
  const handleClick = async (mobile) => {
    console.log(mobile)
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/clickToCall', {
        number: mobile
      });
      setCallId(response.data.call_id)
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };
  //close ticket journey
  const closeTicketJourney = () => {
    document.getElementById("ticketjourney").close()
  }

  //openn and close ticket journey
  const openTicketJourney = (ticketId) => {
    setSelectedTicketInfo(ticketId)
    document.getElementById("ticketjourney").showModal()
  }

  //color of styatus 
  const getColorByStatus = (ticketStatus) => {
    const colors = {
      'New': 'dodgerblue',
      'Sale': 'green',
      'Follow': 'RoyalBlue',
      'Interested': 'orange',
      'Not_Interested': 'red',
      'Wrong_Number': 'gray',
      'Not_Pickup': 'lightblue'
    };
    return colors[ticketStatus] || 'white';
  };

  function formatFollowUpDate(followUpDateTime) {
    const [year, month, day] = followUpDateTime;
    // Convert month to 2-digit format and day to 2-digit format
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  //pagination 
  const [currentPage, setCurrentPage] = useState(1); // To manage current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // To manage rows per page

  // Calculate total pages
  const totalPages = Math.ceil(
    ticketData
      .filter((item) =>
        item.senderName && item.senderName.includes(shortValue) ||
        item.firstName && item.firstName.includes(shortValue) ||
        item.email && item.email.includes(shortValue) ||
        item.mobileNumber && item.mobileNumber.includes(shortValue) ||
        item.senderMobile && item.senderMobile.includes(shortValue)
      )
      .filter((item) =>
        !filterdate ||
        formatFollowUpDate(item.followupDateTime ? item.followupDateTime : "") === filterdate
      ).length / rowsPerPage
  );

  // Handle pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Get the current page data
  const currentData = ticketData
    .filter((item) =>
      item.senderName && item.senderName.includes(shortValue) ||
      item.firstName && item.firstName.includes(shortValue) ||
      item.email && item.email.includes(shortValue) ||
      item.mobileNumber && item.mobileNumber.includes(shortValue) ||
      item.senderMobile && item.senderMobile.includes(shortValue)
    )
    .filter((item) =>
      !filterdate ||
      formatFollowUpDate(item.followupDateTime ? item.followupDateTime : "") === filterdate
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <>
      {/* Stages */}
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <div
              className="pipeline-container"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {stages.map((stage, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedStage(stage.stage)} // Set selected stage
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    width: `calc(100% / ${stages.length})`,
                    cursor: "pointer", // Add cursor pointer to indicate it's clickable
                  }}
                >
                  <div
                    style={{
                      backgroundColor: stage.color,
                      width: "100%",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      flexDirection: "column",
                      clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
                      marginRight: "-25px",
                      zIndex: 1,
                    }}
                  >
                    <div>{stage.count}</div>
                    <div>{stage.name}</div>
                  </div>

                  {index < stages.length - 1 && (
                    <div
                      style={{
                        width: "0",
                        height: "0",
                        borderTop: "50px solid transparent",
                        borderBottom: "50px solid transparent",
                        borderLeft: `25px solid ${stages[index + 1].color}`,
                        position: "absolute",
                        right: "-25px",
                        zIndex: 0,
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="filter-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5">
              <div className="search-wrapper">
                <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search Department or Name..." value={shortValue} onChange={handleShortDataValue} />
                <div className="search-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
            </div>
            {selectedStage === 2 && <div className="col-md-5">
              <div className="search-wrapper d-flex justify-content-center align-items-center">
                <input type="date" name="filterdate" className="form-control" placeholder="Search Department or Name..." value={filterdate} onChange={(e) => setFilterDate(e.target.value)} />
                <div className="search-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>

                </div>
                <i
                  className="fa-solid fa-filter-circle-xmark fa-xl ms-2 hover-scale"
                  onClick={() => setFilterDate(null)}
                ></i>

              </div>

            </div>}
          </div>
        </div>
      </section>
      {/* Table */}
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <div className="followups-table table-responsive table-height">
              <table className="table">
                <thead className="sticky-header">
                  <tr>
                    <th tabIndex="0">Date/Time</th>
                    <th tabIndex="0">Country</th>
                    <th tabIndex="0">Customer Name</th>
                    <th tabIndex="0">Customer Number</th>
                    <th tabIndex="0">Customer Email</th>
                    <th tabIndex="0">Status</th>
                    <th tabIndex="0">Requirement</th>
                    <th tabIndex="0">Action</th>
                    <th tabIndex="0">Ticket ID</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((nego, index) => (
                    <tr key={index}>
                      <td>
                        <span className="text">
                          {nego.senderMobile
                            ? nego.queryTime
                            : nego.uploadDate && [nego.uploadDate[2], nego.uploadDate[1], nego.uploadDate[0]].join("-")}
                        </span>
                      </td>
                      <td>
                        <img src={`https://flagcdn.com/${nego.country && nego.country.toLowerCase()}.svg`} alt={`${nego.senderCountryIso} flag`} style={{ width: '30px' }} />
                        <span className="text">{nego.country}</span>
                      </td>
                      <td><span className="text">{nego.senderName || nego.firstName}</span></td>
                      <td>
                        <CopyToClipboard text={nego.senderMobile}>
                          <button>Copy</button>
                        </CopyToClipboard>
                        <span className="text">{maskMobileNumber(nego.senderMobile || nego.mobileNumber)}</span>
                      </td>
                      <td>
                        <CopyToClipboard text={nego.email}>
                          <button>Copy</button>
                        </CopyToClipboard>
                        <span className="text">{maskEmail(nego.email)}</span>
                      </td>
                      <td>
                        <div className="dropdown" onClick={() => handleShow(nego.uniqueQueryId)}>
                          <a className="btn btn-info dropdown-toggle" role="button" data-bs-toggle="dropdown" style={{ backgroundColor: getColorByStatus(nego.ticketstatus) }}>
                            {nego.ticketstatus}
                          </a>
                        </div>
                      </td>
                      <td><span className="comment">{nego.queryProductName || nego.productEnquiry}</span></td>
                      <td>
                        {/* Add action buttons here */}
                      </td>
                      <td><i className="fa-solid fa-ticket"></i> {nego.uniqueQueryId.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className='d-flex pagination-controls  align-items-center'>
              <div className="pagination-controls">
                <button
                  className=' text-white'
                  style={{ backgroundColor: "#0ecdc6dd" }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-button  text-white ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </span>

                <button
                  className=' text-white'
                  style={{ backgroundColor: "#0ecdc6dd" }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              <div className="table-controls">
                <label className='ml-2'>
                  Rows per page:
                </label>
                <select value={rowsPerPage} onChange={handleRowsPerPageChange}
                  style={{ backgroundColor: "#0ecdc6dd" }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={1000}>1000</option>
                </select>

              </div>
            </div>

          </div>
        </div>
      </section>

      {error && <div className="api-error"> {error.message}</div>}
      <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="followUpModal" tabIndex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
            Call Status
          </h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-select"
                id="status"
                name="ticketStatus"
                value={formData.ticketStatus}
                onChange={handleStatusChange}
              >
                <option>Choose Call-Status</option>
                <option value="Sale">Sale</option>
                {/* <option value="New">New</option> */}
                <option value="Follow">Follow-up</option>
                <option value="Interested">Interested</option>
                <option value="Not_Interested">Not Interested</option>
                <option value="Wrong_Number">Wrong Number</option>
                <option value="Place_with_other">Place with other</option>
                <option value="Not_Pickup">Not Pickup</option>
              </select>
            </div>

            {showSaleTransaction && (
              <div className="mb-3">
                <label htmlFor="transactionDetails" className="form-label">Transaction ID</label>
                <input
                  type="transaction-details"
                  placeholder="Enter Transaction id "
                  className="form-control"
                  id="transactionDetails"
                  name="transactionDetails"
                  value={formData.SaleTransaction}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {showFollowUpDate && (
              <div className="mb-3">
                <label htmlFor="followUpDateTime" className="form-label">Follow Up Date and Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="followUpDateTime"
                  name="followUpDateTime"
                  value={formData.followUpDateTime}
                  onChange={handleChange}
                  step="2"
                />
              </div>
            )}
            <div className="col-12">
              <label htmlFor="comment" className="form-label">Comment</label>
              <textarea
                rows="4"
                className="form-control"
                placeholder="Discribe your conversation with client"
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="modal-footer justify-content-center border-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-primary" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* <!-- -------------- -->
          <!-- ------------------------------------------------------------
          --------------------- seed price and mail Modal ---------------------
        -------------------------------------------------------------- --> */}

      <Modal show={on} onHide={handleOff} className="modal assign-ticket-modal fade" id="followUpModal" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
            Send mail to Customer
          </h1>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="container mt-4">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Customer Detail</h5>
                      <div className="user-info">
                        <div><strong>Name:</strong> {senderNameForEmail}</div>
                        <div><strong>Ticket ID:</strong> {uniqueQueryId}</div>
                        <div><strong>Email:</strong> {senderEmailFormail}</div>
                        <div><strong>Mobile Number:</strong> {senderMobile}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 mt-4 mt-lg-0">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Product Details</h5>
                      <div className="user-info d-flex flex-wrap">
                        {productArray.map((product, index) => (
                          <React.Fragment key={index}>
                            <div>{product}</div>
                            {index !== productArray.length - 1 && <div className="comma">,</div>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mt-4">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="d-flex align-negos-center justify-content-center p-3">
                    <label htmlFor="status" className="form-label mr-3 mb-0">Add Product:</label>
                    <select className="form-select" onChange={handleSelectProduct}>
                      <option value="">Select products</option>
                      {productsList.map((product, index) => (
                        <option key={index} value={product.name}>{product.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer justify-content-center border-0">
              <Button variant="secondary" data-bs-dismiss="modal" onClick={handleOff}>Close</Button>
              <Button variant="primary" onClick={handleSendEmail}>Send</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>



      {/* <!-- Modal ticket popup --> */}
      < Modal
        show={view} onHide={handleCloses}
        className="modal ticket-modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="ticket-content-spacing">
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <div className="heading-area">
                    <div className="vertical-write">
                      <h2 className="title">Jenell D. Matney</h2>
                      <p className="ticket-id">
                        <i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div
                    className="contact-info-row d-flex align-negos-center justify-content-between"
                  >
                    <a href="" className="contact-info phone"
                    ><i className="fa-solid fa-phone"></i> +91 9918293747</a
                    >
                    <a className="contact-info email" href="#"
                    ><i className="fa-solid fa-envelope-open-text"></i>
                      example@email.com</a
                    >
                  </div>
                  <div className="main-content-area">
                    <form>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label" for="flexCheckDefault">
                          Default checkbox
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                        <label className="form-check-label" for="flexCheckChecked">
                          Checked checkbox
                        </label>
                      </div>
                      <div className="col-12">
                        <label htmlFor="comment" className="form-label">Comment</label>
                        <textarea
                          rows="4"
                          className="form-control"
                          placeholder="Discribe your conversation with client"
                          id="comment"
                          name="comment"
                        ></textarea>
                      </div>
                      <div className="modal-footer justify-content-center border-0">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloses}>
                          Close
                        </button>
                        <button className="btn btn-primary" type="submit">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <dialog
        id="ticketjourney"
        className="bg-white rounded shadow"
        style={{ width: '80%', maxWidth: '600px', border: 'none' }}
      >

        <div className="position-fixed  vw-100 d-flex flex-coloumn justify-content-center align-item-center">
          <TicketJourney tktid={selctedTicketInfo} closeFun={closeTicketJourney} />
        </div>
      </dialog>



      {/* //invoice modal */}
      <Modal show={isInvoiceOn} onHide={handleInvoice} className="" id="followUpModal" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className=" w-100 text-center" id="followUpModalLabel">
            <u> Raise Invoice</u>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="card shadow-sm">

              <div>
                <InvoiceBox ticketId={selectTicketForInvoice} name={selectNameForInvoice} email={selectEmailForInvoice} mobile={selectMobileForInvoice} />
              </div>
            </div>
          </div>

        </Modal.Body>
      </Modal>
    </>
  );
}

export default InNegotiation;
