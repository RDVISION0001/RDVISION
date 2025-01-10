import React, { useState, useEffect } from "react";

//components
import Cardinfo from "../components/cardinfo";

import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/AuthContext";

function tickets() {
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: "Sale" },
    newTickets: { ticketStatus: "New" },
  };

  const [activeTab, setActiveTab] = useState("allTickets");
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [show, setShow] = useState(false);
  const [team, setTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { dark } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //Short Method
  const [shortValue, setShortValue] = useState("");
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value);
  };
  const [active ,setActive] = useState(false)
  const handleRowClick = (tabName) => {
    setActive(true)   
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchTickets(params[tabName], 0);
  };

  const handleTicketSelect = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter((ticketId) => ticketId !== id));
    }
  };

  const sendPostRequest = async () => {
    try {
      const payload = selectedTickets;
      const config = {
        headers: {
          // 'teamId': parseInt(selectedTeam)
        },
      };
      const url = `/third_party_api/ticket/assignToTeam/${selectedTeam}`;
      const response = await axiosInstance.post(url, payload, config);
      setApiResponse(response.data);
      toast.success("Tickets assigned successfully!");
      handleClose();
      fetchTickets();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to assign tickets.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/team/getAllTeams");
      setTeam(response.data.dtoList);
    };
    fetchData();
  }, []);

  const handleSelectTeam = (e) => {
    setSelectedTeam(e.target.value);
  };

  const fetchTickets = async (params, page) => {
    try {
      const response = await axiosInstance.get(
        "/third_party_api/ticket/ticketByStatus",
        {
          params: { ...params, page },
        }
      );
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets(params.allTickets, 0);
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchTickets(params[activeTab], currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchTickets(params[activeTab], currentPage + 1);
    }
  };

  const [activeButton, setActiveButton] = useState("all");
  const getButtonClass = (button) => {
    const isActive = activeButton === button;
    const borderClass = isActive
      ? dark
        ? "border border-primary px-1 rounded"
        : "border border-primary px-1 rounded"
      : "px-4 py-1 rounded";

    return `btn ${borderClass}`;
  };

  return (
    <>
      <div className={`admin-page tickets-page ${dark ? "bg-dark" : ""}`}>
        <div className="my-container main-content-block2658">
          <div className="container-fluid py-3 ">
            {/* <!-- Section one --> */}
            <Cardinfo />
            <section className={`filter-section ${dark ? "bg-dark" : ""}`}>
              <div className="container-fluid ">
                <div className="row">
                  <div className="col-md-5">
                    <div className="search-wrapper">
                      <input
                        type="text"
                        name="search-user"
                        id="searchUsers"
                        className={`form-control ${
                          active ? "bg-secondary text-light " : ""
                        }`}
                        placeholder="Search Department or Name..."
                        value={shortValue}
                        onChange={handleShortDataValue}
                      />
                      <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="filter-wrapper d-flex gap-3">
                      {/* Filters here */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section
              className={`data-table-bgs_02x24 py-3  ${dark ? "bg-dark" : ""}`}
            >
              <div className="container-fluid">
                <div
                  className={`table-wrapper tabbed-table  ${
                    dark ? "bg-dark text-light" : ""
                  } `}
                >
                  <div className="heading-wrapper">
                    <h3 className={`${dark?"text-light":""}`}>All Tickets</h3>
                    <button
                      onClick={handleShow}
                      className="btn btn-primary "
                      data-bs-toggle="modal"
                      data-bs-target="#assignTicketModal"
                    >
                      Assign Ticket
                    </button>
                  </div>
                  <div className="d-flex gap-5 py-2">
                    <button
                      className={`nav-link btn btn-primary text-light px-2 py-1 rounded ${
                        activeTab === "allTickets" ? "active" : ""
                      }`}
                      onClick={() => handleRowClick("allTickets")}
                      id="all-transactions-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#all-transactions-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="all-transactions-tab-pane"
                      aria-selected={activeTab === "allTickets"}
                    >
                      All Tickets
                    </button>

                    <button
                      className={`nav-link btn btn-primary text-light px-2 py-1 rounded ${
                        activeTab === "ongoing" ? "active" : ""
                      }`}
                      onClick={() => handleRowClick("ongoing")}
                      id="pendings-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#pendings-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="pendings-tab-pane"
                      aria-selected={activeTab === "ongoing"}
                    >
                      Ongoing
                    </button>

                    <button
                      className={`nav-link btn btn-primary text-light px-2 py-1 rounded ${
                        activeTab === "newTickets" ? "active" : ""
                      }`}
                      onClick={() => handleRowClick("newTickets")}
                      id="new-arrivals-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#new-arrivals-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="new-arrivals-tab-pane"
                      aria-selected={activeTab === "newTickets"}
                    >
                      New Tickets
                    </button>
                  </div>

                  <div
                    className="tab-content recent-transactions-tab-body"
                    id="myTabContent"
                  >
                    <div
                      className="tab-pane fade show active"
                      id="all-transactions-tab-pane"
                      role="tabpanel"
                      aria-labelledby="all-transactions-tab"
                      tabIndex="0"
                    >
                      <div className="tickets-table table-responsive">
                        <table className={`table table-bordered ${dark?"table-dark":""} `}>
                          <thead>
                            <tr>
                              <th
                                className={`${dark?"text-secondary":""}`}
                                data-row-selection="true"
                              >
                               Sel
                              </th>
                              <th   className={`${dark?"text-secondary":""}`} tabindex="0">Date/Time</th>
                              <th   className={`${dark?"text-secondary":""}`} tabindex="0">Country</th>
                              <th   className={`${dark?"text-secondary":""}`} tabIndex="0">Customer </th>
                              <th   className={`${dark?"text-secondary":""}`} tabIndex="0">Mobile </th>
                              <th   className={`${dark?"text-secondary":""}`} tabIndex="0">Customer Email</th>
                              <th   className={`${dark?"text-secondary":""}`} tabIndex="0">Ticket ID</th>
                              <th   className={`${dark?"text-secondary":""}`} tabIndex="0">Requirement</th>
                              <th   className={`${dark?"text-secondary":""}`} tabIndex="0">Product Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data
                              .filter(
                                (item) =>
                                  item.senderMobile
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase()) ||
                                  item.senderEmail
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase()) ||
                                  item.senderName
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase())
                              )
                              .map((item) => (
                                <tr key={item.uniqueQueryId}>
                                  <td className="selection-cell">
                                    <input
                                      type="checkbox"
                                      checked={selectedTickets.includes(
                                        item.uniqueQueryId
                                      )}
                                      onChange={(e) =>
                                        handleTicketSelect(
                                          e,
                                          item.uniqueQueryId
                                        )
                                      }
                                    />
                                  </td>
                                  <td>{item.queryTime}</td>
                                  <td>{item.senderCountryIso}</td>
                                  <td>{item.senderName}</td>
                                  <td>{item.senderMobile}</td>
                                  <td>{item.senderEmail}</td>
                                  <td>{item.uniqueQueryId}</td>
                                  <td>{item.subject}</td>
                                  <td>{item.queryProductName}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Pending tab */}
                    <div
                      className="tab-pane fade"
                      id="pendings-tab-pane"
                      role="tabpanel"
                      aria-labelledby="pendings-tab"
                      tabIndex="0"
                    >
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th
                                className="selection-cell-header"
                                data-row-selection="true"
                              >
                                <input type="checkbox" className="" />
                              </th>
                              <th tabIndex="0">Query ID</th>
                              <th tabIndex="0">Query McatName</th>
                              <th tabIndex="0">Sender Company</th>
                              <th tabIndex="0">Sender Name</th>
                              <th tabIndex="0">Sender Mobile</th>
                              <th tabIndex="0">Sender Address</th>
                              <th tabIndex="0">Query Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data
                              .filter(
                                (item) =>
                                  item.senderMobile
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase()) ||
                                  item.senderEmail
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase()) ||
                                  item.senderName
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase())
                              )
                              .map((item) => (
                                <tr key={item.uniqueQueryId}>
                                  <td className="selection-cell">
                                    <input
                                      type="checkbox"
                                      checked={selectedTickets.includes(
                                        item.uniqueQueryId
                                      )}
                                      onChange={(e) =>
                                        handleTicketSelect(
                                          e,
                                          item.uniqueQueryId
                                        )
                                      }
                                    />
                                  </td>
                                  <td>{item.uniqueQueryId}</td>
                                  <td>{item.queryMcatName}</td>
                                  <td>{item.senderCompany}</td>
                                  <td>{item.senderName}</td>
                                  <td>{item.senderMobile}</td>
                                  <td>{item.senderAddress}</td>
                                  <td>{item.queryMessage}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* New tab */}
                    <div
                      className="tab-pane fade"
                      id="new-arrivals-tab-pane"
                      role="tabpanel"
                      aria-labelledby="new-arrivals-tab"
                      tabIndex="0"
                    >
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th
                                className="selection-cell-header"
                                data-row-selection="true"
                              >
                                <input type="checkbox" className="" />
                              </th>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Country</th>
                              <th tabIndex="0">Customer Name</th>
                              <th tabIndex="0">Customer Number</th>
                              <th tabIndex="0">Query ID</th>
                              <th tabIndex="0">Requirement</th>
                              <th tabIndex="0">Product Name</th>
                              <th tabIndex="0">Customer Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data
                              .filter(
                                (item) =>
                                  item.senderMobile
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase()) ||
                                  item.senderEmail
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase()) ||
                                  item.senderName
                                    .toLowerCase()
                                    .includes(shortValue.toLowerCase())
                              )
                              .map((item) => (
                                <tr key={item.uniqueQueryId}>
                                  <td className="selection-cell">
                                    <input
                                      type="checkbox"
                                      checked={selectedTickets.includes(
                                        item.uniqueQueryId
                                      )}
                                      onChange={(e) =>
                                        handleTicketSelect(
                                          e,
                                          item.uniqueQueryId
                                        )
                                      }
                                    />
                                  </td>
                                  <td>{item.queryTime}</td>
                                  <td>{item.senderCountryIso}</td>
                                  <td>{item.senderName}</td>
                                  <td>{item.senderMobile}</td>
                                  <td>{item.uniqueQueryId}</td>
                                  <td>{item.queryMessage}</td>
                                  <td>{item.queryProductName}</td>
                                  <td>{item.senderEmail}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pagination-controls">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Tickets to Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="teamSelect">Select Team</label>
              <select
                className="form-control"
                id="teamSelect"
                onChange={handleSelectTeam}
                value={selectedTeam}
              >
                <option value="">Choose...</option>
                {team.map((t) => (
                  <option key={t.teamId} value={t.teamId}>
                    {t.teamName}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={sendPostRequest}>
            Assign Tickets
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" />
    </>
  );
}

export default tickets;
