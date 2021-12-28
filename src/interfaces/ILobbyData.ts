/**
 * Contains all of the information associated with a lobby
 */
export interface ILobbyData {
  lobbyname: string;
  scoreboard: IScoreBoardInfo;
  history: IHistoryInfo;
}

/**
 * Player id to score
 */
export interface IScoreBoardInfo {
  [id: string]: {
    score: number;
    bid: number;
  };
}

/**
 * Round -> Player id to bid & score adjustments
 */
export interface IHistoryInfo {
  [roundId: number]: {
    cards: number;
    players: {
      [id: string]: {
        bid: number;
        scoreAdjustment: number;
      };
    };
  };
}
