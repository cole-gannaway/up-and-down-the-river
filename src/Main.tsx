import { Button, Switch, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { db } from './config/firebase';
import { selectLobbyCode, selectLobbyUUID, selectName, setIsLoggedIn, setLobbyCode, setLobbyUUID } from './features/app-state';
import { selectLobbyData } from './features/lobby';
import { deleteLobby, updateHistory, updateScoreboard, updateRoundData, addPlayerToLobby, generateRandomLobbyCode } from './firebase/firebase-utils';
import { PlayerDataDict, RoundData, ScoreboardDataDict } from './interfaces/ILobbyData';
import { LobbyHistory } from './LobbyHistory';
import { Scoreboard } from './Scoreboard';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Main() {
  const dispatch = useAppDispatch();

  const [showHistory, setShowHistory] = useState(false);

  const lobby = useAppSelector(selectLobbyData);
  const roundData = lobby.live.roundData;
  const name = useAppSelector(selectName)
  const lobbyUUID = useAppSelector(selectLobbyUUID);
  const lobbyCode = useAppSelector(selectLobbyCode);
  const cardsPerRound = [7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7];


  async function handleDeleteLobby() {
    console.log(lobbyUUID)
    if (lobbyUUID) {
      await deleteLobby(db, lobbyCode, lobbyUUID)
      dispatch(setLobbyCode(""))
      dispatch(setLobbyUUID(null));
      dispatch(setIsLoggedIn(false));
    }
  }

  const deleteLobbyDisabled = !(lobbyUUID);

  async function handleRoundDataUpdate(roundDataUpdate: Partial<RoundData>) {
    if (lobbyUUID) {
      await updateRoundData(db, roundDataUpdate, roundData, lobbyUUID);
    }
  }

  /**
   * Helper function to parse numbers from inputs, 0 by default
   * @param e 
   * @returns 
   */
  function parseNumber(val: string) {
    const newVal = parseInt(val)
    if (newVal) return newVal;
    else return 0;
  }
  function calculateCards(round: number) {
    const index = round - 1;
    if (index < 0) {
      return cardsPerRound[0] - index;
    } else if (index > cardsPerRound.length - 1) {
      return cardsPerRound[cardsPerRound.length - 1] + (index - cardsPerRound.length);
    }
    else {
      console.log(index)
      return cardsPerRound[index];
    }
  }

  function changeRound(newRound: number) {
    if (lobbyUUID) {
      // copy live data to history
      const historyUpdate: ScoreboardDataDict = {
        [lobby.live.roundData.round]: {
          roundData: lobby.live.roundData,
          players: lobby.live.players
        }
      }
      updateHistory(db, historyUpdate, lobbyUUID);

      // change round
      const roundDataUpdate: Partial<RoundData> = {
        cards: calculateCards(newRound),
        round: newRound,
        isJeopardyModeRoundFinished: false,
      }
      updateRoundData(db, roundDataUpdate, roundData, lobbyUUID);

      // reset bids and wagers
      const scoreboardUpdate: PlayerDataDict = {}
      Object.keys(lobby.live.players).forEach((playerName) => {
        const playerData = lobby.live.players[playerName];
        scoreboardUpdate[playerName] = { bid: 0, wager: 0, score: playerData.score, name: playerData.name}
      });
      updateScoreboard(db, scoreboardUpdate, lobby.live.players, lobbyUUID)
    }

  }

  function handleAddPlayer(){
    if (lobbyUUID) {
      addPlayerToLobby(db,"PLAYER-" + generateRandomLobbyCode(),lobbyUUID);
    };
  }

  return (
    <div>
      <div>
        <div><h4 style={{ display: "inline-block" }}>Welcome '{name}'!</h4> <h4 style={{ display: "inline-block" }}>Lobby Code: '</h4><h4 style={{ display: "inline-block", color: "blue" }}>{lobbyCode}</h4><h4 style={{ display: "inline-block" }}>'</h4></div>
        <div>
          <h3><Button onClick={() => changeRound(lobby.live.roundData.round - 1)}><ArrowBackIosIcon></ArrowBackIosIcon></Button> Round {lobby.live.roundData.round} <Button onClick={() => changeRound(lobby.live.roundData.round + 1)}><ArrowForwardIosIcon></ArrowForwardIosIcon></Button></h3>
        </div>
        <div>
          <TextField label="Cards" size="small" type="number" inputProps={{ pattern: "[0-9]*" }} style={{ width: 60 }} value={lobby.live.roundData.cards} onChange={(e) => handleRoundDataUpdate({ cards: parseNumber(e.target.value) })}></TextField>
          <Button variant="outlined" onClick={handleAddPlayer}><PersonAddIcon></PersonAddIcon></Button>
        </div>
      </div>
      <Scoreboard></Scoreboard>
      <div>
        History <Switch checked={showHistory} onChange={(e) => setShowHistory(!showHistory)} />
        Jeopardy Mode <Switch checked={roundData.isJeopardyMode} onChange={(e) => {if (lobbyUUID) updateRoundData(db,{isJeopardyMode: !roundData.isJeopardyMode}, roundData ,lobbyUUID)}} />
        <div hidden={!roundData.isJeopardyMode}>
        Jeopardy Round Complete <Switch checked={roundData.isJeopardyModeRoundFinished} onChange={(e) => {if (lobbyUUID) updateRoundData(db,{isJeopardyModeRoundFinished: !roundData.isJeopardyModeRoundFinished}, roundData ,lobbyUUID)}} />
        </div>
      </div>
      <div hidden={!showHistory}>
        <LobbyHistory></LobbyHistory>
      </div>
      <Button color="error" variant="outlined" disabled={deleteLobbyDisabled} onClick={handleDeleteLobby} >Delete Lobby</Button>
    </div>
  );
}

export default Main;


