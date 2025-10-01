import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/common.css';
import Login from './components/Login';
import Register from './components/Register';
// import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { useState, useEffect } from 'react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch("/api/verifytoken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        setIsAuthenticated(data?.status === true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // <- only set after verification
      }
    }

    verifyToken();
  }, []);



  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Checking session...</p>
      </div>
    );
  }

  return (
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated
              ? <Login setisAuthenticated={setIsAuthenticated} />
              : <Navigate to="/chat" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated
              ? <Register setisAuthenticated={setIsAuthenticated} />
              : <Navigate to="/chat" replace />}
          />
          <Route
            path="/chat"
            element={isAuthenticated
              ? (
                <div className='app'>
                  {/* <Sidebar /> */}
                  <ChatWindow />
                </div>
              )
              : <Navigate to="/login" replace />}
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />}
          />
        </Routes>
      </Router>
  );
}

export default App;