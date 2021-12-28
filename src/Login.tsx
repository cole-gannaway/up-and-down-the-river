import { get, ref } from 'firebase/database';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { db } from './config/firebase';
import { selectLobbyCode, selectName, setJoinedLobby, setLobbyCode, setLobbyUUID, setName } from './features/app-state';

function Login() {
  const dispatch = useAppDispatch();

  const lobbyCode = useAppSelector(selectLobbyCode);
  const name = useAppSelector(selectName);

  function handleJoinLobby() {
    // get lobby UUID
    const lobbyCodesRef = ref(db, "lobbycodes/" + lobbyCode);

    get(lobbyCodesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const lobbyUUID = snapshot.val();
        dispatch(setLobbyUUID(lobbyUUID));
        dispatch(setJoinedLobby(true))
      } else {
        console.log('Invalid room code');
      }
    });
  }

  function handleCreateLobby() {

  }

  const joinLobbyDisabled = !(name.length > 0 && lobbyCode.length > 0)
  return (
    <div>
      <h2>Up and down the river</h2>
      <div>Lobby Code: <input value={lobbyCode} onChange={(e) => { dispatch(setLobbyCode(e.target.value)) }}></input></div>
      <div>Name: <input value={name} onChange={(e) => { dispatch(setName(e.target.value)) }}></input></div>
      <button disabled={joinLobbyDisabled} onClick={handleJoinLobby}>Join</button>
      <button disabled={joinLobbyDisabled} onClick={handleCreateLobby}>Create</button>
    </div>
  );
}

export default Login;
