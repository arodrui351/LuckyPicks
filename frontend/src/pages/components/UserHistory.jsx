import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import Header from '../../components/Header';

export default function UserHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [sessionsCount, setSessionsCount] = useState([]);
    const [sessionsDetail, setSessionsDetail] = useState([]);
    const [userName, setUserName] = useState(`Usuario ${id}`);

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

    const API_URL = import.meta.env.VITE_API_URL;
    const TOKEN = localStorage.getItem('api_token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (role !== 'Admin') {
            navigate('/');
        }
    }, [role, navigate]);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/account/history`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id,
                    start_date: startDate,
                    end_date: endDate,
                    order,
                }),
            });

            if (!res.ok) throw new Error('No se pudo obtener historial');
            const data = await res.json();

            setUserName(data.user_name || `Usuario ${id}`);
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
    }, [id, startDate, endDate, order]);

    return (
        <div>
            <Header />
            <div style={{ height: '140px' }} />
            <h1>Historial de: {userName}</h1>
            {loading && <p>Cargando…</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div id="historyFilters">
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

            <div id="historyTables">
                <div id="timesPlayed">
                    <h2 onClick={() => setShowSessionsCount(prev => !prev)} style={{ cursor: 'pointer' }}>
                        Juegos Jugados {showSessionsCount ? '▲' : '▼'}
                    </h2>
                    {showSessionsCount && (
                        <table className="table100">
                            <thead>
                                <tr><th>Juego</th><th>Veces jugado</th></tr>
                            </thead>
                            <tbody>
                                {sessionsCount.length ? sessionsCount.map(s => (
                                    <tr key={s.name}>
                                        <td>{s.name}</td>
                                        <td>{s.plays}</td>
                                    </tr>
                                )) : <tr><td colSpan="2">Sin partidas registradas.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>

                <div id="transactions">
                    <h2 onClick={() => setShowSpendTransactions(prev => !prev)} style={{ cursor: 'pointer' }}>
                        Transacciones {showSpendTransactions ? '▲' : '▼'}
                    </h2>
                    {showSpendTransactions && (
                        <table className="table100">
                            <thead>
                                <tr><th>Cantidad</th><th>Fecha</th></tr>
                            </thead>
                            <tbody>
                                {transactions.length ? transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{tx.amount}</td>
                                        <td>{new Date(tx.created_at).toLocaleString()}</td>
                                    </tr>
                                )) : <tr><td colSpan="2">No hay transacciones.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>

                <div id='profileRightTable'>
                    <div id="sessionDetails">
                        <h2 onClick={() => setShowSessionDetails(prev => !prev)} style={{ cursor: 'pointer' }}>
                            Historial de Partidas {showSessionDetails ? '▲' : '▼'}
                        </h2>
                        {showSessionDetails && (
                            <table className="table100">
                                <thead>
                                    <tr><th>Juego</th><th>Apostado</th><th>Ganado</th><th>Fecha</th></tr>
                                </thead>
                                <tbody>
                                    {sessionsDetail.length ? sessionsDetail.map(s => (
                                        <tr key={s.id}>
                                            <td>{s.game_name}</td>
                                            <td>{s.bet_amount}</td>
                                            <td>{s.win_amount}</td>
                                            <td>{new Date(s.started_at).toLocaleString()}</td>
                                        </tr>
                                    )) : <tr><td colSpan="4">No hay partidas.</td></tr>}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
