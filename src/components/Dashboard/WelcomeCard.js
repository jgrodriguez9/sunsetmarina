import { useSelector } from 'react-redux';
import { Row, Col, Card } from 'reactstrap';
import profileImg from '../../assets/images/profile-img.png';
import TooltipDescription from '../Common/TooltipDescription';

const WelcomeCard = () => {
	const user = useSelector((state) => state.user);

	return (
		<>
			<Card className="overflow-hidden shadow-sm">
				<div className="bg-primary bg-soft">
					<Row>
						<Col xs="7">
							<div className="text-primary p-3">
								<h5 className="text-primary">{user?.name}</h5>
								<p className="text-truncate" id="roles">
									{user?.roles.join(' | ')}
								</p>
								<TooltipDescription
									text={user?.roles.join(' | ')}
									id="roles"
								/>
							</div>
						</Col>
						<Col xs="5" className="align-self-end">
							<img
								src={profileImg}
								alt=""
								className="img-fluid"
							/>
						</Col>
					</Row>
				</div>
			</Card>
		</>
	);
};
export default WelcomeCard;
