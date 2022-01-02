import { Button, TextField } from "@mui/material";
import { useAppSelector } from "./app/hooks";
import { db } from "./config/firebase";
import { selectLobbyData } from "./features/lobby";
import { deletePlayerFromLobby, transformPlayersDataIntoAnArray, updateScoreboard } from "./firebase/firebase-utils";
import { PlayerDataDict } from "./interfaces/ILobbyData";

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectLobbyUUID } from "./features/app-state";

export function Scoreboard() {
    const lobby = useAppSelector(selectLobbyData);
    const playersData = transformPlayersDataIntoAnArray(lobby.live.players);

    const lobbyUUID = useAppSelector(selectLobbyUUID);

    async function handleUpdateScoreboard(scoreboardUpdate: PlayerDataDict) {
        if (lobbyUUID) {
            await updateScoreboard(db, scoreboardUpdate, lobbyUUID);
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
    return <div>
        <table style={{ marginLeft: "auto", marginRight: "auto" }}>
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
                    return <tr key={data.uuid}>
                        <td><Button color="success" onClick={() => { handleUpdateScoreboard({ [data.uuid]: { bid: data.bid, score: (data.score + data.bid + 10), name: data.name } }) }}><CheckIcon></CheckIcon></Button></td>
                        <td><TextField type="number" size="small" inputProps={{ pattern: "[0-9]*" }} style={{ width: 60 }} value={data.bid} onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { bid: parseNumber(e.target.value), score: data.score, name: data.name } })} tabIndex={1}></TextField></td>
                        <td><TextField type="text" size="small" inputProps={{ pattern: "[A-Za-z]*" }} style={{ width: 160 }} value={data.name} onChange={(e) => { handleUpdateScoreboard({ [data.uuid]: { bid: data.bid, score: data.score, name: e.target.value.toLocaleUpperCase() } }) }} tabIndex={3}></TextField></td>
                        <td><TextField type="number" size="small" inputProps={{ pattern: "[0-9]*" }} style={{ width: 80 }} value={data.score} onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { bid: data.bid, score: parseNumber(e.target.value), name: data.name } })} tabIndex={2}></TextField></td>
                        <td><Button color="error" disabled={lobbyUUID ? false : true} onClick={() => { if (lobbyUUID) deletePlayerFromLobby(db, data.uuid, lobbyUUID) }}> <DeleteIcon></DeleteIcon> </Button> </td>
                    </tr>
                })
                }
            </tbody>
        </table>
    </div>;
}