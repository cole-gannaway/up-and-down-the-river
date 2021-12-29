import { Database, get, ref, set, update } from 'firebase/database';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { db } from './config/firebase';
import { selectName, setIsLoggedIn, setLobbyCode, setLobbyUUID, setName } from './features/app-state';
import { addPlayerToLobby, createNewLobby, getLobbyUUID, isPlayerInLobby } from './firebase/firebase-utils';

function Login() {
  const dispatch = useAppDispatch();

  const name = useAppSelector(selectName);
  const [localLobbyCode, setLocalLobbyCode] = useState('')

 
  /**
   * Set app data
   */
  async function joinLobby(db: Database, lobbyCode: string) {
    // get lobby UUID
    const lobbyUUID = await getLobbyUUID(db, lobbyCode);
    if (lobbyUUID) {
      let playerIsInLobby = await isPlayerInLobby(db, lobbyUUID, name);
      if (!playerIsInLobby){
        playerIsInLobby = await addPlayerToLobby(db, name, lobbyUUID);
      }
      if (playerIsInLobby) {
        dispatch(setLobbyUUID(lobbyUUID));
        dispatch(setIsLoggedIn(true))
      }
      else {
        console.log("Could not add player " + name + " to lobby " + lobbyUUID)
      }
    }
    else {
      console.log("Invalid lobbycode " + lobbyCode)
    }
  }

  async function handleJoinLobby() {
    joinLobby(db, localLobbyCode);
  }

  async function handleCreateLobby() {
    const lobbyCode = await createNewLobby(db);
    if (lobbyCode) {
      dispatch(setLobbyCode(lobbyCode))
      await joinLobby(db, lobbyCode);
    }
  }

  const joinLobbyDisabled = !(name.length > 0 && localLobbyCode.length > 0);
  const createLobbyDisabled = !(name.length > 0);
  return (
    <div>
      <h2>Up and down the river</h2>
      <div>
        <h4>Join Lobby</h4>
        <div>Lobby Code: <input value={localLobbyCode} onChange={(e) => { setLocalLobbyCode(e.target.value.toLocaleUpperCase()) }}></input></div>
        <div>Name: <input value={name} onChange={(e) => { dispatch(setName(e.target.value)) }}></input></div>
        <button disabled={joinLobbyDisabled} onClick={handleJoinLobby}>Join</button>
      </div>
      <div>
        <h4>Create Lobby</h4>
        <div>Name: <input value={name} onChange={(e) => { dispatch(setName(e.target.value)) }}></input></div>
        <button disabled={createLobbyDisabled} onClick={handleCreateLobby}>Create</button>
      </div>
    </div>
  );
}

export default Login;
