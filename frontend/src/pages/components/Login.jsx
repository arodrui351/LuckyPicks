import { useState } from 'react';
import '../css/Login.css';
import logo from '../../assets/IconWoBackground.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameLogin, setUsernameLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [isSignUpVisible, setIsSignUpVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const signUpView = () => setIsSignUpVisible(true);
    const hideSignUp = () => setIsSignUpVisible(false);

    const setCookie = (name, value, days = 30) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
    };

    const API_URL = import.meta.env.VITE_API_URL; // URL dinámica desde el .env

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const passwordRegex = /^.{6,}$/; // Al menos 6 caracteres

        if (!passwordRegex.test(password)) {
            setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage('Usuario registrado correctamente');
                setTimeout(() => {
                    hideSignUp(); // Ocultar el formulario después de unos segundos
                    setSuccessMessage('');
                }, 3000);
            } else {
                setErrorMessage(data.message || 'Error al registrar');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setErrorMessage('Error de red. Inténtalo más tarde.');
        }
    };


    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameLogin,
                    password: passwordLogin,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('id', data.id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);
                localStorage.setItem('api_token', data.api_token);
                setCookie('banned_until', data.banned_until || '');
                setCookie('balance', data.balance || '');

                window.location.href = '/Home';
            } else {
                setErrorMessage(data.message || 'Credenciales incorrectas, revise el nombre y contraseña');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setErrorMessage('Error de red. Inténtalo más tarde.');
        }
    };

    return (
        <div id="loginComponent">
            <div id="logIn">
                <form
                    id="formLogin"
                    className={isSignUpVisible ? 'hidden' : 'visible'}
                    onSubmit={handleLoginSubmit}
                >
                    <div className="titleIcon">
                        <img src={logo} alt="Logo de LuckyPicks" />
                        <h1>Inicia sesión</h1>
                    </div>

                    {errorMessage && (
                        <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
                    )}

                    <div className="form-group">
                        <input
                            type="text"
                            required
                            placeholder=" "
                            id="username"
                            value={usernameLogin}
                            onChange={(e) => setUsernameLogin(e.target.value)}
                        />
                        <label htmlFor="username">Usuario</label>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            required
                            placeholder=" "
                            id="password"
                            value={passwordLogin}
                            onChange={(e) => setPasswordLogin(e.target.value)}
                        />
                        <label htmlFor="password">Contraseña</label>
                    </div>

                    <button style={{ border: '1px solid #cfae58' }} type="submit">Iniciar sesión</button>
                    <p style={{ color: 'white' }}>
                        ¿Aún no tienes cuenta?{' '}
                        <a style={{ cursor: 'pointer', fontSize: '1rem' }} onClick={signUpView}>
                            Regístrate aquí
                        </a>
                    </p>
                </form>
                <form
                    id="formSignUp"
                    className={isSignUpVisible ? 'visible' : 'hidden'}
                    onSubmit={handleSubmit}
                >
                    <div className="titleIcon">
                        <img src={logo} alt="Logo de LuckyPicks" />
                        <h1>Regístrate</h1>
                    </div>

                    {errorMessage && (
                        <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>
                    )}

                    {successMessage && (
                        <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>
                    )}

                    <div className="form-group">
                        <input
                            type="text"
                            required
                            placeholder=" "
                            id="signup-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="signup-username">Usuario</label>
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            required
                            placeholder=" "
                            id="signup-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="signup-mail">Email</label>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            required
                            placeholder=" "
                            id="signup-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="signup-password">Contraseña</label>
                    </div>

                    <button type="submit" style={{ marginBottom: '1rem' }}>
                        Regístrate
                    </button>
                    <button type="button" onClick={hideSignUp}>
                        Inicia Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
