import { useAppSelector } from "./app/hooks";
import {  selectLobbyData } from "./features/lobby";
import { ScoreboardDataDict } from "./interfaces/ILobbyData";

export function LobbyHistory(){
    const lobby = useAppSelector(selectLobbyData);
    const history = lobby.history;

    const headers : any[] = [];
    const rows : any[] = [];
    if (history){
        const playerUUIDToName = getAllPlayerUUIDsFromHistory(history);
        const playerUUIDs = Object.keys(playerUUIDToName);
        playerUUIDs.forEach((playerUUID) => {
            const dataCells: any[] = [];
            Object.keys(history).forEach((roundStr,i) => {
                const round = parseInt(roundStr);
                const scoreboard = history[round];
                const playerData = scoreboard.players[playerUUID]
                const score = playerData ? playerData.score : 0;
                dataCells.push(<td key={"data-"+playerUUID + "-" + roundStr}>{score}</td>)
            })
            rows.push(<tr key={"row-" + playerUUID}><td>{playerUUIDToName[playerUUID]}</td>{dataCells}</tr>)
        })
        Object.keys(history).forEach((roundStr,i) => {
            const round = parseInt(roundStr);
            headers.push(<th key={"header-round-" + round}>Round {round}</th>)
        })
    }
    
    
    return <div>
        <table style={{marginLeft : "auto", marginRight: "auto"}}>
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

function getAllPlayerUUIDsFromHistory(history: ScoreboardDataDict) {
    const playerUUIDToName : {[uuid: string] : string}  = {};
    Object.keys(history).forEach((roundStr,i) => {
        const round = parseInt(roundStr);
        const scoreboard = history[round];
        Object.entries(scoreboard.players).forEach((entry) => {
            const playerUUID = entry[0];
            const playerName = entry[1].name
            playerUUIDToName[playerUUID] = playerName;
        });
    })
    return playerUUIDToName;
}
