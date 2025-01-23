import { createSlice } from '@reduxjs/toolkit';

interface AuthPageState {
  page: string;
}

const AuthPageSlice = createSlice({
  name: 'AuthPageSlice',
  initialState: {
    page: 'login',
  } as AuthPageState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setPage } = AuthPageSlice.actions;
export default AuthPageSlice.reducer;
