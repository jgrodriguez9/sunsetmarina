import { useNavigate } from 'react-router-dom';

function Logout() {
	const navigate = useNavigate();
	sessionStorage.removeItem('sunsetadmiralauth');
	navigate('/login');
	return <></>;
}

export default Logout;
