import '../css/BlackJack.css';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import '../css/Home.css';
const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
    const [topPlayers, setTopPlayers] = useState([]);
    const TOKEN = localStorage.getItem('api_token');
    //Obtenemos los datos para hacer el podio
    const fetchTopWins = () => {
        fetch(`${API_URL}/top-wins`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                setTopPlayers(data);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    };

    useEffect(() => {
        fetchTopWins();
    }, []);

    return (
        <div>
            <Header />
            <div style={{ height: '140px' }}></div>

            <div id='bestPrizeHome'>
                <h1>Mayor premio hasta la fecha</h1>
                <h2>{topPlayers[0]?.win_amount.toLocaleString()}$</h2>
            </div>

            <div id='podiumHome'>
                <div id='second'>
                    <h1>{topPlayers[1]?.username || '---'}</h1>
                    <h2>2#</h2>
                </div>
                <div id='first'>
                    <h1>{topPlayers[0]?.username || '---'}</h1>
                    <h2>1#</h2>
                </div>
                <div id='third'>
                    <h1>{topPlayers[2]?.username || '---'}</h1>
                    <h2>3#</h2>
                </div>
            </div>

            <div id='tableProfileHome'>
                {topPlayers.slice(3).map((player, index) => (
                    <div key={index}>
                        <h3>{index + 4}</h3>
                        <p>{player.username}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
