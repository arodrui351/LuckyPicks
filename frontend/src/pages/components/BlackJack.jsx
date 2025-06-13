import '../css/BlackJack.css';
import React, { useState } from 'react';
import Header from '../../components/Header';
import Logo from '../../assets/LuckyPicks.png';
import InfoBar from '../../components/InfoBar';

export default function BlackJack() {
    const getCookieBalance = () => {
        const m = document.cookie.match(/(?:^| )balance=([^;]+)/);
        return m ? parseFloat(m[1]) : 0;
    };

    const [baraja, setBaraja] = useState([]);
    const [juegoEnCurso, setJuegoEnCurso] = useState(false);
    const [dealer, setDealer] = useState([]);
    const [jugador, setJugador] = useState([]);
    const [popup, setPopup] = useState(null);
    const [balance, setBalance] = useState(() => getCookieBalance());
    const [balanceDiff, setBalanceDiff] = useState(0);
    const [mostrarCartaOculta, setMostrarCartaOculta] = useState(false);
    const [apuesta, setApuesta] = useState(1);
    const [apuestaInvalida, setApuestaInvalida] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;
    const TOKEN = localStorage.getItem('api_token');

    const updateBalance = async (amount) => {
        try {
            const res = await fetch(`${API_URL}/update-balance`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`, // Token para autenticación
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, id: localStorage.getItem('id') }),
            });

            if (!res.ok) throw new Error("Error al actualizar balance");

            const data = await res.json();
            const oldBalance = getCookieBalance();
            document.cookie = `balance=${data.balance}; path=/; max-age=2592000`;

            triggerBalanceAnimation(oldBalance, data.balance);
            setBalance(data.balance);
        } catch (error) {
            console.error("Error en updateBalance:", error);
        }
    };

    const triggerBalanceAnimation = (oldBalance, newBalance) => {
        const change = newBalance - oldBalance;
        const event = new CustomEvent('balanceUpdate', { detail: { newBalance, change } });
        window.dispatchEvent(event);
        setBalanceDiff(change);
    };

    const registrarTransaccion = async (tipo, cantidad) => {
        try {
            const res = await fetch(`${API_URL}/transaction`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`, // Se envía el Bearer Token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: localStorage.getItem('id'),
                    type: tipo,
                    amount: cantidad,
                }),
            });

            if (!res.ok) throw new Error("Error al registrar transacción");
        } catch (error) {
            console.error("Error en registrarTransaccion:", error);
        }
    };

    const registrarSesion = async (betAmount, winAmount, endedAt) => {
        try {
            const res = await fetch(`${API_URL}/sessions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`, // Se envía el Bearer Token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: localStorage.getItem('id'),
                    game_id: 1,
                    bet_amount: betAmount,
                    win_amount: winAmount,
                    ended_at: endedAt,
                }),
            });

            if (!res.ok) throw new Error("Error al registrar sesión");
        } catch (error) {
            console.error("Error en registrarSesion:", error);
        }
    };


    const formatDateForMySQL = (date) => {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const crearBaraja = () => {
        const palos = ['♥️', '♦️', '♣️', '♠️'];
        const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let nuevaBaraja = [];
        palos.forEach(palo => {
            valores.forEach(valor => {
                nuevaBaraja.push({ valor, palo });
            });
        });
        for (let i = nuevaBaraja.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nuevaBaraja[i], nuevaBaraja[j]] = [nuevaBaraja[j], nuevaBaraja[i]];
        }
        return nuevaBaraja;
    };

    const valorCarta = (valor) => {
        if (['J', 'Q', 'K'].includes(valor)) return 10;
        if (valor === 'A') return 11;
        return parseInt(valor);
    };

    const calcularPuntaje = (mano) => {
        let total = 0;
        let ases = 0;
        for (let carta of mano) {
            total += valorCarta(carta.valor);
            if (carta.valor === 'A') ases++;
        }
        while (total > 21 && ases > 0) {
            total -= 10;
            ases--;
        }
        return total;
    };

    const comenzarJuego = () => {
        setApuestaInvalida(false);
        const nuevaBaraja = crearBaraja();

        const cartaDealer1 = nuevaBaraja.pop();
        const cartaDealer2 = nuevaBaraja.pop();
        setDealer([cartaDealer1, cartaDealer2]);

        const jugadorMano = [nuevaBaraja.pop(), nuevaBaraja.pop()];
        setJugador(jugadorMano);

        setBaraja(nuevaBaraja);
        setJuegoEnCurso(true);
        setMostrarCartaOculta(false);

        registrarTransaccion('bet', -apuesta);
        updateBalance(-apuesta);
    };

    const pedirCarta = () => {
        if (!juegoEnCurso) return;
        const nuevaCarta = baraja.pop();
        const nuevaMano = [...jugador, nuevaCarta];

        setJugador(nuevaMano);
        setBaraja([...baraja]);

        const puntaje = calcularPuntaje(nuevaMano);
        if (puntaje >= 21) {
            pasarTurno();
        }
    };

    const pasarTurno = () => {
        if (!juegoEnCurso) return;

        setMostrarCartaOculta(true);

        setTimeout(() => {
            const dealerMano = [...dealer];
            const nuevaBaraja = [...baraja];

            let puntaje = calcularPuntaje(dealerMano);
            while (puntaje < 17 && nuevaBaraja.length > 0) {
                const siguienteCarta = nuevaBaraja.shift();
                dealerMano.push(siguienteCarta);
                puntaje = calcularPuntaje(dealerMano);
            }

            setDealer(dealerMano);
            setBaraja(nuevaBaraja);
            finalizarJuego(calcularPuntaje(jugador), calcularPuntaje(dealerMano));
        }, 1000);
    };

    const finalizarJuego = (puntajeJugador, puntajeDealer) => {
        let resultado = '';
        let ganancia = 0;

        if (puntajeJugador > 21) {
            resultado = 'Perdiste';
        } else if (puntajeDealer > 21 || puntajeJugador > puntajeDealer) {
            resultado = '¡Ganaste!';
            ganancia = apuesta * 2;
        } else if (puntajeJugador === puntajeDealer) {
            resultado = 'Empate';
            ganancia = apuesta;
        } else {
            resultado = 'Perdiste';
        }

        if (ganancia > 0) {
            updateBalance(ganancia);
            registrarTransaccion('win', ganancia);
        }

        const endedAt = formatDateForMySQL(new Date());
        registrarSesion(apuesta, ganancia, endedAt);

        setPopup({ mensaje: resultado, ganancia });
        setTimeout(() => setPopup(null), 4000);
        setJuegoEnCurso(false);
    };

    return (
        <div id='juego1'>
            <Header />
            <InfoBar balance={balance} balanceDiff={balanceDiff} />
            <div style={{ height: '200px' }}></div>
            <div id='tableContainer'>
                <div id='table'>
                    <div id='dealerBlackJack'>
                        {dealer.map((carta, i) => (
                            <div className="card" key={i}>
                                {i === 1 && !mostrarCartaOculta ? (
                                    <img src={Logo} alt="Carta oculta" />
                                ) : (
                                    <>
                                        <p className="simbol">{carta.palo}</p>
                                        <p className="value">{carta.valor}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div id='playerBlackJack'>
                        {jugador.map((carta, i) => (
                            <div className="card" key={i}>
                                <p className="simbol">{carta.palo}</p>
                                <p className="value">{carta.valor}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {juegoEnCurso ? (
                <div id='blackJackButtons'>
                    <div>
                        <button onClick={pedirCarta}>Pedir carta</button>
                        <button onClick={pasarTurno}>Pasar</button>
                    </div>
                </div>
            ) : (
                <div className='botonesJuego'>
                    <div className='apuesta'>
                        <p>Apuesta:</p>
                        <input
                            style={{
                                width: '50px',
                                border: apuestaInvalida ? '1px solid red' : undefined,
                                borderRadius: '4px'
                            }}
                            value={apuesta}
                            onChange={e => {
                                const val = parseInt(e.target.value, 10);
                                if (isNaN(val)) {
                                    setApuesta(0);
                                    setApuestaInvalida(true);
                                } else {
                                    const nuevaApuesta = Math.min(balance, Math.max(0, val));
                                    setApuesta(nuevaApuesta);
                                    setApuestaInvalida(nuevaApuesta < 1);
                                }
                            }}
                            max={balance}
                            min={0}
                            type="number"
                            readOnly={juegoEnCurso}
                        /> €
                    </div>
                    <button id='startGame' onClick={comenzarJuego}>Jugar!</button>
                </div>
            )}

            {popup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -60%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: '#fff',
                    padding: '20px 40px',
                    borderRadius: '10px',
                    fontSize: '4rem',
                    zIndex: 9999,
                    textAlign: 'center',
                    boxShadow: '0 0 25px rgba(207, 174, 88, 0.8)'
                }}>
                    <strong>{popup.mensaje}</strong><br />
                    {popup.ganancia > 0 && <span>Ganaste {popup.ganancia}€</span>}
                </div>
            )}
        </div>
    );
}
