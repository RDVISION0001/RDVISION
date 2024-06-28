import React, { useState, useEffect } from 'react';
// Components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import axiosInstance from '../axiosInstance';

function ticketsm() {
  // Define parameters for each tab
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
  };

  // State variables
  const [activeTab, setActiveTab] = useState("allTickets");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Function to handle tab click
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    fetchTickets(params[tabName], 0);
  };

  // Function to fetch tickets based on parameters and page number
  const fetchTickets = async (params, page) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', { params: { ...params, page } });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Fetch all tickets on component mount
  useEffect(() => {
    fetchTickets(params.allTickets, 0);
  }, []);

  // Pagination controls
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

  return (
    <>
      <div className="superadmin-page">
        <Sidenav />
        <div className="my-container main-content-block2658 tickets-page active-cont">
          <Topnav />
          <div className="container-fluid mt-3">
            <section className="sadmin-top-section">
              <div className="container-fluid">
                <div className="row g-3">
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

            {/* <!-- section 2 --> */}
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">All Tickets</h3>
                  <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("allTickets")} id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                        onClick={() => handleRowClick("ongoing")} id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabIndex="-1">Ongoing</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("newTickets")} id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabIndex="-1">New Tickets</button>
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
                            {data.map((item) => (
                              <tr key={item.uniqueQueryId}>
                                <td className="selection-cell">
                                  <input type="checkbox" className="" />
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
                    <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabIndex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabIndex="0">Ticket ID</th>
                              <th tabIndex="0">Client Name</th>
                              <th tabIndex="0">Category/Department</th>
                              <th tabIndex="0">Source</th>
                              <th tabIndex="0">Contact</th>
                              <th tabIndex="0">Email</th>
                              <th tabIndex="0">Status</th>
                              <th tabIndex="0">Description/Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Equipments</td>
                              <td><span className="status">GAds</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Connected</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            {/* Add more rows here */}
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
                              <th tabIndex="0">Ticket ID</th>
                              <th tabIndex="0">Client Name</th>
                              <th tabIndex="0">Category/Department</th>
                              <th tabIndex="0">Source</th>
                              <th tabIndex="0">Contact</th>
                              <th tabIndex="0">Email</th>
                              <th tabIndex="0">Description/Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#96544785</td>
                              <td>Jane Doe</td>
                              <td>IT Services</td>
                              <td><span className="status">Website</span></td>
                              <td>+91 XXXXXXXX 91</td>
                              <td>****@gmail.com</td>
                              <td>New ticket raised regarding....</td>
                            </tr>
                            {/* Add more rows here */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                    <span>{currentPage + 1} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}


export default ticketsm