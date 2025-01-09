import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/AuthContext";

// Components
import Uploaded_tickets from "../pages/uploaded_tickets";
import axiosInstance from "../axiosInstance";
import { FaCloudUploadAlt } from 'react-icons/fa'; // File upload icon

function UploadTickets() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const [isUploading, setIsUploading] = useState(false); // To track whether the file is uploading
  const{dark} = useAuth()

  // Handle file input change
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Reset previous message
    setErrors([]); // Reset previous errors
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem('token');

    try {
      setIsUploading(true); // Set uploading state to true when upload starts
      const response = await axiosInstance.post(
        "/upload/upload_tickets", // Your backend URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`, // Add token to request headers if needed
          },
          onUploadProgress: (progressEvent) => {
            // Calculate progress percentage
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setUploadProgress(progress);
            }
          },
        }
      );

      setIsUploading(false); // Set uploading state to false after upload is complete

      if (response.status === 200) {
        setMessage(response.data); // Success message
        toast.success("File uploaded successfully!");
        setFile(null)
      } else if (response.status === 206) {
        setErrors(response.data); // Errors list
        toast.error("Some errors occurred during the upload.");
      }
    } catch (error) {
      setIsUploading(false); // Ensure uploading state is false in case of error
      toast.error("An error occurred while uploading the file.");
    }
  };

  // Handle file drop event
  const onFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // Handle drag over event
  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <ToastContainer />
      <div className={`container-fluid pt-3 ${dark?"bg-dark text-light ":""}`}>
        <h2 className={`${dark?"text-light":""}`}>Upload Tickets</h2>
        {/* File uploader with Bootstrap styling and drag-and-drop feature */}
        <div className="file-uploader d-flex flex-column align-items-center m-3" >
          <div className="text-center d-flex flex-column align-items-center" style={{  boxShadow: "1px 1px 5px 1px black",borderRadius:"10px", padding:'5px',width:"350px"}}>
            <div className="mb-3">

              {/* Drag-and-drop area */}
              <div
                className="file-drop-area p-5 border-dotted text-center"
                style={{
                  backgroundColor: dark ? "#6c757d" : "#ffffff",
                  borderRadius: "20px",
                  cursor: "pointer",
                  borderColor: "purple",
                  borderWidth: "2px",
                  borderStyle: "dotted",  // Added dotted border
                  width:"300px",
                  height:"150px",
                  margin:"10px"
                }}
                
                onDrop={onFileDrop}
                onDragOver={onDragOver}
                onClick={() => document.getElementById("file-upload").click()} // Allow file browsing when the drop area is clicked
              >
                {!file ? (
                  <div>
                   <i className="fa-solid fa-arrow-up-from-bracket fa-2xl mb-3" style={{color: "#000000"}}></i>
                    <p>Drag & Drop Excel File Here or <span style={{color:"purple", fontWeight:"bold"}}>Click to Browse</span></p>
                  </div>
                ) : (
                  <div>
                    <p>File: {file.name}</p> {/* Show file name */}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="file-upload"
                accept=".xlsx, .xls"
                className="form-control d-none" // Hide the default file input
                onChange={onFileChange}
              />
            </div>

            <button
              onClick={onFileUpload}
              className="btn"
              style={{backgroundColor:"purple",color:"white",borderRadius:"8px"}}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>

          </div>
          {/* Progress bar for file upload */}
          {isUploading && (
            <div className="mt-3">
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress < 100 ? `${uploadProgress}%` : ""}
                </div>
              </div>
            </div>
          )}

          {message && (
            <div
              className={`message ${errors.length > 0 ? "error" : "success"}`}
            >
              {message}
            </div>
          )}

          {errors.length > 0 && (
            <div className="error-list">
              <h3>Errors:</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Uploaded Tickets Component */}
        <Uploaded_tickets />
      </div>
    </>
  );
}

export default UploadTickets;
