import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

const Enotebook = () => {
  const [notes, setNotes] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [noteDetails, setNoteDetails] = useState({
    title: "",
    noteContent: "",
    user: {
      userId: localStorage.getItem("userId"),
    },
  });
  const { dark } = useAuth();

  useEffect(() => {
    fetNotes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const addNote = async () => {
    const response = await axiosInstance.post("/enote/createNote", noteDetails);
    if (response.status === 201) {
      toast.success("Note Added");
      setNoteDetails({
        title: "",
        noteContent: "",
        user: {
          userId: localStorage.getItem("userId"),
        },
      });
      fetNotes();
    } else {
      toast.error("Some Error Occurred");
    }
  };

  const fetNotes = async () => {
    const response = await axiosInstance.get(
      `/enote/getallByUser/${localStorage.getItem("userId")}`
    );
    setNotes(response.data);
  };

  const deleteNote = async (noteId) => {
    const response = await axiosInstance.delete(`/enote/delete/${noteId}`);
    if (response.data === "Deleted") {
      toast.success("Note Deleted");
      fetNotes();
    } else {
      toast.error("Some Error Occurred");
    }
  };

  const formatLocalDateTime = (dateArray) => {
    const [year, month, day, hours, minutes] = dateArray;
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${day}-${monthNames[month - 1]}-${year} ${formattedHours}:${String(
      minutes
    ).padStart(2, "0")} ${period}`;
  };

  const filteredNotes = notes.filter((note) => {
    if (searchValue.length > 1) {
      return note.title.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  });

  const handleAddNote = () => {
    setIsOpened(!isOpened); // Toggle the form visibility
    window.scrollTo(0, 0); // Scroll to the top of the page
  };
  

  return (
    <div
  className="d-flex flex-column align-items-center"
  style={{
    height: "100vh",
    overflowY: "scroll",
    padding: "5px",
    borderRadius: "10px",
    backgroundColor: dark ? "#000" : "#fff",
    color: dark ? "#fff" : "#000", // Set text color based on dark mode
    paddingTop: "20px",
  }}
>
  {/* Add Note Button */}
  <div className="w-100  d-flex justify-content-center align-items-center py-2">
    <img onClick={handleAddNote} style={{ height: 40 }} src="https://cdn-icons-png.flaticon.com/128/2921/2921226.png" alt="add note" />
  </div>

  {/* Add Note Form */}
  {isOpened && (
    <div className="card p-3 mb-4 shadow w-100" style={{ maxWidth: "90%" }}>
      <h4 className="card-title text-primary text-center">Add a New Note</h4>
      <input
        type="text"
        className="form-control mb-2"
        name="title"
        placeholder="Note Title"
        value={noteDetails.title}
        onChange={handleChange}
        style={{
          backgroundColor: dark ? "#333" : "#fff",
          color: dark ? "#fff" : "#000",
        }}
      />
      <textarea
        className="form-control mb-2"
        name="noteContent"
        rows="3"
        placeholder="Write your note content here..."
        value={noteDetails.noteContent}
        onChange={handleChange}
        style={{
          backgroundColor: dark ? "#333" : "#fff",
          color: dark ? "#fff" : "#000",
        }}
      />
      <button className="btn btn-primary w-100" onClick={addNote}>
        Add Note
      </button>
    </div>
  )}

  {/* Notes List */}
  {filteredNotes.length === 0 ? (
    <p className="text-muted text-center">No notes found!</p>
  ) : (
    <div className="w-100 p-1">
      {filteredNotes
        .slice()
        .reverse()
        .map((note) => (
          <div
            key={note.noteId}
            className="card shadow-sm p-3 mb-3"
            style={{
              borderRadius: "10px",
              backgroundColor: dark ? "#333" : "#fff",
              color: dark ? "#fff" : "#000",
            }}
          >
            <h5 className="text-primary ">{note.title}</h5>
            <p className="py-1" style={{ fontSize: 10 }}>
              {formatLocalDateTime(note.date)}
            </p>
            <div className={`${dark ? "border p-1 border-secondary rounded" : ""}`}>
              <p style={{ fontSize: 14 }}>{note.noteContent}</p>
            </div>
            <i
              className="fa-solid fa-trash fa-lg text-danger d-flex justify-content-end mt-3"
              style={{ cursor: "pointer" }}
              onClick={() => deleteNote(note.noteId)}
            />
          </div>
        ))}
    </div>
  )}

  
</div>

  );
};

export default Enotebook;
