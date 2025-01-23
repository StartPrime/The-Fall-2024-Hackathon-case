import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TypeFormLogin } from '../components/Auth/Login.tsx';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/' }),
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = api;
