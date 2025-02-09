import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';


const logout = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    attendanceId: localStorage.getItem("attendanceId"),
    logoutReason: "",
    actualWorkingSeconds: 0,
    totalBreakInSec: 0
  })
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      logoutReason: e.target.value,
      actualWorkingSeconds: localStorage.getItem("workTime"),
      totalBreakInSec: localStorage.getItem("breakTime")
    })
  }

  const handleSubmit = async () => {

    if (formData.logoutReason.length > 0) {
      const response = await axiosInstance.post("attendance/logout", formData)
      console.log(response)
      if (response.status === 200) {
        navigate("/")
        logout()
      }
    } else {
      toast.info("Please select a reason")
    }
  }
  const { logout ,dark } = useAuth();
  const navigate = useNavigate()


  return (
    <div>
      <a className={ `${dark?`text-white`:`text-dark`}`} onClick={handleShow}>
        Log Out
      </a>
      <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="followUpModal" tabIndex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
            Logout Confirmation
          </h1>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="status" className="form-label"></label>
              <select
                className="form-select"
                id="status"
                name="ticketStatus"
                value={formData.ticketStatus}
                onChange={handleStatusChange}
              >
                <option value="" >Choose Call-Status</option>
                <option value="Over">Over</option>
                <option value="Senior instruction">Senior instruction</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>


            <div className="modal-footer justify-content-center border-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                Cancel
              </button>
              <button className={`btn btn-primary ${dark ? `text-light`:`text-dark`} `} onClick={handleSubmit}>
                Logout 
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};


export default logout