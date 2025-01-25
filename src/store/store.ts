import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthPageSlice from './slices/AuthPageSlice.slice.ts';
import UserSlice from './slices/User.slice.ts';
import TaskSlice from './slices/Task.slice.ts';
import { api } from './Api.ts';

const rootReducer = combineReducers({
  authPage: AuthPageSlice,
  userData: UserSlice,
  task: TaskSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['authPage', 'userData', 'task'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, persistedReducer },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
