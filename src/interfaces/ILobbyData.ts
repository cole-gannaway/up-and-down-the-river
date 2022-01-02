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
  isJeopardyModeRoundFinished: boolean;
  round: number;
}
export interface PlayerDataDict {
  [playerUUID: string]: PlayerData
}
export interface PlayerData {
  name: string;
  bid: number;
  score: number;
  wager: number;
}

export interface ScoreboardDataDict{
  [round: number] : ScoreboardData
}

