import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const backendApi = createApi({
    reducerPath: 'backendApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers, { getState }) => {},
    }),
    endpoints: () => ({})
})

export default backendApi