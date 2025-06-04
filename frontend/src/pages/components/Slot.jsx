import { useRef, useState, useEffect } from 'react';
import '../css/Slot.css';
import Header from '../../components/Header';
import InfoBar from '../../components/InfoBar';

export default function Slot() {
    const slotRefs = [useRef(null), useRef(null), useRef(null)];
    const [juegoEnCurso, setJuegoEnCurso] = useState(false);
    const [popup, setPopup] = useState(null);
    const [apuesta, setApuesta] = useState(1);
    const [apuestaInvalida, setApuestaInvalida] = useState(false);

    const getCookieBalance = () => {
        const m = document.cookie.match(/(?:^| )balance=([^;]+)/);
        return m ? parseFloat(m[1]) : 0;
    };

    const [balance, setBalance] = useState(getCookieBalance);
    const [balanceDiff, setBalanceDiff] = useState(0);

    const iconMap = ['banana', 'seven', 'cherry', 'plum', 'orange', 'bell', 'bar', 'lemon', 'melon'];
    const iconHeight = 79;
    const numIcons = iconMap.length;
    const timePerIcon = 100;

    const payoutMultipliers = {
        banana: 5, cherry: 8, plum: 10, orange: 12, bell: 20,
        bar: 25, lemon: 15, melon: 18, seven: 50
    };

    const registrarTransaccion = async (tipo, cantidad) => {
        await fetch('http://localhost:8000/api/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: localStorage.getItem('id'),
                type: tipo,
                amount: cantidad,
            }),
        });
    };

    const registrarSesion = async (betAmount, winAmount, endedAt) => {
        await fetch('http://localhost:8000/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: localStorage.getItem('id'),
                game_id: 2,
                bet_amount: betAmount,
                win_amount: winAmount,
                ended_at: endedAt
            }),
        });
    };

    const formatDateForMySQL = (date) => {
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const updateBalance = async (amount) => {
        const res = await fetch('http://localhost:8000/api/update-balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, id: localStorage.getItem('id') }),
        });
        const data = await res.json();
        const oldBalance = parseFloat(document.cookie.match(/balance=(\d+(\.\d+)?)/)?.[1] || 0);
        document.cookie = `balance=${data.balance}; path=/; max-age=2592000`;

        triggerBalanceAnimation(oldBalance, data.balance);
        setBalance(data.balance);
    };

    const triggerBalanceAnimation = (oldBalance, newBalance) => {
        const change = newBalance - oldBalance;
        const event = new CustomEvent('balanceUpdate', { detail: { newBalance, change } });
        window.dispatchEvent(event);
    };

    const roll = (reel, offset = 0) => {
        const delta = (offset + 2) * numIcons + Math.floor(Math.random() * numIcons);
        const style = getComputedStyle(reel);
        const bgY = parseFloat(style.backgroundPositionY) || 0;
        const target = bgY + delta * iconHeight;
        const normalized = target % (numIcons * iconHeight);

        return new Promise((resolve) => {
            setTimeout(() => {
                reel.style.transition = `background-position-y ${(8 + delta) * timePerIcon}ms cubic-bezier(.41,-0.01,.63,1.09)`;
                reel.style.backgroundPositionY = `${target}px`;
            }, offset * 150);

            setTimeout(() => {
                reel.style.transition = 'none';
                reel.style.backgroundPositionY = `${normalized}px`;
                resolve(delta % numIcons);
            }, (8 + delta) * timePerIcon + offset * 150);
        });
    };

    const rollAll = async () => {
        const reels = slotRefs.map(r => r.current);
        await Promise.all(reels.map((reel, i) => roll(reel, i)));

        const indices = reels.map(reel => {
            const bgY = parseFloat(getComputedStyle(reel).backgroundPositionY) || 0;
            return Math.round((bgY % (numIcons * iconHeight)) / iconHeight) % numIcons;
        });

        const [s1, s2, s3] = indices.map(i => iconMap[i]);
        const slotEl = document.querySelector('.slots');
        let premio = 0;
        let multiplicador = 0;

        if (s1 === s2 && s2 === s3) {
            multiplicador = payoutMultipliers[s1];
            premio = multiplicador * apuesta;
            slotEl.classList.add('win2');
            setTimeout(() => slotEl.classList.remove('win2'), 2000);
        } else if (s1 === s2 || s2 === s3) {
            multiplicador = 2;
            premio = multiplicador * apuesta;
            slotEl.classList.add('win1');
            setTimeout(() => slotEl.classList.remove('win1'), 2000);
        }

        if (premio > 0) {
            await updateBalance(premio);
            await registrarTransaccion('win', premio);
            setPopup({ multiplicador, premio });
            setTimeout(() => setPopup(null), 3000);
        }

        await registrarSesion(apuesta, premio, formatDateForMySQL(new Date()));
        setJuegoEnCurso(false);
    };

    const realizarApuesta = () => {
        if (apuesta <= 0) {
            setApuestaInvalida(true);
            return;
        }

        if (apuesta > balance) {
            setApuesta(0);
            setApuestaInvalida(true);
            return;
        }

        if (!juegoEnCurso) {
            setJuegoEnCurso(true);
            registrarTransaccion('bet', -apuesta);
            updateBalance(-apuesta);
            rollAll();
        }
    };

    const handleDeposit = () => {
        window.location.href = '/depositar';
    };

    useEffect(() => {
        if (apuesta > balance) {
            setApuesta(Math.max(1, Math.floor(balance)));
        }
    }, [balance]);

    return (
        <div id="juego1" style={{ position: 'relative' }}>
            <Header />
            <InfoBar balance={balance} balanceDiff={balanceDiff} onDeposit={handleDeposit} />
            <div id="SlotWeb">
                <h1>Slot Machine</h1>
                <div className="slot-scaler">
                    <div className="botonesJuego" id="slotMachine">
                        <div className="slots">
                            <div className="reel" ref={slotRefs[0]} />
                            <div className="reel" ref={slotRefs[1]} />
                            <div className="reel" ref={slotRefs[2]} />
                        </div>

                        <div style={{ marginTop: '10%' }} className="apuesta" id="botonesApuestaSlot">
                            <div style={{ marginRight: '10%' }} id="apuestaSlot">
                                <input
                                    style={{
                                        width: '60px',
                                        border: apuestaInvalida ? '1px solid red' : undefined,
                                        borderRadius: '4px'
                                    }}
                                    value={apuesta}
                                    onChange={e => {
                                        const val = parseInt(e.target.value, 10);
                                        const nuevaApuesta = isNaN(val) ? 0 : Math.min(balance, Math.max(0, val));
                                        setApuesta(nuevaApuesta);
                                        if (nuevaApuesta > 0) {
                                            setApuestaInvalida(false);
                                        }
                                    }}
                                    max={balance}
                                    min={0}
                                    type="number"
                                    readOnly={juegoEnCurso}
                                /> €
                            </div>
                            <button id="startGame" onClick={realizarApuesta} disabled={juegoEnCurso}>¡Jugar!</button>
                        </div>
                    </div>
                </div>

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
                        fontSize: '5rem',
                        zIndex: 9999,
                        textAlign: 'center',
                        boxShadow: '0 0 25px rgba(207, 174, 88, 0.8)'
                    }}>
                        <div className='earnSize' style={{ fontSize: '20rem' }}>
                            <strong>{popup.premio}€</strong>
                        </div>
                        <div className='multiplier'>
                            ¡Multiplicador: <strong>{popup.multiplicador}x</strong>!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
