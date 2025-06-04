import '../css/BlackJack.css';
import React, { useRef } from 'react';
import Header from '../../components/Header';
import '../css/Games.css'
import InfoBar from '../../components/InfoBar';

import { Link } from 'react-router-dom';
import '../../assets/slot-machine.gif'


export default function Games() {

    return (
        <div id='webGames'>
            <Header></Header>
            <InfoBar/>
                <div className='Titulo'>
                    <h1>Galeria de Juegos</h1>
                </div>

                    <div className="contenedor10 linksSinEstilo">
                        <div className="todosJuegos">
                            <div className="juego" id="slotMachineGame">
                                <Link className="enlaceJuego" to={'/slot-machine'} style={{ cursor: 'pointer' }}>
                                    <h2>Slot Machine</h2>
                                </Link>
                            </div>
                            <div className="juego" id="FRATDual">
                                <Link className="enlaceJuego" to={'/black-jack'} style={{ cursor: 'pointer' }}>
                                    <h2>Black Jack</h2>
                                </Link>
                            </div>
                            <div className="juego" id="FRATSolo">
                                <Link className="enlaceJuego" to={'/Games'} style={{ cursor: 'pointer' }}>
                                    <h2>Ruleta</h2>
                                </Link>
                            </div>
                            
                            
                        </div>
                </div>



        </div>
    );
}
