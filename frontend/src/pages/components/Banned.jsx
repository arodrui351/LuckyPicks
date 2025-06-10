import React, { useState, useEffect } from 'react';

const Banned = ({ bannedUntil }) => {
  const bannedDate = new Date(decodeURIComponent(bannedUntil));
  const [timeLeft, setTimeLeft] = useState(bannedDate - new Date());
  const [redirect, setRedirect] = useState(false);
  const [checkedBan, setCheckedBan] = useState(false);
  const userId = localStorage.getItem('id');

  const API_URL = import.meta.env.VITE_API_URL;
  const TOKEN = localStorage.getItem('api_token');

  useEffect(() => {
    if (timeLeft <= 0 && !checkedBan) {
      (async () => {
        try {
          const res = await fetch(`${API_URL}/check-ban`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
            credentials: 'include',
          });

          if (!res.ok) throw new Error(`Error en la solicitud: HTTP ${res.status}`);

          const data = await res.json();

          if (data.banned === false) {
            setRedirect(true);
          } else {
            const newBannedDate = new Date(data.bannedUntil);
            setTimeLeft(newBannedDate - new Date());
            setCheckedBan(false);
          }
        } catch (error) {
          console.error('Error checking ban:', error);
        } finally {
          setCheckedBan(true);
        }
      })();
    }
  }, [timeLeft, checkedBan, userId]);
  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(';').forEach(c => {
      const [n] = c.split('=');
      document.cookie = `${n}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
    window.location.href = '/';
  };
  useEffect(() => {
    if (redirect) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = bannedDate - now;
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [bannedDate, redirect]);

  if (redirect) {
    window.location.href = '/Home';
  }

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Estás baneado</h1>
      <p>Su baneo terminara en:</p>
      <h2 style={{ fontSize: '3rem', color: 'red' }}>
        {formatTimeLeft(timeLeft)}
      </h2>
      <button onClick={handleLogout} style={{ marginBottom: '1rem', width: '200px', border: '1px solid #cfae58' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Banned;
