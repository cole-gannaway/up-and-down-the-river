import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface AppState {
  name: string;
  lobbyCode: string;
  lobbyUUID: string | null;
  playerUUID: string | null;
}

const initialState: AppState = {
  lobbyCode: '',
  lobbyUUID: null,
  name: '',
  playerUUID: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  
    setLobbyCode: (state, action: PayloadAction<string>) => {
      state.lobbyCode = action.payload;
    },
    setLobbyUUID: (state, action: PayloadAction<string | null>) => {
      state.lobbyUUID = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setPlayerUUID: (state, action: PayloadAction<string | null>) => {
      state.playerUUID = action.payload;
    },
  },
});

export const {
  setLobbyCode,
  setLobbyUUID,
  setName,
  setPlayerUUID
} = appSlice.actions;

export const selectName = (state: RootState) => state.app.name;
export const selectLobbyCode = (state: RootState) => state.app.lobbyCode;
export const selectLobbyUUID = (state: RootState) => state.app.lobbyUUID;
export const selectPlayerUUID = (state: RootState) => state.app.playerUUID;

export default appSlice.reducer;
