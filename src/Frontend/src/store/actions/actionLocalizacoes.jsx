import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const backend = 'http://localhost:3000';

export const getLocalizacaoBySnBarCode = createAsyncThunk(
    '/localizacoes',
    async ({ snBarCode }, thunkAPI) => {
        try {

            const response = await axios.get(
                `${backend}/localizacoes?sn_bar_code=${snBarCode}`,
            );

            const data = response.data;

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);