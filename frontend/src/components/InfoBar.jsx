import { useEffect, useState } from 'react';
import '../pages/css/InfoBar.css';

export default function InfoBar() {
    const [username, setUsername] = useState('');
    const [balance, setBalance] = useState(0);
    const [animValue, setAnimValue] = useState(null);
    const [isGain, setIsGain] = useState(true);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || 'Usuario';
        setUsername(storedUsername);

        const getBalanceFromCookie = () => {
            const match = document.cookie.match(/balance=(\d+(\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
        };

        setBalance(getBalanceFromCookie());

        const handleBalanceUpdate = (event) => {
            const { newBalance, change } = event.detail;
            setIsGain(change >= 0);
            setAnimValue(change);
            setBalance(newBalance);

            setTimeout(() => {
                setAnimValue(null);
            }, 1500);
        };

        window.addEventListener('balanceUpdate', handleBalanceUpdate);

        return () => {
            window.removeEventListener('balanceUpdate', handleBalanceUpdate);
        };
    }, []);

    const colorClass = isGain ? 'anim-green' : 'anim-red';
    const sign = isGain ? '+' : '-';

    return (
        <div className="infoBar">
            <div className="infoBar-username">{username}</div>


            <div>
                <div className="infoBar-balance-wrapper" style={{marginRight:'20px'}}>
                    <div className="infoBar-balance">{balance.toFixed(2)}€</div>
                    {animValue !== null && (
                        <span
                            className={`infoBar-anim ${colorClass} ${isGain ? 'floatUp' : 'floatDown'}`}
                        >
                            {sign}{Math.abs(animValue).toFixed(2)}€
                        </span>
                    )}
                </div>
                <button
                    className="infoBar-button"
                    onClick={() => window.location.href = '/add-balance'}
                >
                    Ingresar saldo
                </button>
            </div>

        </div>
    );
}
