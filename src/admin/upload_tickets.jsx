import React, { useState, useEffect } from 'react';

//components
import Uploaded_tickets from '../pages/uploaded_tickets';

import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'react-bootstrap';

function upload_tickets() {
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
  };

  // Data state
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("allTickets");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [seletedUserType, setSelectedUserType] = useState(0)
  const [selectedUserOfSelectedUserType, setSelectedUserOfSelectedUserType] = useState(0)
  const [user, setUser] = useState([])

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSelectUserType = (e) => {
    setSelectedUserType(e.target.value)

  }

  //handl paggination
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  //selecting user type
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/user/dropdown', {
        params: { roleId: seletedUserType }
      });
      setUser(response.data.dtoList);
    };
    fetchData();
  }, [seletedUserType]);

  //selecting user of selected type
  const handleSelectUserOfSelectedUserType = (e) => {
    setSelectedUserOfSelectedUserType(e.target.value)

  }
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 9;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(currentPage - halfMaxPagesToShow, 0);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 0);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };


  // Upload ticket state
  const [dataToSave, setDataToSave] = useState({
    csvStringData: ""
  });

  // Fetch uploded csv file tickets
  const fetchTickets = async (params, page, perPage) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/upload/allTicketsByStatus', {
        params: { ...params, page, size: perPage }
      });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);

      // Update notification count based on totalElement
      if (params.ticketStatus === 'New') {
        const newCount = response.data.totalElement;
        if (newCount > newNotifications) {
          playNotificationSound();
        }
        setNewNotifications(newCount);
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false)
    }
    setLoading(false)
  };

  // Handle tab change
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    fetchTickets(params[tabName], 0);
  };

  // Upload ticket
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setDataToSave(prevState => ({ ...prevState, csvStringData: event.target.result }));
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast.error("Failed to read the file.");
      };
      reader.readAsText(file);
    } else {
      toast.error("No file selected.");
    }
  };

  const handleUploadDataToDB = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/upload/addCsvTicket", dataToSave);
      response.data === "CSV Tickets uploaded successfully" ? toast.info("Successfully uploaded") : toast.error("Something went wrong. Try again!");
    } catch (error) {
      toast.error("Error uploading data.");
    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    fetchTickets(params[activeTab], currentPage, itemsPerPage);
  }, [activeTab, itemsPerPage, currentPage]);

  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(0);
  };
  //hanlde select tickets
  const [selectedTickets, setSelectedTickets] = useState([]);
  const handleTicketSelect = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    }
  };
  // handling multiple selection
  const handleMultipleTicketSelection = (e) => {
    const checked = e.target.checked; // Use `checked` instead of `value` to determine if the checkbox is checked
    if (checked) {
      let newSelectedTickets = [...selectedTickets]; // Start with the current state
      for (let i = 0; i < data.length; i++) {
        newSelectedTickets.push(data[i].uniqueQueryId); // Add the new elements
      }
      setSelectedTickets(newSelectedTickets); // Update the state once with the new array
    } else {
      setSelectedTickets([]); // Reset to an empty array
    }
  };


  ///assign function
  const sendPostRequest = async () => {
    try {
      const payload = selectedTickets;
      const config = {
        headers: {
          // 'teamId': parseInt(selectedTeam)
        }
      };
      const url = `/upload/assignToUser/${selectedUserOfSelectedUserType}`;
      const response = await axiosInstance.post(url, payload, config);
      toast.success('Tickets assigned successfully!');
      handleClose();
      fetchTickets()
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign tickets.');
    }
  };

  //show modal to assign tickets
  const handleShow = () => {
    if (selectedTickets.length > 0) {
      setShow(true)
    } else {
      toast.info("Please select at least One Ticket")
    }
  }
  return (
    <>
      <ToastContainer />

      <div className="container-fluid mt-3">
        <section className="data-table-bgs_02x24 py-3">
          <div className="container-fluid">
            <div className="table-wrapper tabbed-table">
              <div className="heading-wrapper">
                <h3 className="title">Upload Tickets File</h3>
              </div>
              <div className="d-flex align-items-center mb-3">
                <input type="file" accept=".csv" className="form-control mr-3" id="customFile" onChange={handleFileUpload} />
                {loading ? <div className='w-25 btn rounded'><div className='loader '></div></div> : <button className="btn btn-primary ml-3 rounded" style={{ flex: '0 0 25%' }} onClick={handleUploadDataToDB}>Upload Data</button>}
              </div>
            </div>
          </div>
        </section>

        <Uploaded_tickets />
      </div>

    </>
  );
}


export default upload_tickets;