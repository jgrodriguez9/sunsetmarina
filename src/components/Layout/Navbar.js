import React, { useState } from 'react';
import { Collapse } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import classname from 'classnames';
import { navigations } from '../../routes/navigation';
import { useLayoutEffect } from 'react';

const Navbar = (props) => {
	const location = useLocation();
	const [app, setapp] = useState(null);

	useLayoutEffect(() => {
		let matchingMenuItem = null;
		const ul = document.getElementById('navigation');
		const items = ul.getElementsByTagName('a');
		removeActivation(items);
		for (let i = 0; i < items.length; ++i) {
			if (location.pathname === items[i].pathname) {
				matchingMenuItem = items[i];
				break;
			}
		}
		if (matchingMenuItem) {
			activateParentDropdown(matchingMenuItem);
		}
	}, [location.pathname]);

	const removeActivation = (items) => {
		for (let i = 0; i < items.length; ++i) {
			if (items[i].classList.contains('active')) {
				items[i].classList.remove('active');
			}
		}
	};

	function activateParentDropdown(item) {
		item.classList.add('active');
		const parent = item.parentElement;
		if (parent) {
			parent.classList.add('active'); // li
			const parent2 = parent.parentElement;
			parent2.classList.add('active'); // li
		}
		return false;
	}
	return (
		<React.Fragment>
			<div className="topnav">
				<div className="container-fluid">
					<nav
						className="navbar navbar-light navbar-expand-lg topnav-menu"
						id="navigation"
					>
						<Collapse
							isOpen={props.isMenuOpened}
							className="navbar-collapse"
							id="topnav-menu-content"
						>
							<ul className="navbar-nav">
								{navigations
									.filter((it) => it.show)
									.map((navigation) => (
										<li
											key={navigation.id}
											className={`nav-item dropdown`}
										>
											<Link
												to={navigation.route}
												onClick={(e) => {
													if (
														navigation.items
															.length > 0
													) {
														e.preventDefault();
														if (
															app ===
															navigation.id
														) {
															setapp(null);
														} else {
															setapp(
																navigation.id
															);
														}
													}
												}}
												className="nav-link dropdown-togglez arrow-none"
											>
												{navigation.classIcon && (
													<i
														className={
															navigation.classIcon
														}
													/>
												)}
												{navigation.label}
												{navigation.items.length >
													0 && (
													<div className="arrow-down"></div>
												)}
											</Link>
											{navigation.items.length > 0 && (
												<div
													className={classname(
														'dropdown-menu',
														{
															show:
																app ===
																navigation.id,
														}
													)}
												>
													{navigation.items
														.filter((it) => it.show)
														.map((item) => (
															<Link
																to={item.route}
																className="dropdown-item"
																key={item.id}
															>
																{item.classIcon && (
																	<i
																		className={
																			item.classIcon
																		}
																	/>
																)}
																{item.label}
															</Link>
														))}
												</div>
											)}
										</li>
									))}
							</ul>
						</Collapse>
					</nav>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Navbar;
