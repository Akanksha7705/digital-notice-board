
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const res = await axios.get('http://localhost:5000/api/notices');
    setNotices(res.data);
  };

  const addNotice = async () => {
    if (!title || !description) return;
    await axios.post('http://localhost:5000/api/notices', { title, description });
    setTitle('');
    setDescription('');
    fetchNotices();
  };

  const deleteNotice = async (id) => {
    await axios.delete(`http://localhost:5000/api/notices/${id}`);
    fetchNotices();
  };

  return (
    <div className="container">
      <h1>Digital Notice Board</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addNotice}>Add Notice</button>
      </div>

      <div className="notices">
        {notices.map((notice) => (
          <div key={notice._id} className="notice">
            <h3>{notice.title}</h3>
            <p>{notice.description}</p>
            <small>{new Date(notice.date).toLocaleString()}</small>
            <button onClick={() => deleteNotice(notice._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;