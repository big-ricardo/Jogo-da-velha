import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'

import './App.css';
import ip from '../services/Api'
import imgX from '../assets/x.png'
import imgO from '../assets/o.png'
import imgOld from '../assets/old.png'

function App({ match }) {

  const [game, setGame] = useState([])
  const [pontuacao, setPontuacao] = useState({})
  const [playerTime, setPlayerTime] = useState(null)
  const [parts, setParts] = useState({})
  // eslint-disable-next-line no-unused-vars
  const [situation, setSituation] = useState([])
  const [emit, setEmit] = useState(() => { })
  const [playerid, setPlayerid] = useState('')
  const [you, setYou] = useState(1)

  useEffect(() => {

    const socket = io(ip, {
      query: { gameid: 'false' }
    })
    socket.on('setup', (command) => {
      setGame(command.game)
      setPontuacao(command.pontuacao)
      setPlayerTime(command.playerTime)
      setParts(command.parts)

    })

    socket.on('reset-game', (command) => {
      setGame(command.game)
      setPlayerTime(command.playerTime)
    })

    socket.on('add-player', (command) => {
      setGame(command.game)
      setPlayerTime(command.playerTime)
      setParts(command.players)
    })

    socket.on('attempt', (command) => {
      setGame(command.game)
      setPlayerTime(command.playerTime)
      setPontuacao(command.pontuacao)
      setSituation(command.situation)
    })

    socket.on('connect', () => {
      setPlayerid(socket.id)
      if (parts[1] === playerid) {
        setYou(1)
      } else {
        setYou(2)
      }
    })

    socket.on('remove-player', (command) => {
      setPlayerTime(command.playerTime)
    })

    setEmit(socket)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (parts[1] === playerid) {
      setYou(1)
    } else {
      setYou(2)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts])

  function positionClick(command) {
    emit.emit('move', {
      position: {
        i: command.i,
        j: command.j
      },
      gameid: playerid
    })
  }

  function newGame() {
    emit.emit('reset', {
      gameid: playerid
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
      {playerTime === you ? (
        <div className="turn">Sua vez</div>
      ) : (<div className="turn">Vez do amigo</div>)}
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
        <img src={imgEspace({ elem: you })} alt={you === 1 ? "X" : "o"} />
      </div>
      {playerTime === 0 ? (
        <div className="waitingPlayer">
          <p>Aguardando outro jogador</p>
          <p>Mande esse link para seu Amigo</p>
          <div className='link'>
          <a >{`${playerid}`}</a>
          </div>
        </div>
      ) : (<div />)}
      {playerTime === 3 ? (
        <div className="New" onClick={() => newGame()}>
          <p>Começar de Novo</p>
        </div>
      ) : (<div />)}
    </div >
  );
}

export default App;
