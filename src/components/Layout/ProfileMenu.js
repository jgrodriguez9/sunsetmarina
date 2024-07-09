import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { postLogout } from '../../helpers/auth';

function ProfileMenu() {
	const navigate = useNavigate();
	const [menu, setMenu] = useState(false);
	const user = useSelector((state) => state.user);

	const handleLogout = async (e) => {
		e.preventDefault();
		sessionStorage.removeItem('sunsetadmiralauth');
		navigate('/login');
		await postLogout();
	};
	return (
		<>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="d-inline-block"
			>
				<DropdownToggle
					className="btn header-item "
					id="page-header-user-dropdown"
					tag="button"
				>
					<span className="d-xl-inline-block ms-2 me-1">
						{user?.name}
					</span>
					<i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu-end">
					<Link
						to="/#"
						className="dropdown-item"
						onClick={handleLogout}
					>
						<i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
						<span>Logout</span>
					</Link>
				</DropdownMenu>
			</Dropdown>
		</>
	);
}

export default ProfileMenu;
