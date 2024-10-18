import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

const Enotebook = () => {
  const [notes, setNotes] = useState([]); // State to store all notes
  const [isOpened, setIsOpened] = useState(false);
  const [noteDetails, setNoteDetails] = useState({
    title: "",
    noteContent: "",
    user: {
      userId: localStorage.getItem("userId")
    }
  });

  useEffect(() => {
    fetNotes();
  }, []);

  // Handling changes in state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  // Function to handle adding a new note
  const addNote = async () => {
    const response = await axiosInstance.post("/enote/createNote", noteDetails);
    if (response.status === 201) {
      toast.success("Note Added");
      setNoteDetails({
        title: '',
        noteContent: '',
        user: {
          userId: localStorage.getItem("userId")
        }
      });
      fetNotes();
    } else {
      toast.error("Some Error Occurred");
    }
  };

  const fetNotes = async () => {
    const response = await axiosInstance.get(`/enote/getallByUser/${localStorage.getItem("userId")}`);
    setNotes(response.data);
    console.log(response.data);
  };

  const deleteNote = async (noteId) => {
    const response = await axiosInstance.delete(`/enote/delete/${noteId}`);
    console.log(response.data);
    if (response.data === "Deleted") {
      toast.success("Note Deleted");
      fetNotes();
    } else {
      toast.error("Some Error Occurred");
    }
  };

  const formatLocalDateTime = (dateArray) => {
    const [year, month, day, hours, minutes] = dateArray;
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedDate = `${day}-${monthNames[month - 1]}-${year} ${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
    return formattedDate;
  };

  return (
    <div className="container mt-4" style={{ overflowY: "scroll" }}>
      <div className='text-center mb-3 d-flex justify-content-around'>
        <h3 className="mb-4 text-left" style={{ color: "#183e81" }}>E-NoteBook</h3>
        <span
          className='rounded-circle border border-primary'
          style={{
            height: "50px",
            width: "50px",
            padding: "8px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
          {!isOpened
            ? <i className="fa-solid fa-plus fa-2xl" onClick={() => setIsOpened(true)} style={{ color: "#183e81" }}></i>
            : <i className="fa-solid fa-chevron-up fa-2xl" onClick={() => setIsOpened(false)} style={{ color: "#1f4fa3" }}></i>}
        </span>
      </div>


      {isOpened && (
        <div className="card p-4 mb-4 shadow">
          <h4 className="card-title text-primary">Add a New Note</h4>
          <div className="mb-3">
            <label htmlFor="noteTitle" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name='title'
              id="noteTitle"
              placeholder="Note Title"
              value={noteDetails.title}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="noteContent" className="form-label">Note Content</label>
            <textarea
              className="form-control"
              id="noteContent"
              rows="4"
              name='noteContent'
              placeholder="Write your note content here..."
              value={noteDetails.noteContent}
              onChange={handleChange}
            ></textarea>
          </div>

          <button className="btn btn-primary" onClick={addNote}>
            Add Note
          </button>
        </div>
      )}

      {/* Display Added Notes */}
      {notes.length === 0 ? (
        <p className="text-muted text-center">No notes added yet!</p>
      ) : (
        <div className="row">
          {notes.slice().reverse().map((note) => (
            <div className="col-md-4 mb-3" key={note.noteId}>
              <div className="card shadow" style={{ borderRadius: "10px" }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title" style={{ color: "#183e81" }}>{note.title}</h5>
                    <p className="text-muted small">{formatLocalDateTime(note.date)}</p>
                  </div>
                  <p className="card-text">{note.noteContent}</p>
                  <span className='d-flex justify-content-end'>
                    <i
                      className="fa-solid fa-trash fa-xl"
                      style={{ color: "#f50a0a", cursor: "pointer" }}
                      onClick={() => deleteNote(note.noteId)}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Enotebook;
