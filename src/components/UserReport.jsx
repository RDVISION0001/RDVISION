import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card, Button, Modal } from "react-bootstrap";
import axiosInstance from "../axiosInstance";
import ToEveryOne from "../admin/toEveryone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserWorkTimeReport from "../components/UserWorkTimeReport";
import { useAuth } from "../auth/AuthContext";
import TicketStatusView from "./TicketStatusView";

const UserReport = (props) => {
  const [users, setUsers] = useState([]);
  const [noOfAssignedTickets, setnumberOfassinedticket] = useState({});
  const [selectedUser, setSelectedUser] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // State to handle loading text
  const [fetchingUsers, setFetchingUsers] = useState(true); // Loading state for fetchUsers
  const [todayCalls, setTodayCalls] = useState([]);
  const [totalCalls, setTotalCalls] = useState([]);
  const today = new Date();
  const formatedToday = new Date().toISOString().split("T")[0];
  const pastDate = new Date(today); // Create a new Date object based on today
  pastDate.setDate(pastDate.getDate() - 30); // Subtract 30 days
  const formattedPastDate = pastDate.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(formattedPastDate);
  const [endDate, setEndDate] = useState(formatedToday);
  const { userReportReloader, setUserReportReloader } = useAuth();
  const [Closer, setCloser] = useState("");
  const [selectedusername, setSelectedUserName] = useState([]);
  useEffect(() => {
    fetchUsers();
    fetchNoOfAssigned();
    fetchNoIfCallsTotal();
    fetChNoOfCallsToday();
  }, []);
  useEffect(() => {
    fetchUserActiondata();
  }, [startDate, endDate]);
  const reloadFiltered = () => {
    fetchUserActiondata();
    setUserReportReloader((prev) => prev + 1);
  };
  const fetchUsers = async () => {
    setFetchingUsers(true); // Start fetching, show loading
    try {
      const response = await axiosInstance.get("/user/getAllUsers", {
        params: { page: 100 },
      });
      setUsers(response.data.dtoList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    } finally {
      setFetchingUsers(false); // End fetching, hide loading
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (userId, name) => {
    setSelectedUser(userId);
    setSelectedUserName(name);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const fetchNoOfAssigned = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/getNoOfTodayAssinedTicket/${localStorage.getItem("userId")}`
      );
      setnumberOfassinedticket(response.data);
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      toast.error("Failed to fetch assigned tickets.");
    }
  };

  const fetChNoOfCallsToday = async () => {
    const response = await axiosInstance.get(`/user/getnoofCallsToday`);
    setTodayCalls(response.data);
  };

  const fetchNoIfCallsTotal = async () => {
    const response = await axiosInstance.get("/user/getnoofCallsTotal");
    setTotalCalls(response.data);
  };

  function getUsersCallToday(username) {
    for (let i = 0; i < todayCalls.length; i++) {
      if (todayCalls[i][0].toLowerCase() === username.toLowerCase()) {
        return todayCalls[i][1]; // Return the count for the matching username
      }
    }
    return 0; // Return 0 if the username is not found
  }

  function getTotalCallOfUser(username) {
    for (let i = 0; i < totalCalls.length; i++) {
      if (totalCalls[i][0].toLowerCase() === username.toLowerCase()) {
        return totalCalls[i][1]; // Return the count for the matching username
      }
    }
    return 0; // Return 0 if the username is not found
  }
  // Function to convert byte code to image URL
  function convertToImage(imageString) {
    if (!imageString) return null;
    const byteCharacters = atob(imageString);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  const findNoOfAssignedTicketsToUser = (userId) => {
    return noOfAssignedTickets[userId] || 0; // Return 0 if no tickets are assigned
  };

  // Function to open the modal and set the selected user
  const openModal = (userId, user) => {
    setSelectedUser(userId);
    setCloser(user);
    setShowModal(true); // Show the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedUser(0); // Reset selected user
    fetchNoOfAssigned();
  };
  const [usersActionData, setUsersActionData] = useState();

  const fetchUserActiondata = async () => {
    const response = await axiosInstance.post("history/getEmailSals", {
      startDate,
      endDate,
    });
    setUsersActionData(response.data);
  };

  const getNumbersOfUsersAction = (usersFirstName, action) => {
    // Added check to ensure usersActionData exists and is not undefined
    if (!usersActionData || !usersActionData[usersFirstName]) {
      return "0"; // Return "0" if data is missing or user doesn't have the specified action
    }
    return usersActionData[usersFirstName][action] ?? "0";
  };

  return (
    <>
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between items-align-center">
            <div></div>
            <div className="d-flex ">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ paddingTop: "15px" }}
              >
                <i class="fa-solid fa-filter fa-xl"></i>
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="startDate">From</label>
                <input
                  value={startDate}
                  max={formatedToday} // Maximum date is today
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white text-black rounded mx-1 mb-1 p-1"
                  type="date"
                />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="endDate">To</label>
                <input
                  value={endDate}
                  max={formatedToday} // Maximum date is today
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white text-black rounded mx-1 mb-1 p-1"
                  type="date"
                />
              </div>
            </div>
          </div>
          <div className="d-flex" style={{ overflowX: "auto" }}>
            {fetchingUsers ? ( // Show loading text if users are still being fetched
              <div>Loading users, please wait...</div>
            ) : (
              users
                .filter((user) => user.roleId === 4)
                .map((user, index) => (
                  <div key={index} className="">
                    <div
                      className="p-3 d-flex align-items-center border flex-column"
                      style={{
                        height: "80vh",
                        borderTop: "2px solid rgb(211, 211, 211)",
                      }}
                    >
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          height: "150px",
                          width: "150px",
                          overflow: "hidden",
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        {convertToImage(user.imageData) ? (
                          <img
                            src={convertToImage(user.imageData)}
                            className="img-fluid"
                            alt={`${user.firstName} ${user.lastName}`}
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>

                      <div style={{ height: "120px" }}>
                        <div className="fw-bold" style={{ fontSize: "30px" }}>
                          {user.firstName}
                        </div>

                        {findNoOfAssignedTicketsToUser(user.userId) > 0 ? (
                          <div className="d-flex flex-column">
                            <div>
                              <span
                                style={{
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                  padding: "5px",
                                  marginTop: "5px",
                                }}
                              >
                                Today Assigned:{" "}
                                {findNoOfAssignedTicketsToUser(user.userId)}
                              </span>
                              <button
                                type="button"
                                className="btn btn-dark rounded"
                                onClick={() =>
                                  handleOpenModal(user.userId, user.firstName)
                                }
                                style={{ marginLeft: "10px" }}
                              >
                                Report
                              </button>
                            </div>
                            <span
                              className="text-primary mb-3 "
                              onClick={() =>
                                openModal(user.userId, user.firstName)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              Assign more....
                            </span>
                          </div>
                        ) : (
                          <button
                            style={{ backgroundColor: "rgb(15,7,76)" }}
                            onClick={() =>
                              openModal(user.userId, user.firstName)
                            }
                          >
                            Assign Now
                          </button>
                        )}
                      </div>
                      <div className="border rounded shadow mt-6">
                        <UserWorkTimeReport
                          user={user.userId}
                          start={startDate}
                          end={endDate}
                        />
                      </div>

                      <div className="d-flex border w-100 mt-4">
                        <div class="container shadow">
                          <div class="row border p-2">
                            <div class="col">
                              <samp> Total Calls</samp>
                            </div>
                            <div className="col text-end text-success">
                              {getTotalCallOfUser(user.firstName)}
                            </div>
                          </div>
                          <div class="row border p-2">
                            <div class="col">
                              <samp>Today Calls</samp>
                            </div>
                            <div className="col text-end text-success">
                              {getUsersCallToday(user.firstName)}
                            </div>
                          </div>
                          <div class="row border p-2">
                            <div class="col">
                              <samp>Total Email</samp>
                            </div>
                            <div className="col text-end text-success">
                              {getNumbersOfUsersAction(
                                user.firstName,
                                "TotalEmail"
                              )}
                            </div>
                          </div>
                          <div class="row border p-2">
                            <div class="col">
                              <samp>Total Sale</samp>
                            </div>
                            <div className="col text-end text-success">
                              {getNumbersOfUsersAction(
                                user.firstName,
                                "TotalSale"
                              )}
                            </div>
                          </div>
                          <div class="row border p-2">
                            <div class="col">
                              <samp>Total Quation</samp>
                            </div>
                            <div className="col text-end text-success">
                              {getNumbersOfUsersAction(
                                user.firstName,
                                "TotalQuotation"
                              )}
                            </div>
                          </div>
                          <div class="row border p-2">
                            <div className="col">
                              <samp>Pay Link</samp>
                            </div>
                            <div className="col text-end text-success">
                              {getNumbersOfUsersAction(
                                user.firstName,
                                "TotalPaymentLink"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Bootstrap Modal */}

      

        <Modal
            show={isModalOpen}
            onHide={handleCloseModal}
            className="  w-100"
            tabIndex="-1"
            role="">
            <div className="modal-dialog bg-light   " style={{paddingRight:'35px', backgroundColor:'#fff'}} role="document">
            <div className="modal-content">
                <div className="modal-header d-flex justify-content-center w-100 px-4 bg-primary">
                    <h5 className="modal-title text-light">Assign Ticket Report (ASR)</h5>
                </div>
                <TicketStatusView userId={selectedUser} name={selectedusername} />

                <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                >
                    Close
                </button>
                {/* <button type="button" className="btn btn-primary">
                    Save Changes
                </button> */}
                </div>
            </div>
            </div>
       </Modal>

      {/* Modal for ToCaptain */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        dialogClassName="custom-modal-width"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Ticket to {Closer}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToEveryOne userId={selectedUser} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default UserReport;
