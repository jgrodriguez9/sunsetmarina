import React, { useState, useEffect } from 'react';
import { Collapse } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import classname from 'classnames';
import { navigations } from '../../routes/navigation';

const Navbar = (props) => {
	const location = useLocation();
	const [app, setapp] = useState(null);

	useEffect(() => {
		var matchingMenuItem = null;
		var ul = document.getElementById('navigation');
		var items = ul.getElementsByTagName('a');
		for (var i = 0; i < items.length; ++i) {
			if (location.pathname === items[i].pathname) {
				matchingMenuItem = items[i];
				break;
			}
		}
		if (matchingMenuItem) {
			activateParentDropdown(matchingMenuItem);
		}
	});

	function activateParentDropdown(item) {
		item.classList.add('active');
		const parent = item.parentElement;
		if (parent) {
			parent.classList.add('active'); // li
			const parent2 = parent.parentElement;
			parent2.classList.add('active'); // li
			const parent3 = parent2.parentElement;
			if (parent3) {
				parent3.classList.add('active'); // li
				const parent4 = parent3.parentElement;
				if (parent4) {
					parent4.classList.add('active'); // li
					const parent5 = parent4.parentElement;
					if (parent5) {
						parent5.classList.add('active'); // li
						const parent6 = parent5.parentElement;
						if (parent6) {
							parent6.classList.add('active'); // li
						}
					}
				}
			}
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
								{navigations.map((navigation) => (
									<li
										key={navigation.id}
										className={`nav-item dropdown`}
									>
										<Link
											to={navigation.route}
											onClick={(e) => {
												if (
													navigation.items.length > 0
												) {
													e.preventDefault();
													if (app === navigation.id) {
														setapp(null);
													} else {
														setapp(navigation.id);
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
											{navigation.items.length > 0 && (
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
												{navigation.items.map(
													(item) => (
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
													)
												)}
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
