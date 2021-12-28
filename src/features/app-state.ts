import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

export interface AppState {
  name: string;
  joinedLobby: boolean;
  lobbyCode: string;
  lobbyUUID: string | null;
  offlineMode: boolean;
  cards: number;
}

const initialState: AppState = {
  cards: 7,
  joinedLobby: false,
  lobbyCode: '',
  lobbyUUID: null,
  name: '',
  offlineMode: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCards: (state, action: PayloadAction<number>) => {
      state.cards = action.payload;
    },
    setJoinedLobby: (state, action: PayloadAction<boolean>) => {
      state.joinedLobby = action.payload;
    },
    setLobbyCode: (state, action: PayloadAction<string>) => {
      state.lobbyCode = action.payload;
    },
    setLobbyUUID: (state, action: PayloadAction<string>) => {
      state.lobbyUUID = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
  },
});

export const {
  setCards,
  setJoinedLobby,
  setLobbyCode,
  setLobbyUUID,
  setName,
  setOfflineMode,
} = appSlice.actions;

export const selectCards = (state: RootState) => state.app.cards;
export const selectJoinedLobby = (state: RootState) => state.app.joinedLobby;
export const selectName = (state: RootState) => state.app.name;
export const selectLobbyCode = (state: RootState) => state.app.lobbyCode;
export const selectLobbyUUID = (state: RootState) => state.app.lobbyUUID;
export const selectOfflineMode = (state: RootState) => state.app.offlineMode;

export default appSlice.reducer;
