import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface AppState {
  name: string;
  isLoggedIn: boolean;
  lobbyCode: string;
  lobbyUUID: string | null;
  playerUUID: string | null;
}

const initialState: AppState = {
  isLoggedIn: false,
  lobbyCode: '',
  lobbyUUID: null,
  name: '',
  playerUUID: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
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
  setIsLoggedIn,
  setLobbyCode,
  setLobbyUUID,
  setName,
} = appSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.app.isLoggedIn;
export const selectName = (state: RootState) => state.app.name;
export const selectLobbyCode = (state: RootState) => state.app.lobbyCode;
export const selectLobbyUUID = (state: RootState) => state.app.lobbyUUID;
export const selectPlayerUUID = (state: RootState) => state.app.playerUUID;

export default appSlice.reducer;
