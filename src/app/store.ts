import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import lobbyReducer from '../features/lobby';
import appStateReducer from '../features/app-state';

export const store = configureStore({
  reducer: {
    app: appStateReducer,
    lobby: lobbyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
