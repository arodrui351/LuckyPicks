import '../css/BlackJack.css';
import React, { useState } from 'react';
import Header from '../../components/Header';
import '../css/addBalance.css';
import InfoBar from '../../components/InfoBar';
import { Link } from 'react-router-dom';

export default function AddBalance() {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [isPromoInvalid, setIsPromoInvalid] = useState(false);

    //Codigo de promocion
    const validPromoCode = "LUCKYPICKS2025";

    const getCookieBalance = () => {
        const m = document.cookie.match(/(?:^| )balance=([^;]+)/);
        return m ? parseFloat(m[1]) : 0;
    };

    const [balance, setBalance] = useState(getCookieBalance);

    const handleClick = (e, amount) => {
        e.preventDefault();
        setSelectedAmount(amount);
    };

    const closeModal = () => {
        setSelectedAmount(null);
        setPromoCode('');
        setIsPromoInvalid(false);
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const TOKEN = localStorage.getItem('api_token');

    //Actualicamos el balance en el backend
    const updateBalance = async (amount) => {
        const res = await fetch(`${API_URL}/update-balance`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, id: localStorage.getItem('id') }),
        });

        if (!res.ok) {
            console.error('Error al actualizar balance:', res.statusText);
            return;
        }

        const data = await res.json();
        const oldBalance = parseFloat(document.cookie.match(/balance=(\d+(\.\d+)?)/)?.[1] || 0);
        document.cookie = `balance=${data.balance}; path=/; max-age=2592000`;

        triggerBalanceAnimation(oldBalance, data.balance);
        setBalance(data.balance);
    };

    //Registramos la transaccion
    const registrarTransaccion = async (tipo, cantidad) => {
        const res = await fetch(`${API_URL}/transaction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('id'),
                type: tipo,
                amount: cantidad,
            }),
        });

        if (!res.ok) {
            console.error('Error al registrar transacción:', res.statusText);
        }
    };

    //Activamos la animacion
    const triggerBalanceAnimation = (oldBalance, newBalance) => {
        const change = newBalance - oldBalance;
        const event = new CustomEvent('balanceUpdate', { detail: { newBalance, change } });
        window.dispatchEvent(event);
    };

    const confirmAddBalance = async () => {
        if (promoCode.trim().toUpperCase() === validPromoCode.toUpperCase()) {
            await updateBalance(selectedAmount);
            await registrarTransaccion('spend', selectedAmount);
            closeModal();
        } else {
            setIsPromoInvalid(true);
        }
    };

    return (
        <div id='webGames'>
            <Header />
            <InfoBar />
            <div className='Titulo'>
                <h1>Añadir saldo</h1>
            </div>

            <div className="contenedor10 linksSinEstilo">
                <div className="todasOpciones">
                    {[5, 10, 20, 50, 100, 200].map((amount, idx) => (
                        <div
                            key={amount}
                            className="opcion"
                            id={`saldo${idx + 1}`}
                            onClick={(e) => handleClick(e, amount)}
                        >
                            <Link className="enlaceAddBalance">
                                <h2>{amount} €</h2>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {selectedAmount !== null && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div>
                            <h2 style={{ margin: '0px' }}>¿Deseas añadir <strong>{selectedAmount} €</strong> a tu cuenta?</h2>
                        </div>
                        <div>
                            <h3>Código Promocional</h3>
                            <input
                                style={{ marginBottom: '16px' }}
                                type="text"
                                name="inserted-code"
                                id="promotional-code"
                                className={isPromoInvalid ? 'input-error' : ''}
                                value={promoCode}
                                onChange={(e) => {
                                    setPromoCode(e.target.value);
                                    setIsPromoInvalid(false);
                                }}
                            />
                        </div>
                        <div className='modal-buttons-balance'>
                            <button onClick={closeModal}>Cancelar</button>
                            <button onClick={confirmAddBalance}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
