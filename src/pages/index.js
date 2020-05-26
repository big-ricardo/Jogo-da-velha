import React, { useState } from 'react';
import ip from '../services/Api'
import axios from 'axios'

import './Index.css'

function App() {

    const [gameid, setGameId] = useState('')

    async function newRoom(){
        const response = await axios.get(`${ip}/newroom`)
        const {gameid} = response.data
        if (!gameid) {
            alert("Error 404")
        } else {
            window.location.href = `${gameid}/game`
        }
    }

    async function testRoom(e) {
        e.preventDefault()
        const response = await axios.get(`${ip}/room?gameid=${gameid}`)
        const {error} = response.data
        if (error) {
            alert("Sala Invalida")
        } else {
            window.location.href = `${gameid}/game`
        }
    }

    return (
        <div className="backfround">
            <div className="login-container">
                <div className="form">
                    <h1>Bem vindo!</h1>
                    <a type="button" onClick={()=> newRoom()}>Criar sala</a>
                </div>
                <form onSubmit={testRoom}>
                    <h1>Quer entrar na sala de um amigo?</h1>
                    <input
                        type="text"
                        placeholder="Insira o Codigo do game Aqui"
                        value={gameid}
                        onChange={e => setGameId(e.target.value)}
                    />
                    <button type="submit">Entrar</button>
                </form>
            </div>
            <a href="https://github.com/luiss1569"><p>Devesenvolvido por Luis Ricardo</p></a>
        </div>
    );
}

export default App;
