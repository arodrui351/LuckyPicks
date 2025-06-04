import '../css/BlackJack.css';
import React, { useRef } from 'react';
import Header from '../../components/Header';
export default function BlackJack() {
    const apuestaRef = useRef(null);
    let juegoEnCurso = false;
    const realizarApuesta = () => {
        console.log('Valor de la apuesta:', apuestaRef.current.value);
        if (apuestaRef.current.value > 0 && !juegoEnCurso) {
            updateBalance(-apuestaRef.current.value)
            
            comenzarJuego()
        }else if(juegoEnCurso){
            console.log('El juego esta en curso')
        } else {
            console.log('La apuesta tiene que ser un numero mayor de 0')
        }
    };
    const updateBalance = async (amount) => {
        const res = await fetch('http://localhost:8000/api/update-balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                id: localStorage.getItem('id'),
            }),
        });
    
        const data = await res.json();
        document.cookie = `balance=${data.balance}; path=/; max-age=2592000`;
    };
    const crearBaraja = () => {
        const baraja = [];

        const palos = ['corazones', 'diamantes', 'treboles', 'picas'];
        const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        palos.forEach(palo => {
            valores.forEach(valor => {
                baraja.push(`${valor}_${palo}`);
            });
        });

        console.log(baraja);

    }
    const comenzarJuego = () => {
        apuestaRef.current.readOnly = true;
        juegoEnCurso = true;
        crearBaraja()
    }
    return (
        <div id='juego1'>
            <Header/>
            <div style={{height:'140px'}}>

            </div>
            <h1>Black Jack</h1>
            <div className='botonesJuego'>

                <div className='apuesta'>
                    <p>Apuesta:</p>
                    <input
                        ref={apuestaRef}
                        style={{ width: '50px' }}
                        defaultValue={0}
                        min={1}
                        type="number"
                    />
                    €
                </div>
                <button id='startGame' onClick={realizarApuesta}>Jugar!</button>
            </div>
        </div>
    );
}
