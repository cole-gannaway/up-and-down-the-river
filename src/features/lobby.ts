import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import {
  ILobbyData,
  IHistoryInfo,
  IScoreBoardInfo,
} from '../interfaces/ILobbyData';

const initialState: ILobbyData = {
  lobbyname: '',
  scoreboard: {},
  history: {},
};

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLobbyName: (state, action: PayloadAction<string>) => {
      state.lobbyname = action.payload;
    },
    updateLobbyScoreboard: (
      state,
      action: PayloadAction<Partial<IScoreBoardInfo>>
    ) => {
      // hard coded updates
      Object.entries(action.payload).forEach((entry) => {
        const key = entry[0];
        const val = entry[1];
        if (val) {
          state.scoreboard[key].bid = val.bid;
          state.scoreboard[key].score = val.score;
        }
      });
    },
    setLobbyScoreboard: (state, action: PayloadAction<IScoreBoardInfo>) => {
      state.scoreboard = action.payload;
    },
    setLobbyHistory: (state, action: PayloadAction<IHistoryInfo>) => {
      state.history = action.payload;
    },
  },
});

export const { setLobbyName, setLobbyScoreboard, setLobbyHistory } =
  lobbySlice.actions;

export const selectLobbyName = (state: RootState) => state.lobby.lobbyname;
export const selectLobbyScoreboard = (state: RootState) =>
  state.lobby.scoreboard;
export const selectLobbyHistory = (state: RootState) => state.lobby.history;

export default lobbySlice.reducer;
