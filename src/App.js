import { Navigate, Route, Routes, useMatch } from 'react-router-dom';
import {
	adminRoutes,
	authProtectedRoutes,
	cajeroRoutes,
	companyRoutes,
	contabilidadRoutes,
	operacionesRoutes,
	publicRoutes,
} from './routes';
import NonAuthLayout from './components/Layout/NonAuthLayout';
import AuthLayout from './components/Layout/AuthLayout';

import './assets/scss/theme.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserLoguedInfo } from './helpers/auth';
import { setUser } from './redux/userSlice';
import NotFoundPage from './pages/Utility/NotFoundPage';
import { ToastContainer, toast } from 'react-toastify';
import { clearMessage } from './redux/messageSlice';
import {
	ROLE_ADMINISTRACION,
	ROLE_CAJA,
	ROLE_COMPANIA,
	ROLE_CONTABILIDAD,
	ROLE_OPERACIONES,
} from './constants/roles';
import SpinLoader from './components/Loader/SpinLoader';
import useUser from './hooks/useUser';

let loading = true;
function App() {
	const isLoginUrl = useMatch('/login');
	const [authRoutes, setAuthRoutes] = useState(authProtectedRoutes);
	const user = useUser();
	const message = useSelector((state) => state.message);
	const dispatch = useDispatch();
	useEffect(() => {
		if (user?.username) {
			if (user.roles.includes(ROLE_ADMINISTRACION)) {
				setAuthRoutes((prev) => [...prev, ...adminRoutes]);
			}
			if (user.roles.includes(ROLE_COMPANIA)) {
				setAuthRoutes((prev) => [...prev, ...companyRoutes]);
			}
			if (user.roles.includes(ROLE_CONTABILIDAD)) {
				setAuthRoutes((prev) => [...prev, ...contabilidadRoutes]);
			}
			if (user.roles.includes(ROLE_OPERACIONES)) {
				setAuthRoutes((prev) => [...prev, ...operacionesRoutes]);
			}
			if (user.roles.includes(ROLE_CAJA)) {
				setAuthRoutes((prev) => [...prev, ...cajeroRoutes]);
			}
			loading = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.username]);

	useEffect(() => {
		if (sessionStorage.getItem('sunsetadmiralauth')) {
			async function fetchUserInfoApi() {
				const response = await getUserLoguedInfo();
				const user = {
					...response,
					...JSON.parse(sessionStorage.getItem('sunsetadmiralauth')),
				};
				dispatch(setUser(user));
			}
			fetchUserInfoApi();
		}
	}, [dispatch]);

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

	if (loading && !isLoginUrl && user) {
		return (
			<div className="d-flex flex-row justify-content-center items-align-center mt-5">
				<SpinLoader />
			</div>
		);
	}

	return (
		<>
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
