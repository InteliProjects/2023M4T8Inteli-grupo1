import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/reducerAuthentications';
import apiBackend from '../services/api-backend';
import reducerProduct from './reducers/reducerProduct';
import reducerLocalizacoes from './reducers/reducerLocalizacoes'
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import authMiddleware from '../middlewares/isLogged';

const rootReducer = combineReducers({
    auth: authReducer,
    product: reducerProduct,
    localizacoes: reducerLocalizacoes,
    [apiBackend.reducerPath]: apiBackend.reducer,
});

const persistConfig = {
    key:'statusLogged',
    storage,
    whitelist: ['auth', 'product']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiBackend.middleware).concat(authMiddleware),
        }
);

export const persistor = persistStore(Store);

export default Store;