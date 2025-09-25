import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import LoginModal from './components/LoginModal';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <Router>
      <div className="App">
        <header className="homepage-header">
          <h1>PropelEmployment</h1>
          {user ? (
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          ) : (
            <button className="btn btn-outline" onClick={() => setLoginOpen(true)}>Login</button>
          )}
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/job/:id" element={<JobDetailPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
        </Routes>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    </Router>
  );
}

export default App;