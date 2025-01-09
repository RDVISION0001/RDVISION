import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../auth/AuthContext";

function DocumentUploader() {
    const [files, setFiles] = useState("");
    const [title, setTitle] = useState("");
    const [uploadStatus, setUploadStatus] = useState(""); // To show upload status
    const [uploadedDocuments, setUploadedDocuments] = useState([]); // To store the uploaded documents
    const {dark} = useAuth()

    // Fetch uploaded images and titles from the API
    const fetchUploadedDocuments = async () => {
        try {
            const response = await axiosInstance.get("/images/getAllimages");
            setUploadedDocuments(response.data); // Assuming the API returns an array of documents with title and imageData
        } catch (error) {
            console.error("Error fetching uploaded documents:", error);
            toast.error("Failed to load documents. Please try again.");
        }
    };

    // Call fetchUploadedDocuments on component mount
    useEffect(() => {
        fetchUploadedDocuments();
    }, []);

    // Handle file input changes
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            setFiles(reader.result.split(",")[1]); // Store the base64 string of the file
        };
    
        if (file) {
            reader.readAsDataURL(file); // Convert the file to a Base64 string
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || files.length === 0) {
            toast.warn("Please provide a title and at least one file to upload.");
            return;
        }

        try {
            setUploadStatus("Uploading...");

            const payload = {
                imageTitle: title,
                imageData: files, // send all the base64 images as an array
            };

            const response = await axiosInstance.post("/images/addEmailImage", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setUploadStatus("Upload successful!");
            toast.success("Files uploaded successfully!");
            fetchUploadedDocuments(); // Reload the list of uploaded documents
            console.log("Response:", response.data);
        } catch (error) {
            setUploadStatus("Upload failed.");
            toast.error("Error uploading files. Please try again.");
            console.error("Error uploading files:", error);
        }
    };

    function convertToImage(imageString) {
        const byteCharacters = atob(imageString); // Decode base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;
    }

    return (
        <div className={`container pt-5 ${dark?"bg-dark text-light":""}`}>
            <div className={`card shadow-sm ${dark?"bg-secondary":""}`}>
                <div className="card-body">
                    <h5 className="card-title">Add Documents</h5>
                    <form onSubmit={handleSubmit}>
                        {/* Title Input */}
                        <div className="d-flex justify-content-start">
                            <div className="mb-3 w-50">
                                <label htmlFor="title" className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${dark ? "bg-dark text-light":""} `}
                                    id="title"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <img className="w-25" src={convertToImage(files)} alt="" />
                        </div>

                        {/* File Upload */}
                        <div className="mb-3">
                            <label className="form-label">Attachments</label>
                            <div
                                className="border rounded p-4 text-center shadow"
                                style={{
                                    borderStyle: "dashed",
                                    backgroundColor: dark?"#495057": "#f9f9f9",
                                    color:dark?"#fff":""
                                }}
                            >
                                <FaCloudUploadAlt size={40} className="text-secondary mb-3" />
                                <p className="text-secondary mb-1">Attach your files here</p>
                                <p className="text-primary">
                                    <label
                                        htmlFor="fileUpload"
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                    >
                                        Browse files
                                    </label>
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        multiple
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                </p>
                                <small className={`${dark?'text-light':'text-muted '}`}>Accepted file types: .doc, .png, .jpg, etc.</small>
                            </div>
                        </div>

                        {/* Upload Status */}
                        {uploadStatus && (
                            <div className="mb-3 text-center">
                                <small className={uploadStatus === "Upload successful!" ? "text-success" : "text-danger"}>
                                    {uploadStatus}
                                </small>
                            </div>
                        )}

                        {/* Secure Notice */}
                        <div className="d-flex align-items-center mb-3">
                            <FaLock className="text-muted me-2" />
                            <small className="text-muted">Secure</small>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-100">
                            Create
                        </button>
                    </form>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Display Uploaded Documents */}
            <div className={`mt-5 ${dark?"bg-dark":""}`}>
                <h5 className="py-2">Uploaded Documents</h5>
                <div className="row">
                    {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="col-md-4">
                            <div className={`card mb-3 ${dark ? "bg-secondary":""}`}>
                                <img
                                    src={convertToImage(doc.imageData)}
                                    alt={doc.imageTitle}
                                    className="card-img-top "
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h6 className="card-title">{doc.imageTitle}</h6>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DocumentUploader;
