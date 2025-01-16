import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

const EmailCompose = ({ autoClose, email, body }) => {
    const { userId } = useAuth();
    const [loading,setLoading]=useState(false)
    const predefinedSubjects = [
        "Meeting Reminder",
        "Project Update",
        "Invoice Attached",
        "Follow-Up",
    ];

    const [emailData, setEmailData] = useState({
        toEmail: email ? email : "",
        subject: "",
        body: body,
    });
    const [isCustomSubject, setIsCustomSubject] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmailData({ ...emailData, [name]: value });
    };

    const handleSubjectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setIsCustomSubject(true);
            setEmailData({ ...emailData, subject: "" });
        } else {
            setIsCustomSubject(false);
            setEmailData({ ...emailData, subject: value });
        }
    };

    const handleFileChange = (e) => {
        setAttachments([...attachments, ...Array.from(e.target.files)]);
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

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
    
            // Handle images
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                setAttachments((prevFiles) => [...prevFiles, file]);
            }
            
            // Handle PDFs
            else if (item.type === "application/pdf") {
                const file = item.getAsFile();
                setAttachments((prevFiles) => [...prevFiles, file]);
            }
        }
    };
    

    const handleBodyChange = (value) => {
        setEmailData({ ...emailData, body: value });
    };

    const handleSubmit = async (e) => {
      if(emailData.subject.length>0){
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("toEmail", emailData.toEmail);
        formData.append("subject", emailData.subject);
        formData.append("body", emailData.body);
        formData.append("userId", userId);

        attachments.forEach((file) => {
            formData.append("attachments", file);
        });

        await axiosInstance
            .post("/send", formData)
            .then(() => {
                toast.success("Email Sent");
                autoClose();
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error("Failed to send email");
            });
            setLoading(false)
      }else{
        toast.info("Please add subject")
      }
    };

    const renderPreview = (file, index) => {
        const fileType = file.type.split("/")[0];
        const handleRemove = () => {
            setAttachments((prevFiles) => prevFiles.filter((_, i) => i !== index));
        };

        if (fileType === "image") {
            const imageUrl = URL.createObjectURL(file);
            return (
                <div className="position-relative">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0"
                        aria-label="Remove"
                        onClick={handleRemove}
                    />
                </div>
            );
        } else if (file.type === "application/pdf") {
            return (
                <div className="d-flex align-items-center">
                    <span>PDF File: {file.name}</span>
                    <button
                        type="button"
                        className="btn-close ms-2"
                        aria-label="Remove"
                        onClick={handleRemove}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className="container mt-5"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
        >
            <h2 className="text-center mb-4">Compose Email</h2>
            <form >
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
                    {/* <select
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={isCustomSubject ? "custom" : emailData.subject}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Select a subject</option>
                        {predefinedSubjects.map((subject, index) => (
                            <option key={index} value={subject}>
                                {subject}
                            </option>
                        ))}
                        <option value="custom">Custom Subject</option>
                    </select> */}
      
                        <input
                            type="text"
                            className="form-control mt-2"
                            placeholder="Enter your subject"
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
                        style={{ height: "180px" }}
                    />
                </div>

                {/* Attachments */}
                <div className="m-5">
                    {/* <label htmlFor="attachments" className="form-label">
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
                        /> */}
                    <p className="text-center text-muted">
                        Drag & drop files anywhere in the form, click to select, or paste images.
                    </p>
                    {/* </div> */}
                    {/* Pasting images directly */}
                    {/* Pasting images directly */}
                    <div
                        className="border border-dashed p-4 rounded mt-3 bg-light"
                        style={{ minHeight: "150px" }}
                    >
                        <p className="text-center text-muted">
                            Paste an image directly here or click the button to select an image
                        </p>
                        <div className="text-center">
                            {/* Button for selecting an image */}
                            <button
                                className="btn btn-primary"
                                onClick={(e) =>{
                                    e.preventDefault()
                                    document.getElementById('fileInput').click()
                                }}
                            >
                                Select Image to Paste
                            </button>
                            <input
                                type="file"
                                id="fileInput"
                                className="d-none"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                            />

                        </div>
                    </div>



                    {/* Show previews of uploaded files */}
                    <div className="mt-3">
                        <div className="d-flex flex-wrap">
                            {attachments.map((file, index) => (
                                <div key={index} className="m-2">
                                    {renderPreview(file, index)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    {loading?<button  className="btn btn-primary">
                        Sending ......
                    </button>:<button onClick={handleSubmit} className="btn btn-primary">
                        Send Email
                    </button>}
                </div>
            </form>
        </div>
    );
};

export default EmailCompose;
