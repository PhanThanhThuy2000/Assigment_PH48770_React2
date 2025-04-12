import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import shippingReducer from './shippingSlice';
// Configure the Redux store
export const store = configureStore({
    reducer: {
        shipping: shippingReducer,
        auth: authReducer, // Add the auth reducer to the store
    },
});

// Define the RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;