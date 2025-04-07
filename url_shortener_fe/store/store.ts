import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { createWrapper } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import urlReducer from './slices/urlSlice';

// Create a noop storage for server-side
const createNoopStorage = () => {
  return {
    getItem() { return Promise.resolve(null) },
    setItem() { return Promise.resolve() },
    removeItem() { return Promise.resolve() }
  }
}

// Use appropriate storage depending on environment
const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], 
};

const rootReducer = combineReducers({
  user: userReducer,
  urls: urlReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

// Export using this pattern for Next.js to prevent multiple store instances
export const wrapper = createWrapper(() => store);