import { createSlice } from '@reduxjs/toolkit';
import { getLocalizacaoBySnBarCode } from '../actions/actionLocalizacoes';
import { LOCALIZACOES_STATUS } from '../constants/constantLocalizacoes';

const localizacoesSlice = createSlice({
    name: 'localizacoes',
    initialState: {
        status: LOCALIZACOES_STATUS.STANDARD,
        error: null,
        localizacoes: [],
    },
    reducers: {},
    extraReducers: {
        [getLocalizacaoBySnBarCode.pending]: (state) => {
            state.status = LOCALIZACOES_STATUS.LOADING;
        },
        [getLocalizacaoBySnBarCode.fulfilled]: (state, action) => {
            state.status = LOCALIZACOES_STATUS.SUCCESS;
            state.localizacoes = action.payload;
        },
        [getLocalizacaoBySnBarCode.rejected]: (state, action) => {
            state.status = LOCALIZACOES_STATUS.ERROR;
            state.error = action.payload;
        },
    },
});

export default localizacoesSlice.reducer;