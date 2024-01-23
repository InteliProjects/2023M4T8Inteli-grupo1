import axios from 'axios';
import { createAsyncThunk } from "@reduxjs/toolkit";

const backend = 'http://localhost:3000';

export const userLogin = createAsyncThunk(
    '/cadastros/login',
    async ({ email, senha }, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const response = await axios.post(
                `${backend}/cadastros/login`,
                { email, senha },
                config
            );

            const data = response.data;

        } catch (error) {   
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const userRegister = createAsyncThunk(
    '/cadastros/register',
    async ({ email, senha }, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const response = await axios.post(
                `${backend}/cadastros/register`,
                {  email, senha },
                config
            );

            const data = response.data;

        } catch (error) {   
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);
