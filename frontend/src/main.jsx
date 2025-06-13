import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/components/Login.jsx';
import Home from './pages/components/Home.jsx';
import Profile from './pages/components/Profile.jsx';
import AddBalance from './pages/components/addBalance.jsx';
import Games from './pages/components/Games.jsx';
import Slot from './pages/components/Slot.jsx';
import BlackJack from './pages/components/BlackJack.jsx';
import AdminView from './pages/components/AdminView.jsx';
import GamesPerformance from './pages/components/GamesPerformance.jsx';
import Banned from './pages/components/Banned.jsx';
import UserHistory from './pages/components/UserHistory.jsx';
//Obtiene los datos como el rol y la fecha de baneo para permitir o denegar accesos
const getCookie = (name) => {
  const cookies = document.cookie.split('; ').reduce((acc, cookieStr) => {
    const [key, val] = cookieStr.split('=');
    acc[key] = val;
    return acc;
  }, {});
  return cookies[name] || null;
};

const userId = localStorage.getItem('id');
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');
const bannedUntil = getCookie('banned_until');

const isAuthenticated = Boolean(userId && username && role);
const isAdmin = role === 'Admin';

const isBanned = () => {
  if (!bannedUntil) return false;

  const rawDateStr = decodeURIComponent(bannedUntil);
  const isoDateStr = rawDateStr.replace(' ', 'T');
  const bannedDate = new Date(isoDateStr);

  const now = new Date();

  return bannedDate > now;
};

const isUserBanned = isAuthenticated && isBanned();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/banned" element={<Banned bannedUntil={bannedUntil} />} />

        <Route
          path="/"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <Navigate to="/Home" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/Home"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <Home />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/games"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <Games />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/black-jack"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <BlackJack />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/add-balance"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <AddBalance />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/slot-machine"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <Slot />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <Profile />
            ) : (
              <Navigate to="/Home" replace />
            )
          }
        />
        <Route
          path="/admin-panel"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated && isAdmin ? (
              <AdminView />
            ) : (
              <Navigate to="/Home" replace />
            )
          }
        />
        <Route
          path="/historial-usuario/:id"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated && isAdmin ? (
              <UserHistory />
            ) : (
              <Navigate to="/Home" replace />
            )
          }
        />
        <Route
          path="/games-performance"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated && isAdmin ? (
              <GamesPerformance />
            ) : (
              <Navigate to="/Home" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            isUserBanned ? (
              <Navigate to="/banned" replace />
            ) : isAuthenticated ? (
              <Navigate to="/Home" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
