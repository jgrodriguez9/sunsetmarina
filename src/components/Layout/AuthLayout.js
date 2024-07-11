import { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';
import AutoLogout from '../Seguridad/AutoLogout';

const AuthLayout = (props) => {
	const [isMenuOpened, setIsMenuOpened] = useState(false);
	const openMenu = () => {
		setIsMenuOpened(!isMenuOpened);
	};

	return (
		<>
			<div id="layout-wrapper">
				<AutoLogout />
				<Header openMenu={openMenu} isMenuOpened={isMenuOpened} />
				<Navbar isMenuOpened={isMenuOpened} />
				{/* <Sidebar /> */}
				<div className="main-content">{props.children}</div>
				<Footer />
			</div>
		</>
	);
};

export default AuthLayout;
