import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import CardMain from '../../components/Common/CardMain';
import DockImage from '../../components/Dock/DockImage';

function Dock() {
	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs title={'Muelle'} breadcrumbItem={'Muelle'} />
					<Row className="pb-5">
						<Col lg="12">
							<CardMain title="Muelle" children={<DockImage />} />
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
}

export default Dock;
