import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

import './App.css';
import ip from '../services/Api'
import imgX from '../assets/x.png'
import imgO from '../assets/o.png'
import imgOld from '../assets/old.png'

function App({ match }) {

    const [gameid, setGameId] = useState([])
    const [game, setGame] = useState([])
    const [pontuacao, setPontuacao] = useState({})
    const [playerTime, setPlayerTime] = useState(null)
    const [parts, setParts] = useState({})
    const [situation, setSituation] = useState([])
    const [emit, setEmit] = useState(() => { })
    const [playerid, setPlayerid] = useState('')
    const [you, setYou] = useState('')

    useEffect(() => {

        setGameId( match.params.gameid)
        
        const socket = io(ip, {
            query: { gameid: match.params.gameid }
        })
        socket.on('setup', (command) => {
            setGame(command.game)
            setPontuacao(command.pontuacao)
            setPlayerTime(command.playerTime)
            setParts(command.parts)
            if (parts[1] === playerid) {
                setYou(2)
            } else {
                setYou(1)
            }
        })

        socket.on('add-player', (command) => {
            setGame(command.game)
            setPlayerTime(command.playerTime)
            setParts(command.parts)
        })

        socket.on('attempt', (command) => {
            setGame(command.game)
            setPlayerTime(command.playerTime)
            setPontuacao(command.pontuacao)
            setSituation(command.situation)
        })

        socket.on('connect', () => {
            setPlayerid(socket.id)
        })

        setEmit(socket)
    }, [])

    function positionClick(command) {
        emit.emit('move', {
            position: {
                i: command.i,
                j: command.j
            },
            gameid: match.params.gameid
        })
    }

    function imgEspace({ elem }) {
        if (elem === 1) {
            return imgX
        } else {
            if (elem === 2) {
                return imgO
            }
        }
        return
    }

    return (
        <div className="container">
            <div className="pontuacao">
                <p id='x'><img src={imgX} alt='X' /> {pontuacao[1]}</p>
                <p id='old'><img src={imgOld} alt='X' />{pontuacao[3]}</p>
                <p id='o'><img src={imgO} alt='O' /> {pontuacao[2]}</p>
            </div>
            <div className='container-game'>
                {
                    game.length > 0 ? (
                        <div className="tabuleiro">
                            <div id="a1" className="espaco" onClick={() => positionClick({ i: 0, j: 0 })}><img src={imgEspace({ elem: game[0][0] })} alt='' /></div>
                            <div id="a2" className="espaco" onClick={() => positionClick({ i: 0, j: 1 })}><img src={imgEspace({ elem: game[0][1] })} alt='' /></div>
                            <div id="a3" className="espaco" onClick={() => positionClick({ i: 0, j: 2 })}><img src={imgEspace({ elem: game[0][2] })} alt='' /></div>

                            <div id="b1" className="espaco" onClick={() => positionClick({ i: 1, j: 0 })}><img src={imgEspace({ elem: game[1][0] })} alt='' /></div>
                            <div id="b2" className="espaco" onClick={() => positionClick({ i: 1, j: 1 })}><img src={imgEspace({ elem: game[1][1] })} alt='' /></div>
                            <div id="b3" className="espaco" onClick={() => positionClick({ i: 1, j: 2 })}><img src={imgEspace({ elem: game[1][2] })} alt='' /></div>

                            <div id="c1" className="espaco" onClick={() => positionClick({ i: 2, j: 0 })}><img src={imgEspace({ elem: game[2][0] })} alt='' /></div>
                            <div id="c2" className="espaco" onClick={() => positionClick({ i: 2, j: 1 })}><img src={imgEspace({ elem: game[2][1] })} alt='' /></div>
                            <div id="c3" className="espaco" onClick={() => positionClick({ i: 2, j: 2 })}><img src={imgEspace({ elem: game[2][2] })} alt='' /></div>
                        </div>
                    ) : (
                            <div />
                        )
                }
            </div>
            <div className='player'>
                <p>Você é</p>
                <img src={you === 1 ? imgX : imgO} alt={you === 1 ? imgX : imgO} />
            </div>
        </div >
    );
}

export default App;
