import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import '../css/GamesPerformance.css';

export default function GamesPerformance() {
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().slice(0, 10);
    });

    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });

    const [performance, setPerformance] = useState([]);
    const [topIntervals, setTopIntervals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatNumber = (num) => {
        const n = parseFloat(num);
        return isNaN(n) ? '0.00' : n.toFixed(2);
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const TOKEN = localStorage.getItem('api_token');

    //Peticion para obtener los datos del juego
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            const res = await fetch(`${API_URL}/games/performance?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error en respuesta: ${text}`);
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error(`Respuesta no JSON: ${text}`);
            }

            const data = await res.json();
            setPerformance(data.performance || []);
            setTopIntervals(data.top_intervals || []);

        } catch (err) {
            setError(err.message);
            setPerformance([]);
            setTopIntervals([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    return (
        <div id='webGames'>
            <Header />
            <div className='flexContainerGamesPerformance'>
                <div className='gamesPerformanceContainer'>
                    <div className="filter-section">
                        Fecha inicio:
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            max={endDate}
                        />

                        Fecha fin:
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => {
                                const newEnd = e.target.value;
                                if (newEnd < startDate) {
                                    setStartDate(newEnd);
                                }
                                setEndDate(newEnd);
                            }}
                            max={new Date().toISOString().slice(0, 10)}
                        />
                    </div>

                    {loading && <p>Cargando datos...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!loading && !error && (
                        <>
                            <h2>Rentabilidad por Juego</h2>
                            <table className="performance-table">
                                <thead>
                                    <tr>
                                        <th>Juego</th>
                                        <th>Apuestas al juego</th>
                                        <th>Devuelto del juego</th>
                                        <th>Veces jugado</th>
                                        <th>Rentabilidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performance.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">No hay datos para este rango de fechas.</td>
                                        </tr>
                                    ) : (
                                        performance.map(({ game, total_bet, total_win, sessions_count, profit }) => (
                                            <tr key={game}>
                                                <td>{game}</td>
                                                <td>{formatNumber(total_bet)}</td>
                                                <td>{formatNumber(total_win)}</td>
                                                <td>{sessions_count}</td>
                                                <td style={{ color: parseFloat(profit) >= 0 ? 'red' : 'green' }}>{-formatNumber(profit)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            <h2>Horas mas jugadas</h2>
                            <table className="top-hours-table">
                                <thead>
                                    <tr>
                                        <th>Juego</th>
                                        <th>Intervalo más activo</th>
                                        <th>Jugadas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(!topIntervals || topIntervals.length === 0) ? (
                                        <tr>
                                            <td colSpan="3">No hay datos para este rango de fechas.</td>
                                        </tr>
                                    ) : (
                                        topIntervals.map(({ game, range, plays }) => (
                                            <tr key={game}>
                                                <td>{game}</td>
                                                <td>{range}</td>
                                                <td>{plays}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
