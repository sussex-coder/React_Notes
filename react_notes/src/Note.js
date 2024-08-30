// src/components/Note.js
import React, { useState } from 'react';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');
  const [index, getIndex] = useState('')


  const addNote = () => {
    if (input.trim() !== '') {
      setNotes([...notes, input]);
      setInput('');
    }
  };

  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };
  const getNote =()=> {
    alert(index)
    const gotNote =notes[index]
    alert(gotNote)

  }
  return (
    <div style={{ padding: '20px' }}>
      <h2>My Notes</h2>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new note..."
          style={{ padding: '10px', width: '70%' }}
        />
        <button onClick={addNote} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Add Note
        </button>
      </div>
      <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
        {notes.map((note, index) => (
          <li
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {note}
            <button onClick={() => deleteNote(index)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
        
          </li>
        ))}
      </ul>
        <input
          type="text"
          value={index}
          onChange={(e) => getIndex(e.target.value)}
          placeholder="Look up a note by Index..."
          style={{ padding: '10px', width: '70%' }}
          />
           <button onClick={getNote} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Search by Index
        </button>
    </div>
  );
};

export default Note;

