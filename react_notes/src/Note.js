// src/components/Note.js
import React, { useState } from 'react';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [inputE, setInputE] = useState(''); // English Input
  const [inputG, setInputG] = useState('');  // German Input
  const [index, getIndex] = useState('');
  const [cardshow, switchSide] = useState(0);

  const addNote = () => {
    if (inputE.trim() !== '' && inputG.trim() !== ''){
      setNotes([...notes, [inputG, inputE]]);
      setInputG('');
      setInputE('');
    }
  };

  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const getNote = () => {
    const gotNote = notes[index];
    alert(gotNote ? `${gotNote[1]} - ${gotNote[0]}` : 'Note not found');
  };

  const ChangeCard = () => {

        if(cardshow === 0){
          switchSide(1)
        }
        else if (cardshow ===1){
         switchSide(0)
        }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Notes</h2>
      <div>
        <input
          type="text"
          value={inputG}
          onChange={(e) => setInputG(e.target.value)}
          placeholder="Enter a German note..."
          style={{ padding: '10px', width: '45%', marginRight: '10px' }}
        />
        <input
          type="text"
          value={inputE}
          onChange={(e) => setInputE(e.target.value)}
          placeholder="Enter an English note..."
          style={{ padding: '10px', width: '45%' }}
        />
        <button onClick={addNote} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Add Note
        </button>
      </div>

      <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
        {notes.map((note, idx) => {
          const [firstValue, secondValue] = note;  // Deconstruct note into German and English parts
          return (
            <li
              key={idx}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {cardshow === 0 ? firstValue : secondValue}
                <button onClick={() => ChangeCard ()} style={{ marginLeft: '10px' }}>
                  Show 
                </button>
                
                <button onClick={() => deleteNote(idx)} 
                style={{
              position: 'absolute',
              marginLeft: '-.9em',
              marginTop: '3em', 
              width: '25%', 
              padding: '1em'
            }}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div>
        <input
          type="text"
          value={index}
          onChange={(e) => getIndex(e.target.value)}
          placeholder="Look up a note by Index..."
          style={{ padding: '10px',marginTop:'3em', width: '70%'}}
        />
        <button onClick={getNote} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Search by Index
        </button>
      </div>
    </div>
  );
};

export default Note;
