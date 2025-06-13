import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import '../css/Profile.css';

export default function AccountHistory() {
  const [transactions, setTransactions] = useState([]);
  const [sessionsCount, setSessionsCount] = useState([]);
  const [sessionsDetail, setSessionsDetail] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSessionsCount, setShowSessionsCount] = useState(false);
  const [showSpendTransactions, setShowSpendTransactions] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  const userId = localStorage.getItem('id');

  const API_URL = import.meta.env.VITE_API_URL; // URL dinámica desde el .env
  const TOKEN = localStorage.getItem('api_token'); // Obtener el token almacenado

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/account/history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`, // Se envía el Bearer Token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
          order,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`No se pudo obtener historial: ${text}`);
      }

      const data = await res.json();
      setTransactions(data.spend_transactions || []);
      setSessionsCount(data.sessions_count || []);
      setSessionsDetail(data.sessions_detail || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate, order]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(';').forEach(c => {
      const [n] = c.split('=');
      document.cookie = `${n}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
    window.location.href = '/';
  };

  const renderSessionsCount = () =>
    sessionsCount.length
      ? sessionsCount.map(s => (
        <tr key={s.name}>
          <td>{s.name}</td>
          <td>{s.plays}</td>
        </tr>
      ))
      : (
        <tr>
          <td colSpan="2">Sin partidas registradas.</td>
        </tr>
      );

  const renderSpendTx = () => {
    if (!transactions || transactions.length === 0) {
      return <tr><td colSpan="2">No hay transacciones .</td></tr>;
    }
    const spends = transactions.filter(tx => tx.type === 'spend');
    if (spends.length === 0) {
      return <tr><td colSpan="2">No hay transacciones.</td></tr>;
    }
    return spends.map(tx => (
      <tr key={tx.id}>
        <td>{tx.amount}</td>
        <td>{new Date(tx.created_at).toLocaleString()}</td>
      </tr>
    ));
  };

  const sortedSessionsDetail = [...sessionsDetail].sort((a, b) => {
    return order === 'asc'
      ? a.bet_amount - b.bet_amount
      : b.bet_amount - a.bet_amount;
  });

  const renderSessionDetail = () =>
    sortedSessionsDetail.length
      ? sortedSessionsDetail.map(s => (
        <tr key={s.id}>
          <td>{s.game_name}</td>
          <td>{s.bet_amount}</td>
          <td>{s.win_amount}</td>
          <td>{new Date(s.started_at).toLocaleString()}</td>
        </tr>
      ))
      : (
        <tr>
          <td colSpan="4">No hay partidas.</td>
        </tr>
      );

  return (
    <div>
      <Header />
      <div style={{ height: 140 }} />

      <div id="mainRow">
        <h1>{localStorage.getItem('username')}</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div id="profileFilters">
        <div>
          <p>Desde:</p>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>
        <div>
          <p>Hasta:</p>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={startDate}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <div>
          <p>Orden:</p>
          <select value={order} onChange={e => setOrder(e.target.value)}>
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </div>
      </div>

      <div id="profileAllTables">
        <div id="profileLeftTables">
          <div id="profileTimesPlayed">
            <h2 onClick={() => setShowSessionsCount(prev => !prev)} style={{ cursor: 'pointer' }}>
              Juegos jugados {showSessionsCount ? '▼' : '▲'}
            </h2>
            {showSessionsCount && (
              <table className='table100'>
                <thead>
                  <tr>
                    <th>Juego</th>
                    <th>Veces jugado</th>
                  </tr>
                </thead>
                <tbody>{renderSessionsCount()}</tbody>
              </table>
            )}
          </div>

          <div id="profileAddBalance">
            <h2 onClick={() => setShowSpendTransactions(prev => !prev)} style={{ cursor: 'pointer' }}>
              Transacciones {showSpendTransactions ? '▼' : '▲'}
            </h2>
            {showSpendTransactions && (
              <table border="1" cellPadding="5" className='table100'>
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>{renderSpendTx()}</tbody>
              </table>
            )}
          </div>
        </div>

        <div id="profileRightTable">
          <h2 onClick={() => setShowSessionDetails(prev => !prev)} style={{ cursor: 'pointer' }}>
            Historial {showSessionDetails ? '▼' : '▲'}
          </h2>
          {showSessionDetails && (
            <table border="1" cellPadding="5" className='table100'>
              <thead>
                <tr>
                  <th>Juego</th>
                  <th>Apostado</th>
                  <th>Ganado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>{renderSessionDetail()}</tbody>
            </table>
          )}
        </div>
      </div>

      {loading && <p>Cargando…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
