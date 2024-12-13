import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';

const Enotebook = () => {
  const [notes, setNotes] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [noteDetails, setNoteDetails] = useState({
    title: '',
    noteContent: '',
    user: {
      userId: localStorage.getItem('userId'),
    },
  });

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
    const response = await axiosInstance.post('/enote/createNote', noteDetails);
    if (response.status === 201) {
      toast.success('Note Added');
      setNoteDetails({
        title: '',
        noteContent: '',
        user: {
          userId: localStorage.getItem('userId'),
        },
      });
      fetNotes();
    } else {
      toast.error('Some Error Occurred');
    }
  };

  const fetNotes = async () => {
    const response = await axiosInstance.get(`/enote/getallByUser/${localStorage.getItem('userId')}`);
    setNotes(response.data);
  };

  const deleteNote = async (noteId) => {
    const response = await axiosInstance.delete(`/enote/delete/${noteId}`);
    if (response.data === 'Deleted') {
      toast.success('Note Deleted');
      fetNotes();
    } else {
      toast.error('Some Error Occurred');
    }
  };

  const formatLocalDateTime = (dateArray) => {
    const [year, month, day, hours, minutes] = dateArray;
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${day}-${monthNames[month - 1]}-${year} ${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const filteredNotes = notes.filter((note) => {
    if (searchValue.length > 1) {
      return note.title.toLowerCase().includes(searchValue.toLowerCase());
    }
    return true;
  });

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        height: '90vh',
        // width: '20vw',
        overflowY:"scroll",
        padding:"5px",
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        paddingTop:"20px"
      }}
    >
      {/* Add Note Button */}
      <div
        className="d-flex align-items-center justify-content-center mb-3"
        style={{
          height: '50px',
          width: '50px',
          borderRadius: '50%',
          // backgroundColor: '#183e81',
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpened(!isOpened)}
      >
        <i className={`fa-solid ${isOpened ? 'fa-chevron-up' : 'fa-plus'} fa-lg text-danger`} />
      </div>

      {/* Add Note Form */}
      {isOpened && (
        <div className="card p-3 mb-4 shadow w-100" style={{ maxWidth: '90%' }}>
          <h4 className="card-title text-primary text-center">Add a New Note</h4>
          <input
            type="text"
            className="form-control mb-2"
            name="title"
            placeholder="Note Title"
            value={noteDetails.title}
            onChange={handleChange}
          />
          <textarea
            className="form-control mb-2"
            name="noteContent"
            rows="3"
            placeholder="Write your note content here..."
            value={noteDetails.noteContent}
            onChange={handleChange}
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
        <div className="w-100">
          {filteredNotes.slice().reverse().map((note) => (
            <div
              key={note.noteId}
              className="card shadow-sm p-3 mb-3"
              style={{ borderRadius: '10px', backgroundColor: '#fff' }}
            >
              <h5 className="text-primary mb-1">{note.title}</h5>
              <p className="text-muted small">{formatLocalDateTime(note.date)}</p>
              <p>{note.noteContent}</p>
              <i
                className="fa-solid fa-trash fa-lg text-danger d-flex justify-content-end"
                style={{ cursor: 'pointer' }}
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
