import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownToggle } from 'reactstrap';
import LogoutLink from './LogoutLink';

function ProfileMenu() {
	const [menu, setMenu] = useState(false);
	const user = useSelector((state) => state.user);

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
				<LogoutLink />
			</Dropdown>
		</>
	);
}

export default ProfileMenu;
