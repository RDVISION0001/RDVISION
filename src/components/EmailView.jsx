import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is properly set up
import { useAuth } from "../auth/AuthContext";

const EmailView = () => {
    const [email, setEmail] = useState("ravi@rdvision.tech");
    const [password, setPassword] = useState("RMrd@08052000");
    const { dark,userId } = useAuth()
    const [emails, setEmails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [opnedEmail, setOpnedEmail] = useState("")
    const [loading, setLoading] = useState(false)

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
            setTotalPages(parseInt(response.data.totalPages));
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

    const handleOpenEmail = async (id) => {

    }
    const renderContent = (htmlContent) => {
        const cleanHtml = DOMPurify.sanitize(htmlContent); // Sanitize HTML content
        return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
    };

    const extractEmailDetails = (data) => {
        const emailDetails = {};

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

        const seenStatus = data.match(/status:\s(.+)/m);
        console.log(seenStatus)
        if (contentMatch) emailDetails.status = seenStatus[1].trim();

        return emailDetails;
    };
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
                    <div className="d-flex justify-content-end m-2">

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
                                onClick={() => setOpnedEmail(extractEmailDetails(email).content)}
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
                                <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                                    Previous
                                </button>
                            </li>

                            {getPageNumbers().map((pageNumber, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${page === pageNumber ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
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
                                <button className="page-link" onClick={() => handlePageChange(page + 1)}>
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

                    {/* <div className="card-footer d-flex justify-content-between m-2">
                        <button className="btn btn-success">Reply</button>
                        <button className="btn btn-danger">Delete</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default EmailView;
