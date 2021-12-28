import React from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectCards, selectName, setCards } from './features/app-state';
import { selectLobbyScoreboard } from './features/lobby';

interface PlayerData {
  name: string;
  bid: number;
  score: number;
}

function Main() {
  const dispatch = useAppDispatch();

  const name = useAppSelector(selectName)
  const lobbyScoreboard = useAppSelector(selectLobbyScoreboard);
  const cards = useAppSelector(selectCards);

  const playersData: PlayerData[] = [];
  if (lobbyScoreboard) {
    Object.entries(lobbyScoreboard).forEach((entry) => {
      const playerName = entry[0];
      const playerData = entry[1];
      playersData.push({ name: playerName, bid: playerData.bid, score: playerData.score })
    });
  }

  return (
    <div>
      <h2>Logged In {name}</h2>
      <div>
        <button onClick={() => dispatch(setCards(cards - 1))}>{"<"}</button> Round {cards} <button onClick={() => dispatch(setCards(cards + 1))}>{">"}</button>
      </div>
      <table>
        <thead>
          <tr><th>Name</th><th>Bid</th><th>Score</th></tr>
        </thead>
        <tbody>
          {playersData.map((data) => {
            return <tr key={data.name}>
              <td>{data.name}</td>
              <td>{data.bid}</td>
              <td>{data.score}</td>
            </tr>
          })
          }
        </tbody>
      </table>
      {/* Scoreboard */}
    </div>
  );
}

export default Main;
