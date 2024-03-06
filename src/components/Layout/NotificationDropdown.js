import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from 'reactstrap';
import SimpleBar from 'simplebar-react';

//Import images
import { getMyNotifcations } from '../../helpers/catalogos/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { addNotifications } from '../../redux/notificationsSlide';
import getRemainTime from '../../utils/getRemainTime';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

function NotificationDropdown() {
	const [menu, setMenu] = useState(false);
	const dispatch = useDispatch();
	const { items, loading, page } = useSelector((state) => state.notification);
	const location = useLocation();

	useEffect(() => {
		const fecthApiNotifications = async () => {
			try {
				const response = await getMyNotifcations();
				dispatch(addNotifications(response));
			} catch (error) {}
		};
		if (page !== 'home' || location.pathname === '/dashboard') {
			fecthApiNotifications();
		}
	}, [dispatch]);

	return (
		<>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="dropdown d-inline-block"
				tag="li"
			>
				<DropdownToggle
					className="btn header-item noti-icon"
					tag="button"
					id="page-header-notifications-dropdown"
				>
					<i
						className={`bx bx-bell ${
							items.length > 0 ? 'bx-tada' : ''
						}`}
					/>
					<span className="badge bg-danger rounded-pill">
						{items.length}
					</span>
				</DropdownToggle>

				{loading ? (
					<DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
						<div className="p-3 text-center">
							<div
								className="spinner-border text-info m-1"
								role="status"
							>
								<span className="sr-only">Loading...</span>
							</div>
						</div>
					</DropdownMenu>
				) : (
					<DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
						<div className="p-3 bg-light">
							<Row className="align-items-center">
								<Col>
									<h6 className="m-0">{`${
										items.length === 0
											? 'No hay notificaciones'
											: 'Notificaciones'
									}`}</h6>
								</Col>
							</Row>
						</div>
						{items.length > 0 && (
							<>
								<SimpleBar style={{ height: '230px' }}>
									<ul class="list-group list-group-flush text-reset">
										{items.slice(0, 5).map((item) => (
											<li
												class="list-group-item link-noti"
												key={item.id}
											>
												<Link
													to={`/notification/edit/${item.id}`}
												>
													<div className="d-flex">
														<div className="pe-2">
															<span className="badge border border-light rounded-circle bg-info p-1">
																<span className="visually-hidden" />
															</span>
														</div>
														<div>
															<h6 className="mt-0 mb-1">
																{item.comments}
															</h6>
															<div className="font-size-12 text-muted">
																<div className="hstack gap-3">
																	<p className="mb-0">
																		<i className="fas fa-calendar-alt me-1" />
																		{moment(
																			item.reminderDate,
																			'YYYY-MM-DD'
																		).format(
																			'DD/MM/YYYY'
																		)}
																	</p>
																	<div className="vr" />
																	<p className="mb-0">
																		{getRemainTime(
																			item.reminderDate
																		)}
																	</p>
																</div>
															</div>
														</div>
													</div>
												</Link>
											</li>
										))}
									</ul>
								</SimpleBar>
								<div className="p-2 border-top d-grid">
									<Link
										className="btn btn-sm btn-link font-size-14 text-center text-info"
										to="/notification"
									>
										<i className="mdi mdi-arrow-right-circle me-1"></i>{' '}
										<span key="t-view-more">Ver todas</span>
									</Link>
								</div>
							</>
						)}
					</DropdownMenu>
				)}
			</Dropdown>
		</>
	);
}

export default React.memo(NotificationDropdown);
