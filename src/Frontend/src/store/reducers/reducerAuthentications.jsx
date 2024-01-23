import { createSlice } from '@reduxjs/toolkit';
import { userLogin, userRegister } from '../actions/actionAuthentications';
import { AUTH_STATUS, AUTH_ACTIONS } from '../constants/constantAuthentication';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: AUTH_STATUS.STANDARD,
        error: null,
        isLogged: false,    
    },
    reducers: {
        userLogout: (state) => {
            state.isLogged = false;
            state.status = AUTH_STATUS.STANDARD;
            state.error = null;
        },
    },
    extraReducers: {
        [userLogin.pending]: (state, action) => {
            state.status = AUTH_STATUS.LOADING;
        },
        [userLogin.fulfilled]: (state, action) => {
            state.status = AUTH_STATUS.SUCCESS;
            state.isLogged = true;
        },
        [userLogin.rejected]: (state, action) => {
            state.status = AUTH_STATUS.ERROR;
            state.error = action.payload;
        },
        [userRegister.pending]: (state, action) => {
            state.status = AUTH_STATUS.LOADING;
        },
        [userRegister.fulfilled]: (state, action) => {
            state.status = AUTH_STATUS.SUCCESS;
            state.isLogged = true;
        },
        [userRegister.rejected]: (state, action) => {
            state.status = AUTH_STATUS.ERROR;
            state.error = action.payload;
        },
    },
});

export const { userLogout } = authSlice.actions;
export default authSlice.reducer;