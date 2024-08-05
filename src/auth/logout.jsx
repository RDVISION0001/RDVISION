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
    logoutReason: ""
  })
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      logoutReason: e.target.value
    })

  }

  const handleSubmit = async () => {

    if (formData.logoutReason.length > 0) {
      const response = await axiosInstance.post("attendance/logout", formData)
      console.log(response)
      if (response.status === 200) {
        console.log("Ethar to aya hi nhi ")
        logout()
        navigate("/")
      }
    } else {
      toast.info("Please select a reason")
    }
  }
  const { logout } = useAuth();
  const navigate = useNavigate()


  return (
    <div>
      <a onClick={handleShow}>
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
                <option value="Lunch Break">Lunch Break</option>
                <option value="Senior instruction">Senior instruction</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>


            <div className="modal-footer justify-content-center border-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
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