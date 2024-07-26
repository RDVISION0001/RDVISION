import React, { useState, useEffect } from 'react';
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function upload_tickets() {
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
  };

  const [activeTab, setActiveTab] = useState("allTickets");
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [show, setShow] = useState(false);
  const [team, setTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchTickets(params[tabName], 0);
  };

  const handleTicketSelect = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    }
  };

  const sendPostRequest = async () => {
    try {
      const payload = selectedTickets;
      const config = {
        headers: {
          // 'teamId': parseInt(selectedTeam)
        }
      };
      const url = `/third_party_api/ticket/assignToTeam/${selectedTeam}`;
      const response = await axiosInstance.post(url, payload, config);
      setApiResponse(response.data);
      toast.success('Tickets assigned successfully!');
      handleClose();
     fetchTickets()
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign tickets.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/team/getAllTeams');
      setTeam(response.data.dtoList);
    };
    fetchData();
  }, []);

  const handleSelectTeam = (e) => {
    setSelectedTeam(e.target.value);
  };

  const fetchTickets = async (params, page) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
        params: { ...params, page }
      });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching tickets:', error);
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

  return (
    <>
      <div className="admin-page tickets-page">
        <Sidenav />
        <div className="my-container main-content-block2658 active-cont">
          <Topnav />
          <div className="container-fluid mt-3">
            <section className="filter-section">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-5">
                    <div className="search-wrapper">
                      <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search Department or Name..." />
                      <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <div className="heading-wrapper">
                    <h3 className="title">Upload Tickets File</h3>
                  </div>
                  <input type="file" class="form-control" id="customFile" />
                </div>
              </div>
            </section>
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <div className="heading-wrapper">
                    <h3 className="title">All Tickets</h3>
                    <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal">Hii</Button>
                  </div>
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
                              <th tabIndex="0">Customer Email</th>
                              <th tabIndex="0">Ticket ID</th>
                              <th tabIndex="0">Requirement</th>
                              <th tabIndex="0">Product Name</th>
                            </tr>
                          </thead>
                          <tbody>
                        
                              <tr >
                              <td className="selection-cell">
                                  <input
                                    type="checkbox"
                                  />
                                </td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                              </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Pending tab */}
                    <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabIndex="0">
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
                              <tr >
                                <td className="selection-cell">
                                  <input
                                    type="checkbox"
                                  />
                                </td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                              </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* New tab */}
                    <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabIndex="0">
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
                           
                              <tr >
                                <td className="selection-cell">
                                  <input
                                    type="checkbox"
                                  />
                                </td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                                <td>hello</td>
                              </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
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


export default upload_tickets