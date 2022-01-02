import { Button, TextField } from '@mui/material';
import { Database } from 'firebase/database';
import React from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { db } from './config/firebase';
import { selectLobbyCode, selectName, setIsLoggedIn, setLobbyCode, setLobbyUUID, setName, setPlayerUUID } from './features/app-state';
import { addPlayerToLobby, createNewLobby, getLobbyUUID, findPlayerByNameInLobby } from './firebase/firebase-utils';
import { validateText } from './utils/utils';
import { useSnackbar } from 'notistack';

function Login() {
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectName);
  const lobbyCode = useAppSelector(selectLobbyCode);

  const { enqueueSnackbar } = useSnackbar();

  /**
   * Set app data
   */
  async function joinLobby(db: Database, lobbyCode: string) {
    // get lobby UUID
    const lobbyUUID = await getLobbyUUID(db, lobbyCode);
    if (lobbyUUID) {
      let playerUUID = await findPlayerByNameInLobby(db, lobbyUUID, name);
      if (!playerUUID) {
        playerUUID = await addPlayerToLobby(db, name, lobbyUUID);
      }
      if (playerUUID) {
        dispatch(setLobbyUUID(lobbyUUID));
        dispatch(setIsLoggedIn(true));
        dispatch(setPlayerUUID(playerUUID))
        return true;
      }
      else {
        console.log("Could not add player " + name + " to lobby " + lobbyUUID)
        return false;
      }
    }
    else {
      console.log("Invalid lobbycode " + lobbyCode)
      return false;
    }
  }

  async function handleJoinLobby() {
    const success = await joinLobby(db, lobbyCode);
    if (!success){
      enqueueSnackbar("Invalid Lobby Code '" + lobbyCode + "'", {variant: "error", anchorOrigin: {horizontal: "center", vertical:"bottom"}})
    }
  }

  async function handleCreateLobby() {
    const lobbyCode = await createNewLobby(db);
    if (lobbyCode) {
      dispatch(setLobbyCode(lobbyCode))
      await joinLobby(db, lobbyCode);
    }
  }

  const joinLobbyDisabled = !(name.length > 0 && lobbyCode.length > 0);
  const createLobbyDisabled = !(name.length > 0);
  return (
    <div>
      <div><TextField type="text" label="Name" inputProps={{ pattern: "[A-Z]*" }} value={name} onChange={(e) => { if (validateText(e.target.value,"[A-Za-z]$",true)) dispatch(setName(e.target.value.toLocaleUpperCase())) }}></TextField></div>
      <br></br>
      <div><TextField type="text" label="Lobby Code" inputProps={{ pattern: "[A-Z]*" }} value={lobbyCode} onChange={(e) => { if (validateText(e.target.value,"[A-Za-z]$",true)) dispatch(setLobbyCode(e.target.value.toLocaleUpperCase()))}} onKeyDown={(e) => {if(e.key === "Enter") handleJoinLobby()}}></TextField></div>
      <br></br>
      <div>
        <Button variant="outlined" disabled={joinLobbyDisabled} onClick={handleJoinLobby}>Join Lobby</Button>
        <Button variant="outlined" disabled={createLobbyDisabled} onClick={handleCreateLobby}>Create Lobby</Button>
      </div>
    </div>
  );
}

export default Login;
