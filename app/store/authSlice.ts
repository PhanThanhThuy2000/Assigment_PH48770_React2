// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    email: string;
    password: string;
    name: string; // Thêm trường này
    isAuthenticated: boolean;
    role: number | null;
}

const initialState: AuthState = {
    email: '',
    password: '',
    name: '', // Khởi tạo name
    isAuthenticated: false,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginInfo: (
            state,
            action: PayloadAction<{ email: string; password: string; name?: string }>
        ) => {
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.name = action.payload.name || state.name; // Lưu name nếu có
        },
        setAuthenticated: (
            state,
            action: PayloadAction<{ isAuthenticated: boolean; role: number }>
        ) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.role = action.payload.role;
        },
    },
});

export const { setLoginInfo, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;