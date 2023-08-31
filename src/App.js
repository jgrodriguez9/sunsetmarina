import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
	adminRoutes,
	agentRoutes,
	authProtectedRoutes,
	managerRoutes,
	publicRoutes,
} from './routes';
import NonAuthLayout from './components/Layout/NonAuthLayout';
import AuthLayout from './components/Layout/AuthLayout';

import './assets/scss/theme.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserLogued } from './helpers/auth';
import { setUser } from './redux/userSlice';
import NotFoundPage from './pages/Utility/NotFoundPage';
import { ToastContainer, toast } from 'react-toastify';
import { clearMessage } from './redux/messageSlice';

function App() {
	const [authRoutes, setAuthRoutes] = useState(authProtectedRoutes);
	const user = useSelector((state) => state.user);
	const message = useSelector((state) => state.message);
	const dispatch = useDispatch();
	useMemo(() => {
		if (user.name) {
			if (user.roles.includes('ROLE_Administracion')) {
				setAuthRoutes([
					...authProtectedRoutes,
					...agentRoutes,
					...managerRoutes,
					...adminRoutes,
				]);
			} else if (user.roles.includes('ROLE_ADMIN')) {
				setAuthRoutes([
					...authProtectedRoutes,
					...agentRoutes,
					...managerRoutes,
				]);
			} else {
				//setAuthRoutes([...authProtectedRoutes, ...agentRoutes]);
			}
		}
	}, [user.name, user.roles]);

	useEffect(() => {
		if (sessionStorage.getItem('sunsetadmiralauth')) {
			async function fetchUserInfoApi() {
				const response = await getUserLogued();
				if (response.data.length > 0) {
					const user = {
						...response.data[0],
						...JSON.parse(
							sessionStorage.getItem('sunsetadmiralauth')
						),
					};
					dispatch(setUser(user));
				}
			}
			fetchUserInfoApi();
		}
	}, [sessionStorage.getItem('sunsetadmiralauth')]);

	useEffect(() => {
		if (message.type) {
			switch (message.type) {
				case 'success':
					toast.success(message.message, {
						onClose: () => {
							dispatch(clearMessage());
						},
					});
					break;
				case 'error':
					toast.error(message.message, {
						onClose: () => {
							dispatch(clearMessage());
						},
					});
					break;
				case 'warning':
					toast.warning(message.message, {
						onClose: () => {
							dispatch(clearMessage());
						},
					});
					break;
				case 'info':
					toast.info(message.message, {
						onClose: () => {
							dispatch(clearMessage());
						},
					});
					break;
				default:
					return;
			}
		}
	}, [message, dispatch]);

	return (
		<>
			<BrowserRouter>
				<Routes>
					{publicRoutes.map((route, idx) => (
						<Route
							path={route.path}
							element={
								<NonAuthLayout>{route.component}</NonAuthLayout>
							}
							key={idx}
							exact={true}
						/>
					))}

					{authRoutes.map((route, idx) => (
						<Route
							path={route.path}
							element={
								!sessionStorage.getItem('sunsetadmiralauth') ? (
									<Navigate to="/login" replace />
								) : (
									<AuthLayout>{route.component}</AuthLayout>
								)
							}
							key={idx}
							exact={true}
						/>
					))}
					<Route
						path={'*'}
						element={
							!sessionStorage.getItem('sunsetadmiralauth') ? (
								<Navigate to="/login" replace />
							) : (
								<NotFoundPage />
							)
						}
					/>
				</Routes>
			</BrowserRouter>
			<ToastContainer
				position="top-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
				theme="colored"
			/>
		</>
	);
}

export default App;
