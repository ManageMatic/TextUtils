import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import About from './pages/About';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      document.body.style.backgroundColor = '#0b0f19';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [mode]);

  const showAlert = (message, type) => {
    // Alerts disabled by user request
  };

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('light');
    }
  };

  return (
    <>
      <Router>
        <Navbar title="ManageMatic TextUtils" about="About" mode={mode} toggleMode={toggleMode} />
        <div className="container my-4">
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} heading="Try TextUtils - Word counter, Character counter, Remove extra spaces" mode={mode} />} />
            <Route path="/about" element={<About mode={mode} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
