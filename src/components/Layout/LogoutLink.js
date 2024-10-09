import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu } from 'reactstrap';
import { hasCashRegisterAssign } from '../../helpers/caja/boardingPass';
import { postLogout } from '../../helpers/auth';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../redux/messageSlice';
import SimpleLoad from '../Loader/SimpleLoad';

const LogoutLink = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const checkCajaApi = async () => {
		try {
			await hasCashRegisterAssign();
			return true;
		} catch (error) {
			return false;
		}
	};

	const handleLogout = async (e) => {
		e.preventDefault();
		setLoading(true);
		const isAssigned = await checkCajaApi();
		setLoading(false);
		if (!isAssigned) {
			sessionStorage.removeItem('sunsetadmiralauth');
			navigate('/login');
			await postLogout();
		} else {
			dispatch(
				addMessage({
					type: 'warning',
					message: 'Debe cerrar su turno antes de salir del sistema',
				})
			);
		}
	};

	return (
		<DropdownMenu className="dropdown-menu-end">
			<Link to="/#" className="dropdown-item" onClick={handleLogout}>
				{isLoading ? (
					<SimpleLoad
						text=""
						extraClass="m-0 text-center text-primary"
					/>
				) : (
					<>
						<i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
						<span>Logout</span>
					</>
				)}
			</Link>
		</DropdownMenu>
	);
};

export default LogoutLink;
