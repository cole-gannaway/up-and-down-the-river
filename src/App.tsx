import { get, onValue, ref } from 'firebase/database';
import React, { useEffect } from 'react';
import { db } from './config/firebase';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectJoinedLobby, selectLobbyCode, selectLobbyUUID, selectOfflineMode, setLobbyUUID, setOfflineMode } from './features/app-state';
import Login from './Login';
import Main from './Main';
import { setLobbyName, setLobbyHistory, setLobbyScoreboard } from './features/lobby';

function App() {
  const dispatch = useAppDispatch();
  const joinedLobby = useAppSelector(selectJoinedLobby);
  const offline = useAppSelector(selectOfflineMode);
  const lobbyUUID = useAppSelector(selectLobbyUUID);

  useEffect(() => {
    let unsubscribe = () => { };
    if (lobbyUUID) {
      const lobbyRef = ref(db, "lobbies/" + lobbyUUID);

      // subscribe
      unsubscribe = onValue(lobbyRef, (snapshot) => {
        if (snapshot.exists()) {
          const lobby = snapshot.val();
          console.log(lobby.data);
          dispatch(setLobbyName(lobby.data.lobbyname))
          dispatch(setLobbyScoreboard(lobby.data.scoreboard))
          dispatch(setLobbyHistory({ ...lobby.data.history }))
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
    <div>
      {/* header */}
      <div>
        Offline <input type="checkbox" checked={offline} onChange={(e) => dispatch(setOfflineMode(e.target.checked))}></input>
      </div>
      {joinedLobby === false ? <Login></Login> : <Main></Main>}
    </div>
  );
}

export default App;
