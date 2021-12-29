import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { db } from './config/firebase';
import {  selectLobbyCode, selectLobbyUUID, selectName, setIsLoggedIn, setLobbyCode, setLobbyUUID } from './features/app-state';
import { selectLobbyData } from './features/lobby';
import { deleteLobby, deletePlayerFromLobby, updateHistory, updateScoreboard, updateRoundData, transformPlayersDataIntoAnArray } from './firebase/firebase-utils';
import { PlayerData, PlayerDataDict, RoundData, ScoreboardData, ScoreboardDataDict } from './interfaces/ILobbyData';
import { LobbyHistory } from './LobbyHistory';

function Main() {
  const dispatch = useAppDispatch();

  const lobby = useAppSelector(selectLobbyData);
  const playersData = transformPlayersDataIntoAnArray(lobby.live.players);
  const [hideHistory, setHideHistory] = useState(false);
  
  const name = useAppSelector(selectName)
  const lobbyUUID = useAppSelector(selectLobbyUUID);
  const lobbyCode = useAppSelector(selectLobbyCode);
  const cardsPerRound =  [7,6,5,4,3,2,1,1,2,3,4,5,6,7];


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

  async function handleRoundDataUpdate(roundDataUpdate: RoundData) {
    if (lobbyUUID){
      await updateRoundData(db,roundDataUpdate,lobbyUUID);
    }
  }

  async function handleUpdateScoreboard(scoreboardUpdate: PlayerDataDict) {
    if (lobbyUUID){
      await updateScoreboard(db,scoreboardUpdate,lobbyUUID);
    }
  }
  
  /**
   * Helper function to parse numbers from inputs, 0 by default
   * @param e 
   * @returns 
   */
  function parseNumber(e: React.ChangeEvent<HTMLInputElement>){
    const newVal = parseInt(e.target.value)
    if (newVal) return newVal;
    else return 0;
  }
  function calculateCards(round: number) {
    const index = round - 1;
    if (index < 0){
      return cardsPerRound[0] - index;
    } else if (index > cardsPerRound.length - 1){
      return cardsPerRound[cardsPerRound.length-1] + (index - cardsPerRound.length);
    }
    else {
      console.log(index)
      return cardsPerRound[index];
    } 
  }

  function changeRound(newRound: number){
    if (lobbyUUID){
      // copy live data to history
      const historyUpdate : ScoreboardDataDict = {
        [lobby.live.roundData.round]: {
          roundData: lobby.live.roundData,
          players: lobby.live.players
        }
      }
      updateHistory(db, historyUpdate, lobbyUUID);
      
      // change round
      const roundDataUpdate : RoundData = {
        cards: calculateCards(newRound), 
        isJeopardyMode: lobby.live.roundData.isJeopardyMode,
        round: newRound
      }
      updateRoundData(db,roundDataUpdate,lobbyUUID);

      // reset bids
      const scoreboardUpdate : PlayerDataDict = {}
      Object.keys(lobby.live.players).forEach((playerName) => scoreboardUpdate[playerName]= {bid: 0, score: lobby.live.players[playerName].score});
      updateScoreboard(db, scoreboardUpdate, lobbyUUID)
    }

  }

  return (
    <div>
      <button disabled={deleteLobbyDisabled} onClick={handleDeleteLobby}>Delete</button>
      <h2>Logged In {name}</h2>
      <div>
        <div>
          <button onClick={() => changeRound(lobby.live.roundData.round - 1)}>{"<"}</button> Round {lobby.live.roundData.round} <button onClick={() => changeRound(lobby.live.roundData.round + 1)}>{">"}</button>
        </div>
        Cards <input value={lobby.live.roundData.cards} onChange={(e) => handleRoundDataUpdate({ cards: parseNumber(e), isJeopardyMode: lobby.live.roundData.isJeopardyMode, round : lobby.live.roundData.round})}></input>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Bid</th>
            <th>Name</th>
            <th>Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {playersData.map((data) => {
            return <tr key={data.name}>
              <td><button onClick={() => {handleUpdateScoreboard({[data.name]: { bid: data.bid, score: (data.score + data.bid + 10) }})}}>checkmark</button></td>
              <td><input type="number" value={data.bid} onChange={(e) => handleUpdateScoreboard({[data.name]: {bid:parseNumber(e), score: data.score}})}></input></td>
              <td>{data.name}</td>
              <td><input type="number" value={data.score} onChange={(e) => handleUpdateScoreboard({[data.name]: {bid:data.bid, score: parseNumber(e)}})}></input></td>
              <td><button disabled={lobbyUUID ? false : true} onClick={() => { if (lobbyUUID) deletePlayerFromLobby(db, data.name, lobbyUUID) }}>x</button> </td>
            </tr>
          })
          }
        </tbody>
      </table>
      {/* Scoreboard */}
      <div>
        Hide history <input type="checkbox" checked={hideHistory} onChange={(e) => setHideHistory(!hideHistory)}></input>
      </div>
      <div hidden={hideHistory}>
        <LobbyHistory></LobbyHistory>
      </div>
    </div>
  );
}

export default Main;


