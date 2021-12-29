import { useAppSelector } from "./app/hooks";
import {  selectLobbyData } from "./features/lobby";
import { ScoreboardDataDict } from "./interfaces/ILobbyData";

export function LobbyHistory(){
    const lobby = useAppSelector(selectLobbyData);
    const history = lobby.history;

    const headers : any[] = [];
    const rows : any[] = [];
    if (history){
        const playerNames = getAllPlayerNamesFromHistory(history);
        playerNames.forEach((playerName) => {
            const dataCells: any[] = [];
            Object.keys(history).forEach((roundStr,i) => {
                const round = parseInt(roundStr);
                const scoreboard = history[round];
                const playerData = scoreboard.players[playerName]
                const score = playerData ? playerData.score : 0;
                dataCells.push(<td key={"data-"+playerName + "-" + roundStr}>{score}</td>)
            })
            rows.push(<tr key={"row-" + playerName}><td>{playerName}</td>{dataCells}</tr>)
        })
        Object.keys(history).forEach((roundStr,i) => {
            const round = parseInt(roundStr);
            headers.push(<th key={"header-round-" + round}>Round {round}</th>)
        })
    }
    
    
    return <div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    {headers}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    </div>
}

function getAllPlayerNamesFromHistory(history: ScoreboardDataDict) {
    const playerNamesSet : Set<string> = new Set<string>();
    Object.keys(history).forEach((roundStr,i) => {
        const round = parseInt(roundStr);
        const scoreboard = history[round];
        Object.keys(scoreboard.players).forEach((name) => playerNamesSet.add(name));
    })
    return Array.from(playerNamesSet.values());
}
