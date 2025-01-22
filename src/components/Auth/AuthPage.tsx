import Login from './Login/Login'
import classes from './AuthPage.module.scss'
import { useSelector } from 'react-redux'
import Register from './Register/Register'

interface AuthPageState {
	page: string
}

export default function AuthPage() {
	const page = useSelector(
		(state: { authPage: AuthPageState }) => state.authPage.page
	)

	return (
		<div className={classes.container}>
			{page === 'login' ? <Login /> : <Register />}
		</div>
	)
}
