import { createSlice } from '@reduxjs/toolkit';
import { getProducts, addProduct } from '../actions/actionProduct';
import { PRODUCT_STATUS } from '../constants/constantProduct';

const productSlice = createSlice({
    name: 'product',
    initialState: {
        status: PRODUCT_STATUS.STANDARD,
        error: null,
        products: [],
    },
    reducers: {},
    extraReducers: {
        [getProducts.pending]: (state) => {
            state.status = PRODUCT_STATUS.LOADING;
        },
        [getProducts.fulfilled]: (state, action) => {
            state.status = PRODUCT_STATUS.SUCCESS;
            state.products = action.payload;
        },
        [getProducts.rejected]: (state, action) => {
            state.status = PRODUCT_STATUS.ERROR;
            state.error = action.payload;
        },
        [addProduct.fulfilled]: (state, action) => {
            state.products = action.payload
            state.status = PRODUCT_STATUS.SUCCESS;
        },
        [addProduct.rejected]: (state, action) => {
            state.status = PRODUCT_STATUS.ERROR;
            state.error = action.payload;
        },
    },
});

export default productSlice.reducer;
