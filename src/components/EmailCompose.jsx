import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for the rich text editor
import { toast } from "react-toastify";

const EmailCompose = ({autoClose}) => {
    const [emailData, setEmailData] = useState({
        toEmail: "",
        subject: "",
        body: "", // Keep the body as a string to store the HTML content
    });
    const [attachments, setAttachments] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmailData({ ...emailData, [name]: value });
    };

    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setAttachments((prevFiles) => [...prevFiles, ...files]);
    };

    const handleBodyChange = (value) => {
        setEmailData({ ...emailData, body: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("toEmail", emailData.toEmail);
        formData.append("subject", emailData.subject);
        formData.append("body", emailData.body);

        attachments.forEach((file) => {
            formData.append("attachments", file);
        });

        axiosInstance
            .post("/send", formData)
            .then((response) => response.text())
            .then((data) => {
                alert(data);
            })
            toast.success("emailSent")
            autoClose()
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const renderPreview = (file) => {
        const fileType = file.type.split("/")[0];

        if (fileType === "image") {
            const imageUrl = URL.createObjectURL(file);
            return <img src={imageUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />;
        } else if (file.type === "application/pdf") {
            return <span>PDF File: {file.name}</span>;
        }
        return null;
    };

    return (
        <div
            className="container mt-5"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h2 className="text-center mb-4">Compose Email</h2>
            <form onSubmit={handleSubmit}>
                {/* To Email */}
                <div className="mb-3">
                    <label htmlFor="toEmail" className="form-label">
                        To Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="toEmail"
                        name="toEmail"
                        value={emailData.toEmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Subject */}
                <div className="mb-3">
                    <label htmlFor="subject" className="form-label">
                        Subject
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={emailData.subject}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Body (Rich Text Editor) */}
                <div className="mb-3">
                    <label htmlFor="body" className="form-label">
                        Body
                    </label>
                    <ReactQuill
                        value={emailData.body}
                        onChange={handleBodyChange}
                        modules={{
                            toolbar: [
                                [{ header: "1" }, { header: "2" }, { font: [] }],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["bold", "italic", "underline", "strike"],
                                [{ align: [] }],
                                ["link"],
                                ["image"],
                            ],
                        }}
                        theme="snow"
                        style={{ height: "180px" }} // Set the initial height to 200px
                    />

                </div>

                {/* Attachments */}
                <div className="m-5">
                    <label htmlFor="attachments" className="form-label">
                        Attachments (Image or PDF only)
                    </label>
                    <div
                        className={`border-2 border-dashed p-4 rounded-lg ${dragOver ? "bg-gray-100" : "bg-white"
                            }`}
                    >
                        <input
                            type="file"
                            className="form-control mb-3"
                            id="attachments"
                            name="attachments"
                            multiple
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                        />
                        <p className="text-center text-muted">
                            Drag & drop files anywhere in the form or click to select
                        </p>
                    </div>

                    {/* Show previews of uploaded files */}
                    <div className="mt-3">
                        <div className="d-flex flex-wrap">
                            {attachments.map((file, index) => (
                                <div key={index} className="m-2">
                                    {renderPreview(file)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                        Send Email
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmailCompose;
