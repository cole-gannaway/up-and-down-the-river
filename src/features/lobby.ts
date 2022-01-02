import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { LobbyData } from '../interfaces/ILobbyData';

export function createEmptyLobbyData(){
  const lobbyData : LobbyData = {
    metadata: {
      lobbyname: ''
    },
    live: {
      players: {},
      roundData: {
        cards: 7,
        isJeopardyMode: false,
        isJeopardyModeRoundFinished: false,
        round: 1,
      }
    },
    history: {},
  };
  return lobbyData;
}

const initialState: LobbyData = createEmptyLobbyData();

export const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLobbyData: (state, action: PayloadAction<LobbyData>) => {
      state.metadata = action.payload.metadata;
      state.live = action.payload.live;
      state.history = action.payload.history;
    },
  },
});

export const { setLobbyData } =
  lobbySlice.actions;

export const selectLobbyData = (state: RootState) => state.lobby;

export default lobbySlice.reducer;
