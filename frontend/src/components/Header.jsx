import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/css/Header.css';
import imgHeader from "../assets/IconWoBackground.png"

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);


  const abrirMenu = () => setMenuAbierto(true);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header id="navBar">
      <img className='logoHeader' src={imgHeader} alt="Aerodynamics logo" />
      <nav id="nav" className={menuAbierto ? 'menuAbierto' : ''}>
        <button id="cerrar" onClick={cerrarMenu}>✖</button>
        <ul id="lista" className='ulNavBar'>
          <li className='liNavBar'><Link to="/Home">Inicio</Link></li>
          <li className='liNavBar'><Link to="/games">Juegos</Link></li>
          <li className='liNavBar'><Link to="/profile">Perfil</Link></li>
          {localStorage.getItem('role') === 'Admin' && (
            <li className="liNavBar">
              <Link to="/games-performance">Rendimiento</Link>
            </li>
          )}
          {localStorage.getItem('role') === 'Admin' && (
            <li className="liNavBar">
              <Link to="/admin-panel">Administrar usuarios</Link>
            </li>
          )}
          
        </ul>
      </nav>
      <button id="abrir" onClick={abrirMenu} className={menuAbierto ? 'ocultar' : 'mostrar'} style={{ maxWidth: '20%' }}>
        ☰
      </button>
    </header>
  );
};