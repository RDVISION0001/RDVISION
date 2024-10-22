import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Modal } from 'react-bootstrap';
import axiosInstance from '../../axiosInstance';

// Authentication context
import { useAuth } from '../../auth/AuthContext'
import TicketJourney from '../../components/TicketJourney';
import InvoiceBox from '../../components/InvoiceBox';

import { toast } from 'react-toastify';
import QuotationBox from '../../components/QuotationBox';


function InNegotiation() {

  const [selectedKey, setSelectedKey] = useState(null)
  const { setFolowupUpdate } = useAuth()

  const [list, setlist] = useState(true)
  const [ticketData, setTicketData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(1); // Default stage is 2
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
  const [assignedTo, setAssignedTo] = useState(0)
  const [buttonFilterValue, setbuttonFilterValue] = useState("")
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
  const toggleCheckbox = () => {
    setlist(!list); // Toggle the state
  };
  const [isInvoiceOn, setIsInvoiceOn] = useState(false)
  const handleInvoice = (ticketId, name, email, mobile) => {
    setSelectTicketForInvoice(ticketId)
    setSelectNameForInvoice(name)
    setSelectEmailForInvoice(email)
    setSelectMobileForInvoice(mobile)
    setIsInvoiceOn(!isInvoiceOn)
  }
  const [dorpedInStage, setDropedinStage] = useState(null)
  const handleClose = () => {
    setShow(false)
    setShowTransaction(false)
  };
  const handleShow = (queryId, targetStage) => {
    setDropedinStage(targetStage)
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
      const res = await axiosInstance.post(`/${uniqueQueryId.length < 15 ? "third_party_api/ticket" : "upload"}/updateTicketResponse/${uniqueQueryId}`, {}, { params }); setResponse(res.data.dtoList);
      toast.success('Update successfully!');
      setFolowupUpdate(uniqueQueryId)
      handleClose();
      fetchData(params[activeTab], currentPage, negosPerPage);
      setError(null);
      setCallId(0)

    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
    if (!list) {
      fetchDatas1()
      fetchDatas2()
      fetchDatas3()
    }
    setDropedinStage(null)

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
  const handleOn = (ticketId, name, email, mobile) => {
    setSelectTicketForInvoice(ticketId)
    setSelectNameForInvoice(name)
    setSelectEmailForInvoice(email)
    setSelectMobileForInvoice(mobile)
    setOn(!isInvoiceOn)
  }

  const [stage1Data, setSatge1Data] = useState([])
  const [stage2Data, setSatge2Data] = useState([])
  const [stage3Data, setSatge3Data] = useState([])

  useEffect(() => {
    if (!list) {
      fetchDatas1()
      fetchDatas2()
      fetchDatas3()
    }
  }, [list, assignedTo])
  const fetchDatas1 = async (stage) => {
    console.log(assignedTo)
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
        user: assignedTo,
        stage: 1,
      });
      setSatge1Data(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };
  const fetchDatas2 = async (stage) => {
    console.log(assignedTo)
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
        user: assignedTo,
        stage: 2,
      });
      setSatge2Data(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };
  const fetchDatas3 = async (stage) => {
    console.log(assignedTo)
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
        user: assignedTo,
        stage: 3,
      });
      setSatge3Data(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };

  const handleSelecteRow = (index) => {
    setSelectedKey(index)
    console.log(selectedKey)
  }

  // Define stages
  const stages = [
    { name: " Not Pickup, Not interested,Wrong Number", color: "#ed1c24", stage: 1 },
    { name: "Palce With Others, Followup, Call Back, Interested,", color: "#f7941e", stage: 2 },
    { name: "Sale", color: "#8dc63f", stage: 3 },
    // { name: "Stage 4", color: "#00aeef", stage: 4 },
  ];

  // Fetch data from API
  const fetchData = async (stage) => {
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/negotiationstagebased', {
        user: assignedTo,
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
  }, [selectedStage, assignedTo]);
  //masking mobile
  const maskMobileNumber = (number) => {
    if (number.length < 4) return number;
    return number.slice(0, -4) + 'XXXX';
  };

  //masking EMail
  const maskEmail = (email) => {
    if (email) {
      const [user, domain] = email.split('@');
      const maskedUser = user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
      return `${maskedUser}@${domain}`;
    }
  };

  //click to call
  const handleClick = async (number) => {
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/clickToCall', {
        number: formatNumberAccordingToHodu(number),
        userId
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

  const formatNumberAccordingToHodu = (number) => {
    if (number.includes("+")) {
      return number.replace(/[+-]/g, "")
    } else {
      return "1" + number
    }

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
    ).filter((ticket) => {
      // If buttonFilterValue is an empty string, return all tickets
      if (buttonFilterValue === "") {
        return true;
      }
      // Otherwise, filter based on ticketStatus
      return ticket.ticketstatus.toLowerCase() === buttonFilterValue.toLowerCase();
    })
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);



  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const handleDragStart = (e, item, stage) => {
    setDraggedItem(item);
    setDragSource(stage);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();

    if (dragSource !== targetStage) {
      // Move the item to the target stage
      const sourceData = {
        stage1: stage1Data,
        stage2: stage2Data,
        stage3: stage3Data,
      };

      setSatge1Data(sourceData.stage1.filter(ticket => ticket !== draggedItem));
      setSatge2Data(sourceData.stage2.filter(ticket => ticket !== draggedItem));
      setSatge3Data(sourceData.stage3.filter(ticket => ticket !== draggedItem));

      if (targetStage === 'stage1') {
        setSatge1Data(prev => [...prev, draggedItem]);
      } else if (targetStage === 'stage2') {
        setSatge2Data(prev => [...prev, draggedItem]);
      } else if (targetStage === 'stage3') {
        setSatge3Data(prev => [...prev, draggedItem]);

      }
      console.log(`Dropped Ticket ID: ${draggedItem.uniqueQueryId} to ${targetStage}`);
      handleShow(draggedItem.uniqueQueryId, targetStage)
      if (targetStage === "stage3") {
        setShowTransaction(true)
        setFormData((preData) => ({
          ...preData,
          ticketStatus: "Sale"
        }));
      }

      // Reset dragged item and source

      setDraggedItem(null);
      setDragSource(null);
    }
  };

  const handleShowUniqe = (uniqueQueryId) => {
    // Your existing handleShow function logic
    console.log(`Show ticket with ID: ${uniqueQueryId}`);
  };

  const convertNumberToStringMonth = (number) => {
    switch (number) {
      case 1:
        return 'Jan';
      case 2:
        return 'Feb';
      case 3:
        return 'Mar';
      case 4:
        return 'Ap';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'Aug';
      case 9:
        return 'Sep';
      case 10:
        return 'Oct';
      case 11:
        return 'Nov';
      case 12:
        return 'Dec';
      default:
        return 'Invalid month';
    }
  };
  function convertTo12HourFormat(time) {
    if (time) {
      // Split the input time into hours, minutes, and seconds
      let [hours, minutes, seconds] = time.split(':');

      // Convert the string values to numbers
      hours = parseInt(hours);

      // Determine AM or PM based on the hour
      let period = hours >= 12 ? 'PM' : 'AM';

      // Convert the hour from 24-hour to 12-hour format
      hours = hours % 12 || 12; // Use 12 for 0 (midnight) and 12 (noon)

      // Return the time in 12-hour format
      return `${hours}:${minutes}:${seconds} ${period}`;
    }
  }

  const formatLocalDateTime = (localDateTimeArray) => {
    // Destructure the input array into individual date components
    const [year, month, day, hours, minutes] = localDateTimeArray;

    // Define month names in a short form (JAN, FEB, etc.)
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Format minutes to always have two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Construct the formatted date string
    const formattedDate = `${day}-${monthNames[month - 1]}-${year} ${formattedHours}:${formattedMinutes} ${period}`;

    return formattedDate;
  };

  const stageSelection=(stage)=>{
    setbuttonFilterValue("");
    setSelectedStage(stage)
  }

  return (
    <>
      <div className='d-flex justify-content-end w-100'>
        <div className='w-25 d-flex justify-content-center' >

          <div className="form-check" style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              checked={assignedTo === userId}
              onChange={() => setAssignedTo(userId)} // Call toggle method on change
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Assigned to me
            </label>
          </div>
          <div className="form-check" style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckChecked"
              checked={assignedTo === 0} // Checked if 'list' is false
              onChange={() => setAssignedTo(0)} // Call toggle method on change
            />
            <label className="form-check-label" htmlFor="flexCheckChecked">
              All negotiation tickets
            </label>
          </div>
        </div>
        <div className='w-25 d-flex justify-content-center' >
          <div>choose view</div>
          <div className="form-check" style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              checked={list}
              onChange={toggleCheckbox} // Call toggle method on change
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              List
            </label>
          </div>
          <div className="form-check" style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckChecked"
              checked={!list} // Checked if 'list' is false
              onChange={toggleCheckbox} // Call toggle method on change
            />
            <label className="form-check-label" htmlFor="flexCheckChecked">
              Card
            </label>
          </div>
        </div>
      </div>
      {list &&
        <div>
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
                      onClick={() => stageSelection(stage.stage)} // Set selected stage
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                        width: `calc(100% / ${stages.length})`,
                        cursor: "pointer", // Add cursor pointer to indicate it's clickable
                        fontSize: "inherit", // Default to inherit if not selected
                        color: selectedStage === stage.stage ? "black	" : "white", // Change text color for selected stage
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: stage.color, // Highlight selected stage
                          width: "100%",
                          height: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          flexDirection: "column",
                          clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
                          marginRight: "-25px",
                          zIndex: 1,
                          boxShadow: selectedStage === stage.stage ? "0 0 10px 5px black" : "none", // Optional box-shadow for highlighting
                        }}
                      >
                        <div
                          style={{

                            fontSize: selectedStage === stage.stage ? "25px" : "inherit", // Default to inherit if not selected
                            color: selectedStage === stage.stage ? "black	" : "white", // Change text color for selected stage
                          }}
                        >Stage :{stage.stage}</div>
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
          {/*Filters*/}

          <section className='d-flex justify-content-center'>
            <div className=' w-50 d-flex justify-content-around p-3'>
              {selectedStage !== 3 && <button className={`${buttonFilterValue === "" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("")}>All</button>}
              {selectedStage === 2 && <><button className={`${buttonFilterValue === "Follow" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Follow")}>Follow</button>
              <button className={`${buttonFilterValue === "Call_Back" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Call_Back")}>Call_Back</button>
                <button className={`${buttonFilterValue === "Interested" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Interested")}>Interested</button>
                <button className={`${buttonFilterValue === "Place_with_other" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Place_with_other")}>Place With Others</button>
               </>}
              {selectedStage === 1 && <>  <button className={`${buttonFilterValue === "Wrong_Number" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Wrong_Number")}>Wrong_Number</button>
                <button className={`${buttonFilterValue === "Not_Pickup" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Not_Pickup")}>Not-pickup</button>
                <button className={`${buttonFilterValue === "Not_Interested" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Not_Interested")}>Not-Interested</button></>}
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
                        <th tabIndex="0" >S.No.</th>
                        <th tabIndex="0" style={{ width: "120px" }}>Date/Time</th>
                        <th tabIndex="0">Country</th>
                        <th tabIndex="0">Customer Name</th>
                        <th tabIndex="0">Customer Number</th>
                        <th tabIndex="0">Customer Email</th>
                        <th tabIndex="0">Status</th>
                        <th tabIndex="0">Requirement</th>
                        {selectedStage === 2 && <th tabIndex="0">Follow Date/Time</th>}
                        <th tabIndex="0">Follow Comment</th>
                        <th tabIndex="0">Action</th>
                        <th tabIndex="0">Ticket ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((nego, index) => (
                        <tr key={index}
                          style={{
                            boxShadow: index === selectedKey ? "0px 5px 15px 0px gray" : "",
                            zIndex: index === selectedKey ? 1 : "auto",
                            position: index === selectedKey ? "relative" : "static"
                          }}
                          onClick={() => handleSelecteRow(index)}
                        >
                          <td>{index + 1}.</td>
                          <td>
                            <span className="text">
                              {nego.senderMobile
                                ? <div className='d-flex flex-column'><span className="text">{nego.queryTime.split(" ")[0].split("-")[2]}-{convertNumberToStringMonth(parseInt(nego.queryTime.split(" ")[0].split("-")[1]))}-{nego.queryTime.split(" ")[0].split("-")[0]}</span><span>{convertTo12HourFormat(nego.queryTime.split(" ")[1])}</span></div>

                                : nego.uploadDate && [nego.uploadDate[2], convertNumberToStringMonth(parseInt(nego.uploadDate[1])), nego.uploadDate[0]].join("-")}
                            </span>
                          </td>
                          <td>
                            <img src={`https://flagcdn.com/${nego.country && nego.country.toLowerCase()}.svg`} alt={`${nego.senderCountryIso} flag`} style={{ width: '30px' }} />
                            <span className="text">{nego.country}</span>
                          </td>
                          <td><span className="text">{nego.senderName || nego.firstName}</span></td>
                          <td>
                            <CopyToClipboard text={nego.senderMobile ? nego.senderMobile : nego.mobileNumber}>
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
                          <td className="hover-cell"><span className="comment">{(nego.queryProductName && nego.queryProductName.slice(0, 10)) || (nego.productEnquiry && nego.productEnquiry.slice(0, 10))}</span>
                            <span className="message ">{nego.queryProductName || nego.productEnquiry}</span>
                          </td>
                          {selectedStage === 2 && <td><span className="text">{nego.followupDateTime ? formatLocalDateTime(nego.followupDateTime) : ""}</span></td>
                          }
                          <td>{nego.comment}</td>
                          <td>
                            <span className="actions-wrapper">
                              <Button
                                onClick={() => openTicketJourney(nego.uniqueQueryId)}
                                // onClick={handleView}
                                data-bs-toggle="modal"
                                data-bs-target="#followUpModal"
                                className="btn-action call bg-danger"
                                title="Get connect on call"
                              ><i className="fa-solid fa-info "></i>
                              </Button>
                              <Button
                                onClick={() => handleClick(nego.senderMobile ? nego.senderMobile : nego.mobileNumber)}
                                data-bs-toggle="modal"
                                data-bs-target="#followUpModal"
                                className="btn-action call"
                                title="Get connected on call"
                              >
                                <i className="fa-solid fa-phone"></i>
                              </Button>

                              <a
                                href={`sms:${nego.senderMobile ? nego.senderMobile.split("-")[1] : nego.mobileNumber}?&body=${`Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}. If you're looking for a good deal, please type YES👍`}`}
                                className="btn-action message"
                                title="Get connected on message"
                              >
                                <i className="fa-solid fa-message"></i>
                              </a>

                              <Button
                                onClick={() => handleOn(nego.uniqueQueryId, nego.senderName, nego.senderEmail, nego.senderMobile, nego.queryProductName)}
                                // href="mailto:someone@example.com"
                                className="btn-action email"
                                title="Get connect on email"
                              ><i className="fa-solid fa-envelope"></i
                              ></Button>
                              <a href={`https://wa.me/${nego.senderMobile ? nego.senderMobile.split("-")[1] : nego.mobileNumber}?text=${`Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}. if you're looking for a good deal please type YES👍`}`}
                                target='_blank'
                                className="btn-action whatsapp"
                                title="Get connect on whatsapp"
                              ><i className="fa-brands fa-whatsapp"></i></a>
                              <Button
                                onClick={() => handleInvoice(nego.uniqueQueryId, nego.senderName, nego.senderEmail, nego.senderMobile)}
                                className="rounded-circle "
                                title="Get connect on"
                              >
                                <i className="fa-solid fa-file-invoice"></i>
                              </Button>
                            </span>
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
        </div>}
      {
        !list &&
        <div className='p-3'>
          <div className="row g-0">
            {['stage1', 'stage2', 'stage3'].map((stage, idx) => (
              <div className={`col-sm text-center `} key={stage}>
                <div className='border'>
                  <span className='fw-bold'>{`Stage ${idx + 1}`}</span>
                  <div>{`consisting Status ${stage === 'stage1' ? 'Not Connected, wrong mobile number and Not Pickup' : stage === 'stage2' ? 'Connected follow-ups and call backs' : 'only sale'}`}</div>
                </div>
                <div className='d-flex flex-wrap justify-content-around' onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage)}>
                  {(stage === 'stage1' ? stage1Data : stage === 'stage2' ? stage2Data : stage3Data).map((ticket) => (
                    <div
                      key={ticket.uniqueQueryId}
                      className="border text-sm m-2 tktcard"
                      style={{ width: "15rem", borderRadius: "10px", cursor: "pointer" }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket, stage)}
                    >
                      <div className='m-1'>
                        <div className='text-black' style={{ fontSize: "12px" }}>{ticket.comment || "comment not available"}</div>
                        <div className='text-secondary' style={{ fontSize: "12px" }}>{ticket.productEnquiry || "Enquiry not available"}</div>
                      </div>
                      <div className='text-primary p-1' style={{ borderTop: "1px solid #D3D3D3" }} onClick={() => handleShowUniqe(ticket.uniqueQueryId)}>
                        {ticket.ticketstatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
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
                {
                  dorpedInStage === "stage3" &&
                  <>
                    <option value="Sale" >Sale</option>
                  </>
                }

                {/* <option value="New">New</option> */}
                {
                  dorpedInStage === "stage1" &&
                  <>
                    <option value="Not_Pickup">Not Pickup</option>
                    <option value="Wrong_Number">Wrong Number</option>
                  </>
                }
                {
                  dorpedInStage === "stage2" &&
                  <>

                    <option value="Follow">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Not_Interested">Not Interested</option>

                    <option value="Place_with_other">Place with other</option>
                  </>
                }
                {
                  dorpedInStage == null &&
                  <>
                    <option value="Not_Pickup">Not Pickup</option>
                    <option value="Wrong_Number">Wrong Number</option>
                    <option value="Follow">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Not_Interested">Not Interested</option>
                    <option value="Place_with_other">Place with other</option>
                    <option value="Sale" >Sale</option>
                  </>
                }

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

      <Modal show={on} onHide={handleOff} className="modal assign-ticket-modal fade" id="followUpModal" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className=" w-100 text-center" id="followUpModalLabel">
            Send Quotation Mail to Customer
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="card shadow-sm">
              <div>
                <QuotationBox ticketId={selectTicketForInvoice} name={selectNameForInvoice} email={selectEmailForInvoice} mobile={selectMobileForInvoice} />
              </div>
            </div>
          </div>
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
