import { onValue, ref } from 'firebase/database';
import React, { useEffect } from 'react';
import { db } from './config/firebase';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectIsLoggedIn, selectLobbyUUID} from './features/app-state';
import Login from './Login';
import Main from './Main';
import {  setLobbyData } from './features/lobby';
import { LobbyData } from './interfaces/ILobbyData';
import img from './assets/card-game-64.png'

function App() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const lobbyUUID = useAppSelector(selectLobbyUUID);

  useEffect(() => {
    let unsubscribe = () => { };
    if (lobbyUUID) {
      const lobbyRef = ref(db, "lobbies/" + lobbyUUID);

      // subscribe to updates on the database
      // this is how data updates from client -> database -> client
      unsubscribe = onValue(lobbyRef, (snapshot) => {
        if (snapshot.exists()) {
          const lobby = snapshot.val() as LobbyData;
          dispatch(setLobbyData(lobby))
        } else {
          console.log('No data available');
        }
      });
    }

    return () => {
      unsubscribe();
    }
  }, [dispatch, lobbyUUID])
  
  return (
    <div style={{textAlign: "center"}}>
      <div >
        <h2>Up And Down The River <img src={img} alt="Logo" /></h2>
      </div>
      {isLoggedIn === false ? <Login></Login> : <Main></Main>}
    </div>
  );
}

export default App;
