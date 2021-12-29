import { Database, DatabaseReference, get, ref, remove, set, update } from 'firebase/database';

import { v4 as uuidv4 } from 'uuid';
import { createEmptyLobbyData } from '../features/lobby';
import { LobbyData, PlayerDataDict, RoundData, ScoreboardDataDict } from '../interfaces/ILobbyData';

/**
 * Generates a random code for a lobby
 * @returns 
 */
export function generateRandomLobbyCode() {
  const length = 4;
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

/**
 * 
 * @param db firebase database
 * @param lobbyCode 
 * @returns lobbyUUID to attach to , null if it does not exists or errors
 */
export async function getLobbyUUID(db: Database, lobbyCode: string) {
  const lobbyCodesRef = ref(db, firebasePathConcat(["lobbycodes", lobbyCode]));

  let retVal: string | null = null
  try {
    const snapshot = await get(lobbyCodesRef)
    if (snapshot.exists()) {
      const lobbyUUID = snapshot.val();
      retVal = lobbyUUID;
    }
  } catch (e) {
    console.error(e);
  }

  return retVal;
}
/**
   * Creates a lobby
   * 
   * @returns lobbyCode to join
   */
export async function createNewLobby(db: Database) {
  // create a unique lobby code
  let lobbyCode: string | null = null;
  let lobbyUUID: string | null = null;
  let isLobbyCodeUnique = false;
  let numTries = 0;
  const maxTries = 100; // maximum number of random code generations

  do {
    lobbyCode = generateRandomLobbyCode();
    // is lobby code already in use
    lobbyUUID = await getLobbyUUID(db, lobbyCode);
    if (lobbyUUID === null) isLobbyCodeUnique = true
    numTries++;
  }
  while (!isLobbyCodeUnique && numTries < maxTries);

  // if successful random code
  if (isLobbyCodeUnique) {
    lobbyUUID = uuidv4();

    // create code to lobby
    const lobbyCodeRef = ref(db, "lobbycodes");
    update(lobbyCodeRef, {
      [lobbyCode]: lobbyUUID
    })


    // create lobby
    const lobbyRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID]));
    const lobbyData: LobbyData = createEmptyLobbyData();
    set(lobbyRef, lobbyData);

    console.log("Created lobby " + lobbyUUID)
    return lobbyCode;
  } else {
    return null;
  }
}

export async function deleteLobby(db: Database, lobbyCode: string, lobbyUUID: string) {
  console.log("Deleting " + lobbyUUID + " using code " + lobbyCode)
  // delete lobby code
  const lobbyCodeRef = ref(db, firebasePathConcat(["lobbycodes", lobbyCode]));
  remove(lobbyCodeRef)

  // delete lobby
  const lobbyRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID]));
  remove(lobbyRef);
}

export async function isPlayerInLobby(db: Database, lobbyUUID: string, playerName: string) {
  const path = firebasePathConcat(["lobbies", lobbyUUID, "live", "players", playerName]);
  const lobbyScoreboardPlayerRef = ref(db, path);
  let retVal: boolean = false;
  try {
    const snapshot = await get(lobbyScoreboardPlayerRef)
    if (snapshot.exists()) {
      retVal = true;
    }
  } catch (e) {
    retVal = false;
  }
  return retVal;
}

export async function addPlayerToLobby(db: Database, playerName: string, lobbyUUID: string) {
  console.log("Adding player " + playerName + " to lobby " + lobbyUUID);
  // add player only if the player is NOT in the lobby
  const lobbyScoreboardRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID, "live", "players"]));
  const scoreboardUpdate: PlayerDataDict = {
    [playerName]: {
      bid: 0,
      score: 0
    }
  }
  const successful = await updateAndMergeData(lobbyScoreboardRef, scoreboardUpdate)
  return successful;
}

export async function deletePlayerFromLobby(db: Database, playerName: string, lobbyUUID: string) {
  console.log("Deleting player " + playerName + " from lobby " + lobbyUUID);
  // remove player only if the player is in the lobby
  const playerExists = await isPlayerInLobby(db, lobbyUUID, playerName);
  if (playerExists) {
    const playerRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID, "live", "players", playerName]));
    remove(playerRef);
  }
}

export async function updateRoundData(db: Database, roundDataUpdate: RoundData, lobbyUUID: string) {
  const headerRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID, "live","roundData"]));
  return await updateAndMergeData(headerRef, roundDataUpdate);
}

export async function updateScoreboard(db: Database, scoreboardUpdate: PlayerDataDict, lobbyUUID: string) {
  const scoreboardRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID, "live", "players"]));
  return await updateAndMergeData(scoreboardRef, scoreboardUpdate);
}

export async function updateHistory(db: Database, historyUpdate: ScoreboardDataDict, lobbyUUID: string) {
  const historyRef = ref(db, firebasePathConcat(["lobbies", lobbyUUID, "history"]));
  return await updateAndMergeData(historyRef, historyUpdate);
}

/**
 * Generic method for updating data in a firebase database 
 * @param dbRef 
 * @param updateData 
 * @returns 
 */
export async function updateAndMergeData(dbRef: DatabaseReference, updateData: any) {
  let successful: boolean = false;
  try {
    await update(dbRef, flatten(updateData));
    successful = true;
  } catch (e) {
    successful = false;
  }
  return successful;
}


/**
 * Function used to flatten data for firebase merges
 * Ex: { data: { bid: 2, score: 1 } } becomes { "data/bid" : 2, "data/score" : 1 }
 * 
 * @param data 
 * @returns 
 */
function flatten(data: any) {
  const result: any = {}
  function recurse(cur: any, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) { // eslint-disable-line
        recurse(cur[i], `${prop}[${i}]`)
      }
      if (l == 0) { // eslint-disable-line
        result[prop] = []
      }
    } else {
      let isEmpty = true
      for (const p in cur) { // eslint-disable-line
        isEmpty = false
        recurse(cur[p], prop ? `${prop}/${p}` : p)
      }
      if (isEmpty && prop) {
        result[prop] = {}
      }
    }
  }
  recurse(data, '')
  return result;
}

/**
 * Function used to create firebase paths to keep from making mistakes
 * 
 * @param arr 
 * @returns 
 */
function firebasePathConcat(arr: string[]) {
  let str = "";
  arr.forEach((val, i) => {
    str += val
    if (i !== arr.length - 1) {
      str += "/"
    }
  });
  return str;
}

export function transformPlayersDataIntoAnArray(playerDataDict: PlayerDataDict){
  return Object.keys(playerDataDict).map((key) => {
    return {
      name: key,
      bid: playerDataDict[key].bid,
      score: playerDataDict[key].score
    }
  })
}