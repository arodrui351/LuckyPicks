import React from 'react';
import { Navigate } from 'react-router-dom';

export default function GuestRoute({ children }) {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const banned = localStorage.getItem('banned_until');

  if (username || role || banned) {
    return <Navigate to="/Home" />;
  }

  return children;
}
