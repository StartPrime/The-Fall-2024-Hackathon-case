import { createSlice } from '@reduxjs/toolkit'

// Определение интерфейса состояния
interface AuthPageState {
	page: string
}

const AuthPageSlice = createSlice({
	name: 'AuthPageSlice',
	initialState: {
		page: 'login',
	} as AuthPageState, // Указание типа состояния
	reducers: {
		setPage: (state, action) => {
			state.page = action.payload
		},
	},
})

export const { setPage } = AuthPageSlice.actions
export default AuthPageSlice.reducer
