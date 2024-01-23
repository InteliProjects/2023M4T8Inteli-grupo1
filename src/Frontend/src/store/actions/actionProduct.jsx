import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const backend = 'http://localhost:3000';

export const getProducts = createAsyncThunk(
    '/product',
    async (thunkAPI) => {
        try {
            const response = await axios.get(
                `${backend}/product`,
            );

            const data = response.data;

            return data;
        } catch (error) {   
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const addProduct = createAsyncThunk(
    'product/add',
    async (productData, thunkAPI) => {
        try {
            console.log(productData);
            const response = await axios.post(`${backend}/product`, productData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

