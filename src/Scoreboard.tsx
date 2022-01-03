import { Button, Slider, TextField } from "@mui/material";
import { useAppSelector } from "./app/hooks";
import { db } from "./config/firebase";
import { selectLobbyData } from "./features/lobby";
import { deletePlayerFromLobby, transformPlayersDataIntoAnArray, updateScoreboard } from "./firebase/firebase-utils";

import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { selectLobbyUUID, selectPlayerUUID } from "./features/app-state";
import { PartialPlayerDataDict } from "./interfaces/ILobbyData";
import { parseNumber } from "./utils/utils";

export function Scoreboard() {
    const lobby = useAppSelector(selectLobbyData);
    const playerUUID = useAppSelector(selectPlayerUUID);
    const playersData = transformPlayersDataIntoAnArray(lobby.live.players);
    const roundData = lobby.live.roundData;

    const lobbyUUID = useAppSelector(selectLobbyUUID);

    async function handleUpdateScoreboard(scoreboardUpdate: PartialPlayerDataDict) {
        if (lobbyUUID) {
            await updateScoreboard(db, scoreboardUpdate, lobby.live.players , lobbyUUID);
            return true;
        }
        return false;
    }

    async function handleUpdatePlayerName(playerUUID: string, updatedPlayerName: string){
        const success = await handleUpdateScoreboard({ [playerUUID]: { name: updatedPlayerName.toLocaleUpperCase()} });
    }

    return <div>
        <table style={{ marginLeft: "auto", marginRight: "auto" }}>
            <thead>
                    {roundData.isJeopardyMode ? <tr> 
                        <th></th>
                        <th></th>
                        <th>Name</th>
                        <th>Bid</th>
                        <th>Wager</th>
                        <th>Score</th>
                        <th></th>
                        </tr>
                    :
                    <tr>
                        <th></th>
                        <th>Bid</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th></th>
                    </tr>
                    }
            </thead>
            <tbody>
                {playersData.map((data) => {
                    if (roundData.isJeopardyMode){
                        const isJeopardyModeRoundFinished = roundData.isJeopardyModeRoundFinished;
                        const shouldDisableOtherRows = !isJeopardyModeRoundFinished && (data.uuid !== playerUUID) ;
                        return <tr key={data.uuid}>
                            <td><Button color="success" disabled={shouldDisableOtherRows} onClick={() => { handleUpdateScoreboard({ [data.uuid]: { bid: data.bid, score: (data.score + data.wager), name: data.name, wager: 0} }) }}><CheckIcon></CheckIcon></Button></td>
                            <td><Button color="error" disabled={shouldDisableOtherRows} onClick={() => { handleUpdateScoreboard({ [data.uuid]: { bid: data.bid, score: (data.score - data.wager), name: data.name, wager: 0} }) }}><ClearIcon></ClearIcon></Button></td>
                            <td><TextField type="text" size="small" value={data.name} disabled={shouldDisableOtherRows} style={{ width: 160 }} inputProps={{ pattern: "[A-Za-z]*" }} onChange={(e) => handleUpdatePlayerName(data.uuid, e.target.value)}></TextField></td>
                            <td><TextField type="number" size="small" value={!shouldDisableOtherRows ? data.bid : 0} disabled={shouldDisableOtherRows} style={{ width: 60 }}  inputProps={{ pattern: "[0-9]*" }}  onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { bid: parseNumber(e.target.value)} })}></TextField></td>
                            <td style={{minWidth: 170}}>
                                <Slider size="small" value={!shouldDisableOtherRows ? data.wager : 0} disabled={shouldDisableOtherRows} style={{width: 100}} onChange={(e,val) => {if (typeof val === "number") handleUpdateScoreboard({ [data.uuid]: { wager: val} })}} max={data.score}></Slider>
                                {" "}
                                <TextField type="number" size="small" value={!shouldDisableOtherRows ? data.wager : 0} disabled={shouldDisableOtherRows} style={{ width: 60 }} inputProps={{ pattern: "[0-9]*" }} onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { wager: parseNumber(e.target.value) } })} ></TextField>
                            </td>
                            <td><TextField type="number" size="small" value={data.score} disabled={shouldDisableOtherRows} inputProps={{ pattern: "[0-9]*" }} style={{ width: 80 }} onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { score: parseNumber(e.target.value) } })}></TextField></td>
                            <td><Button color="error" disabled={lobbyUUID ? false : true} onClick={() => { if (lobbyUUID) deletePlayerFromLobby(db, data.uuid, lobbyUUID) }}> <DeleteIcon></DeleteIcon> </Button> </td>
                        </tr>
                    }
                    else
                        return <tr key={data.uuid}>
                            <td><Button color="success" onClick={() => { handleUpdateScoreboard({ [data.uuid]: { score: (data.score + data.bid + 10)} }) }}><CheckIcon></CheckIcon></Button></td>
                            <td><TextField type="number" size="small" inputProps={{ pattern: "[0-9]*" }} style={{ width: 60 }} value={data.bid} onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { bid: parseNumber(e.target.value)} })}></TextField></td>
                            <td><TextField type="text" size="small" inputProps={{ pattern: "[A-Za-z]*" }} style={{ width: 160 }} value={data.name} onChange={(e) => handleUpdatePlayerName(data.uuid, e.target.value)}></TextField></td>
                            <td><TextField type="number" size="small" inputProps={{ pattern: "[0-9]*" }} style={{ width: 80 }} value={data.score} onChange={(e) => handleUpdateScoreboard({ [data.uuid]: { score: parseNumber(e.target.value)} })}></TextField></td>
                            <td><Button color="error" disabled={lobbyUUID ? false : true} onClick={() => { if (lobbyUUID) deletePlayerFromLobby(db, data.uuid, lobbyUUID) }}> <DeleteIcon></DeleteIcon> </Button> </td>
                        </tr>
                })
                }
            </tbody>
        </table>
    </div>;
}