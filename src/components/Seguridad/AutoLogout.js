import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLogout } from '../../helpers/auth';

const timeout = 600000; // 10 minutes

const AutoLogout = () => {
	const navigate = useNavigate();

	useEffect(() => {
		let timeoutId;

		const resetTimeout = () => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(logout, timeout);
		};

		const logout = async () => {
			// Clear any authentication tokens or user data here
			sessionStorage.removeItem('sunsetadmiralauth');
			// Redirect to the login page
			navigate('/login');
			await postLogout();
		};

		// Set up event listeners to reset the timeout on user activity
		const events = [
			'mousemove',
			'mousedown',
			'click',
			'scroll',
			'keypress',
		];

		events.forEach((event) => window.addEventListener(event, resetTimeout));

		// Set the initial timeout
		resetTimeout();

		// Clean up event listeners and timeout on component unmount
		return () => {
			clearTimeout(timeoutId);
			events.forEach((event) =>
				window.removeEventListener(event, resetTimeout)
			);
		};
	}, [navigate]);

	return null; // This component doesn't render anything
};

export default AutoLogout;
