/**
 * Contains all of the information associated with a lobby
 */
export interface App {
  lobbies: LobbyDict;
  lobbycodes: LobbyCodesDict;
}
export interface LobbyCodesDict {
  [code: string]: [lobbyId: string];
}
export interface LobbyDict {
  [lobbyUUID: string] : LobbyData;
}
export interface LobbyData {
  metadata: LobbyMetadata;
  live: ScoreboardData;
  history: ScoreboardDataDict | null;
}
export interface LobbyMetadata {
  lobbyname: string;
}
export interface ScoreboardData {
  roundData: RoundData;
  players: PlayerDataDict;
}

export interface RoundData {
  cards: number;
  isJeopardyMode: boolean;
  round: number;
}
export interface PlayerDataDict {
  [playerName: string]: PlayerData
}
export interface PlayerData {
  bid: number;
  score: number;
}

export interface ScoreboardDataDict{
  [round: number] : ScoreboardData
}

