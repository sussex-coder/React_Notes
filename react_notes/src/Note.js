import React, { useState, useEffect } from 'react';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inputE, setInputE] = useState('');
  const [inputG, setInputG] = useState('');
  const [flippedCards, setFlippedCards] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchNotes();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNotes = async (categoryId = '') => {
    try {
      const url = categoryId ? `/api/notes?category=${categoryId}` : '/api/notes';
      const response = await fetch(url);
      const data = await response.json();
      setNotes(data);
      setFlippedCards(new Array(data.length).fill(false));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    if (inputE.trim() !== '' && inputG.trim() !== '' && selectedCategory) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            german: inputG, 
            english: inputE, 
            categoryId: selectedCategory 
          }),
        });
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        setFlippedCards([...flippedCards, false]);
        setInputG('');
        setInputE('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      const newNotes = notes.filter(note => note.id !== id);
      setNotes(newNotes);
      setFlippedCards(flippedCards.filter((_, i) => notes[i].id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const flipCard = (idx) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[idx] = !newFlippedCards[idx];
    setFlippedCards(newFlippedCards);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchNotes(categoryId);
  };

  const onDragStart = (e, index) => {
    setDraggedItem(notes[index]);
    e.dataTransfer.setData('text/plain', index);
    e.target.style.opacity = '0.5';
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = notes[index];

    // If the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return;
    }

    // Filter out the currently dragged item
    let newNotes = notes.filter(note => note !== draggedItem);

    // Add the dragged item after the dragged over item
    newNotes.splice(index, 0, draggedItem);

    setNotes(newNotes);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const newFlippedCards = notes.map(note => flippedCards[notes.findIndex(n => n.id === note.id)]);
    setFlippedCards(newFlippedCards);
  };



  return (
    <div style={{ padding: '20px' }}>
      
  
      <div style={{marginBottom:"1.5em"}}>
        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          style={{ padding: '10px', marginRight: '10px' }}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        </div>
        <div>
        <input
          type="text"
          value={inputG}
          onChange={(e) => setInputG(e.target.value)}
          placeholder={
    selectedCategory
      ? `Enter a ${categories.find(category => category.id === Number(selectedCategory))?.name || ''} word`
      : ''
  }
          style={{ padding: '10px', width: '30%', marginRight: '10px' }}
        />
        <input
          type="text"
          value={inputE}
          onChange={(e) => setInputE(e.target.value)}
          placeholder={selectedCategory
      ? `Enter an English translation`
      : ''}
          style={{ padding: '10px', width: '30%' }}
        />
        <button onClick={addNote} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Add Note
        </button>
      </div>
      {selectedCategory ? (
      <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
        {notes.map((note, idx) => (
          <li
            key={note.id}
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOver(e, idx)}
            onDrop={onDrop}
            style={{
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '10px',
              }}
            >
              <div>{flippedCards[idx] ? note.english : note.german}</div>
              <button onClick={() => flipCard(idx)} style={{ marginLeft: '10px' }}>
                Flip
              </button>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              style={{
                width: '20%',
                padding: '5px',
                marginTop: '10px',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      ):(
      null
    )}
    </div>
  );

}
export default Note;