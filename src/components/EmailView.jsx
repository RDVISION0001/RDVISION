import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is properly set up
import { useAuth } from "../auth/AuthContext";
import { Button, Modal } from "react-bootstrap";
import EmailCompose from "./EmailCompose";

const EmailView = () => {
    const [email, setEmail] = useState("ravi@rdvision.tech");
    const [password, setPassword] = useState("RMrd@08052000");
    const { dark, userId } = useAuth()
    const [emails, setEmails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [opnedEmail, setOpnedEmail] = useState("")
    const [file, setFile] = useState([])
    const [loading, setLoading] = useState(false)
    const [isCompoeseOpen, setIsComposeOpen] = useState(false)

    useEffect(() => {
        fetchEmails();
    }, [page]);

    const fetchEmails = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.post("/fetch-emails", {
                userId,
                password,
                page,
                pageSize,
                searchQuery,
            });
            const emailData = response.data.emailList;

            setEmails(emailData);
            setTotalPages(parseInt(response.data.totalPages[0].totalPages));
            setLoading(false)

        } catch (e) {
            toast.error("Some error occurred");
            setLoading(false)

        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const getPageNumbers = () => {
        const range = [];
        const visiblePages = 5;

        let start = Math.max(1, page - Math.floor(visiblePages / 2));
        let end = Math.min(totalPages, page + Math.floor(visiblePages / 2));

        if (start === 1) {
            end = Math.min(totalPages, visiblePages);
        } else if (end === totalPages) {
            start = Math.max(1, totalPages - visiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        if (start > 1) {
            range.unshift("...");
        }
        if (end < totalPages) {
            range.push("...");
        }

        return range;
    };



    const dateFormatter = (date) => {
        const now = new Date();
        const emailDate = new Date(date);
        const diffTime = now - emailDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = emailDate.getHours();
        const minutes = emailDate.getMinutes();
        const isPM = hours >= 12;
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${isPM ? "PM" : "AM"
            }`;

        if (diffDays === 0) {
            return `Today, ${formattedTime}`;
        } else if (diffDays === 1) {
            return `Yesterday, ${formattedTime}`;
        } else {
            return `${emailDate.getDate()}-${emailDate.toLocaleString("en-GB", {
                month: "short",
            })}-${emailDate.getFullYear()}, ${formattedTime}`;
        }
    };


    const renderContent = (htmlContent) => {
        const cleanHtml = DOMPurify.sanitize(htmlContent); // Sanitize HTML content
        return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
    };

    const extractEmailDetails = (emailContent) => {
        const emailDetails = {};
        const data = emailContent.emailContent;
        // Extract 'From'
        const fromMatch = data.match(/^From:\s(.+)/m);
        if (fromMatch) emailDetails.from = fromMatch[1].trim();

        // Extract 'Subject'
        const subjectMatch = data.match(/^Subject:\s(.+)/m);
        if (subjectMatch) emailDetails.subject = subjectMatch[1].trim();

        // Extract 'Received Date'
        const dateMatch = data.match(/^Received Date:\s(.+)/m);
        if (dateMatch) emailDetails.receivedDate = dateMatch[1].trim();

        // Extract 'Content'
        const contentMatch = data.match(/Content:\s([\s\S]+)/m);
        if (contentMatch) emailDetails.content = contentMatch[1].trim();

        // Extract 'Status' (Seen/Not Seen)
        const statusMatch = data.match(/status:\s(.+)/m);
        if (statusMatch) emailDetails.status = statusMatch[1].trim();


        // Optionally: You can add logic here to extract attachments, but for now, it returns only the details
        emailDetails.attachments = extractAttachments(emailContent);
        emailDetails.file = emailContent.filesInBytecode

        return emailDetails;
    };

    // Helper function to simulate attachment extraction (could be extended)
    const extractAttachments = (data) => {
        const attachmentFiles = [];
        const attachmentMatch = data.attachmentFiles;  // Assuming attachments are listed with 'Attachment: <filename>'

        if (attachmentMatch) {
            attachmentFiles.push(...attachmentMatch.map(item => item.replace('Attachment: ', '').trim()));
        }

        return attachmentFiles;
    };
    const handleOpenEmail = (content, file) => {
        setOpnedEmail(content)
        setFile(file)
    }
    function convertToImage(imageString) {
        if (file.length > 0) {
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

    }
    const handleBase64ToPDF = (base64String) => {
        if (base64String) {
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            return url;
        } else {
            alert('No Base64 string available to convert.');
        }
    };
const handleCloseCompose =()=>{
    setIsComposeOpen(false)
}
    return (
        <div className={`container-fluid border-2 rounded ${dark ? "bg-dark text-white" : ""}`}>

            <div className="row">
                {/* <div
                    className={`col-md-2 border-end pt-3 ${dark ? "bg-secondary text-white" : "bg-light"
                        }`}
                >
                    <h6 className="fw-bold">Folders</h6>
                    <ul className="list-group">
                        <li
                            className={`list-group-item d-flex justify-content-between align-items-center ${dark ? "bg-dark text-white" : ""
                                }`}
                        >
                            Inbox <span className="badge bg-primary rounded-pill">7</span>
                        </li>
                        {["Drafts", "Sent", "Junk", "Trash"].map((folder, index) => (
                            <li
                                key={index}
                                className={`list-group-item ${dark ? "bg-dark text-white" : ""}`}
                            >
                                {folder}
                            </li>
                        ))}
                    </ul>
                </div> */}

                <div className="col-md-4 border-end pt-3">
                    <div className="d-flex justify-content-between m-2">
                        <button onClick={() => setIsComposeOpen(true)}>Compose</button>
                        <button onClick={fetchEmails}> {loading ? <i class="fa-solid fa-sync fa-spin fa-xl"></i> : <i class="fa-solid fa-arrows-rotate fa-xl"></i>
                        }</button>

                    </div>
                    {/* <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by From..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-outline-secondary" onClick={fetchEmails}>
                            Search
                        </button>
                    </div> */}
                    <div
                        className="list-group"
                        style={{ height: "80vh", overflowY: "auto" }}
                    >
                        {emails.map((email, index) => (
                            <a
                                key={index}
                                // onClickCapture={() => handleOpenEmail(.messageId)}
                                className={`list-group-item list-group-item-action ${extractEmailDetails(email).content === opnedEmail
                                    ? "bg-primary text-white"
                                    : dark
                                        ? "bg-dark text-white"
                                        : ""
                                    }`}
                                onClick={() => handleOpenEmail(extractEmailDetails(email).content, email.attachments)}
                            >
                                <div className={`d-flex w-100 justify-content-between `}>
                                    <strong>{extractEmailDetails(email).from}</strong>
                                    <small className={``}>{dateFormatter(extractEmailDetails(email).receivedDate)}</small>
                                </div>
                                <p className="mb-1 fw-bold">{extractEmailDetails(email).subject}</p>
                                <small className="">{extractEmailDetails(email).status}</small>
                                {extractEmailDetails(email).status !== "Seen" && <span className="badge bg-success ms-2">New</span>}
                            </a>
                        ))}
                    </div>
                    <nav>
                        <ul className="pagination justify-content-center mt-3">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link m-1" onClick={() => handlePageChange(page - 1)}>
                                    Previous
                                </button>
                            </li>

                            {getPageNumbers().map((pageNumber, index) => (
                                <li
                                    key={index}
                                    className={`page-item m-1 ${page === pageNumber ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link m-1" onClick={() => handlePageChange(page + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="col-md-8 pt-3" style={{ height: "95vh", overflowY: "auto" }}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: opnedEmail }}
                        style={{ border: "", borderRadius: "5px", padding: "10px", color: "black", }}
                    />
                    
                    <div className="d-flex flex-wrap">
                        {file.map((files, index) => {
                            if (files.fileType === "Image") {
                                return (
                                    <div className="m-2" key={index} style={{ maxWidth: "calc(50% - 1rem)" }}>
                                        <img
                                            className="w-full h-auto rounded"
                                            style={{ maxHeight: "300px", objectFit: "contain" }}
                                            src={convertToImage(files.fileBytes)}
                                            alt="na"
                                        />
                                    </div>
                                );
                            } else if (files.fileType === "PDF") {
                                return (
                                    <div className="m-2" key={index} style={{ maxWidth: "calc(50% - 1rem)" }}>
                                        <iframe
                                            src={handleBase64ToPDF(files.fileBytes)}
                                            width="100%"
                                            height="500px"
                                            title="PDF Viewer"
                                            className="rounded"
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>

                    {/* <div className="card-footer d-flex justify-content-between m-2">
                        <button className="btn btn-success">Reply</button>
                        <button className="btn btn-danger">Delete</button>
                    </div> */}
                </div>
            </div>

            <Modal
                show={isCompoeseOpen}
                // onHide={() => setIsComposeOpen(false)}
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                className="rounded-lg"  // Add Tailwind class to make the modal rounded
            >
                <EmailCompose autoClose={handleCloseCompose}/>
                <div className="modal-body">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsComposeOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default EmailView;
